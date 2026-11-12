const { Redis } = require('@upstash/redis');
const dns = require('dns').promises;

/**
 * Resilient Redis access.
 *
 * Upstash is the primary store, but it must never be a hard dependency:
 *  - the Upstash database can be deleted / recreated, which makes the hostname
 *    stop resolving (ENOTFOUND) and takes the whole live-test flow down
 *  - the fallback keeps a single-instance deployment fully functional
 *
 * Every operation tries Upstash first and transparently falls back to an
 * in-process store that mimics the small subset of the Redis API we use
 * (get / set / del / incr / expire / zincrby / zrange).
 */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const hasUpstashConfig = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

let client = null;

if (hasUpstashConfig) {
    client = new Redis({
        url: UPSTASH_URL,
        token: UPSTASH_TOKEN,
    });
} else {
    console.warn('[redis] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set - using in-memory store.');
}

/* ------------------------------------------------------------------ */
/* In-memory fallback                                                  */
/* ------------------------------------------------------------------ */

const memoryKeys = new Map(); // key -> { value, expiresAt }
const memorySortedSets = new Map(); // key -> Map(member -> score)

const isExpired = (entry) => Boolean(entry && entry.expiresAt && entry.expiresAt <= Date.now());

const readMemoryValue = (key) => {
    const entry = memoryKeys.get(key);

    if (!entry) return null;
    if (isExpired(entry)) {
        memoryKeys.delete(key);
        return null;
    }

    return entry.value;
};

// Upstash auto-parses JSON payloads on GET, so mirror that behaviour.
const parseMaybeJson = (value) => {
    if (typeof value !== 'string') return value;

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

const memoryStore = {
    async get(key) {
        return parseMaybeJson(readMemoryValue(key));
    },

    async set(key, value, options = {}) {
        const ttl = options.ex ? Number(options.ex) * 1000 : null;

        memoryKeys.set(key, {
            value,
            expiresAt: ttl ? Date.now() + ttl : null,
        });

        return 'OK';
    },

    async del(key) {
        const existed = memoryKeys.delete(key);
        memorySortedSets.delete(key);
        return existed ? 1 : 0;
    },

    async incr(key) {
        const current = Number(readMemoryValue(key) ?? 0);
        const next = current + 1;

        const entry = memoryKeys.get(key);
        const expiresAt = entry && !isExpired(entry) ? entry.expiresAt : null;

        memoryKeys.set(key, { value: next, expiresAt });

        return next;
    },

    async expire(key, seconds) {
        const entry = memoryKeys.get(key);

        if (!entry || isExpired(entry)) return 0;

        entry.expiresAt = Date.now() + Number(seconds) * 1000;
        memoryKeys.set(key, entry);

        return 1;
    },

    async zincrby(key, increment, member) {
        let set = memorySortedSets.get(key);

        if (!set) {
            set = new Map();
            memorySortedSets.set(key, set);
        }

        const next = (set.get(member) ?? 0) + Number(increment);
        set.set(member, next);

        return next;
    },

    async zrange(key, start = 0, stop = -1, options = {}) {
        const set = memorySortedSets.get(key);

        if (!set) return [];

        const entries = [...set.entries()].sort((a, b) =>
            options.rev ? b[1] - a[1] : a[1] - b[1]
        );

        const from = start < 0 ? Math.max(0, entries.length + start) : start;
        const to = stop < 0 ? entries.length + stop : stop;
        const sliced = entries.slice(from, to + 1);

        if (!options.withScores) {
            return sliced.map(([member]) => member);
        }

        // Upstash returns a flat [member, score, member, score, ...] array.
        return sliced.flatMap(([member, score]) => [member, score]);
    },
};

/* ------------------------------------------------------------------ */
/* Failover wrapper                                                    */
/* ------------------------------------------------------------------ */

const RETRY_AFTER_MS = 30_000;

let upstashHealthy = hasUpstashConfig;
let lastFailureAt = 0;
let hasLoggedFailure = false;

/**
 * Resolve the Upstash hostname up front. When the database has been deleted the
 * host stops resolving, and every request would otherwise pay the full DNS
 * timeout before failing over. Probing once at boot keeps that latency off the
 * request path.
 */
const probeUpstash = async () => {
    if (!hasUpstashConfig) return false;

    try {
        const { hostname } = new URL(UPSTASH_URL);
        await dns.lookup(hostname);
        return true;
    } catch (error) {
        console.warn(
            `[redis] Upstash host "${UPSTASH_URL}" is unreachable (${error.code || error.message}). ` +
            'Live tests will use the in-memory store until it is reachable again.'
        );
        return false;
    }
};

const withFallback = async (operation, args) => {
    if (!client) {
        return memoryStore[operation](...args);
    }

    // The probe resolves fast (a failed DNS lookup is immediate) and keeps the
    // slow Upstash fetch attempt off the first request's path.
    await readyPromise;

    // Periodically retry Upstash after a failure so it recovers automatically
    // once the database is reachable again.
    if (!upstashHealthy && Date.now() - lastFailureAt > RETRY_AFTER_MS) {
        upstashHealthy = true;
    }

    if (upstashHealthy) {
        try {
            const result = await client[operation](...args);
            return result;
        } catch (error) {
            upstashHealthy = false;
            lastFailureAt = Date.now();

            if (!hasLoggedFailure) {
                hasLoggedFailure = true;
                console.error(
                    `[redis] Upstash "${operation}" failed (${error.message}). Falling back to the in-memory store. ` +
                    'Live tests will keep working, but cached data is not shared between instances.'
                );
            }
        }
    }

    return memoryStore[operation](...args);
};

const redis = {
    get: (key) => withFallback('get', [key]),
    set: (key, value, options) => withFallback('set', [key, value, options]),
    del: (key) => withFallback('del', [key]),
    incr: (key) => withFallback('incr', [key]),
    expire: (key, seconds) => withFallback('expire', [key, seconds]),
    zincrby: (key, increment, member) => withFallback('zincrby', [key, increment, member]),
    zrange: (key, start, stop, options) => withFallback('zrange', [key, start, stop, options]),
};

/**
 * Probes Upstash without blocking module load. Until the probe resolves we
 * optimistically try Upstash, so a healthy database has no added latency.
 */
const readyPromise = probeUpstash().then((reachable) => {
    if (!reachable && hasUpstashConfig) {
        upstashHealthy = false;
        lastFailureAt = Date.now();
    }
});

module.exports = { redis, hasUpstashConfig, ready: readyPromise };
