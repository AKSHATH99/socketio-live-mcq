/**
 * Gemini-backed question generation.
 *
 * The API is called over plain HTTPS with fetch so no extra dependency is
 * needed. The key is read from the environment on every call, which keeps the
 * module safe to require before the .env file has been loaded.
 */

const DEFAULT_MODEL = 'gemini-3.5-flash';

// Tried in order when the preferred model is unavailable or overloaded.
const FALLBACK_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite-preview',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-4-argon',
];

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const TOPICS = [
  { id: 'science', label: 'General science' },
  { id: 'mathematics', label: 'Mathematics' },
  { id: 'biology', label: 'Biology' },
  { id: 'physics', label: 'Physics' },
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'sports', label: 'Sports' },
  { id: 'general-knowledge', label: 'General knowledge' },
  { id: 'history', label: 'History' },
  { id: 'geography', label: 'Geography' },
  { id: 'english', label: 'English & language' },
  { id: 'computer-science', label: 'Computer science' },
  { id: 'civics', label: 'Civics & constitution' },
  { id: 'health', label: 'Health & hygiene' },
  { id: 'current-affairs', label: 'Current affairs' },
  { id: 'mixed', label: 'Mixed topics' },
];

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

const AUDIENCES = [
  { id: 'grade-3', label: 'Grade 3' },
  { id: 'grade-4', label: 'Grade 4' },
  { id: 'grade-5', label: 'Grade 5' },
  { id: 'grade-6', label: 'Grade 6' },
  { id: 'grade-7', label: 'Grade 7' },
  { id: 'grade-8', label: 'Grade 8' },
  { id: 'grade-9', label: 'Grade 9' },
  { id: 'grade-10', label: 'Grade 10' },
  { id: 'grade-11', label: 'Grade 11' },
  { id: 'grade-12', label: 'Grade 12' },
  { id: 'age-8', label: 'Age 8' },
  { id: 'age-10', label: 'Age 10' },
  { id: 'age-12', label: 'Age 12' },
  { id: 'age-14', label: 'Age 14' },
  { id: 'age-16', label: 'Age 16' },
  { id: 'age-18', label: 'Age 18' },
  { id: 'adult', label: 'Adult' },
];

const getApiKey = () => {
  const raw = process.env.GEMINI_API_KEY || '';

  // Values in .env files are often quoted - strip the quotes.
  return raw.trim().replace(/^["'](.*)["']$/, '$1');
};

const stripQuotes = (value) => {
  const trimmed = String(value || '').trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
};

const findLabel = (list, id) => {
  const match = list.find((item) => item.id === id);
  return match ? match.label : id;
};

const buildPrompt = ({ audience, topic, difficulty, count, instruction }) => {
  const audienceLabel = findLabel(AUDIENCES, audience);
  const topicLabel = findLabel(TOPICS, topic);
  const difficultyLabel = findLabel(DIFFICULTIES, difficulty);

  const custom = instruction && instruction.trim()
    ? `\nAdditional instructions from the teacher (follow them closely):\n"""${instruction.trim()}"""\n`
    : '';

  return `You are an expert teacher creating multiple-choice questions for a live classroom quiz.

Requirements:
- Write exactly ${count} multiple-choice questions.
- Target audience: ${audienceLabel}.
- Topic: ${topicLabel}.
- Difficulty: ${difficultyLabel}.
- Each question must have exactly 4 distinct options.
- Exactly one option must be correct.
- The "answer" field must be the exact text of the correct option.
- Keep every question self-contained and unambiguous.
- Do not number the questions or repeat the topic in the question text.
- Vary the question style (recall, application, reasoning) and keep the options plausible.
- Keep questions appropriate for a classroom setting and factually correct.
${custom}
Return only the JSON object described by the schema.`;
};

const RESPONSE_SCHEMA = {
    type: 'object',
    properties: {
        questions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    question: { type: 'string' },
                    options: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                    answer: { type: 'string' },
                },
                required: ['question', 'options', 'answer'],
            },
        },
    },
    required: ['questions'],
};

const parseModelJson = (text) => {
    const trimmed = String(text || '').trim();

    if (!trimmed) {
        throw new Error('Gemini returned an empty response.');
    }

    try {
        return JSON.parse(trimmed);
    } catch {
        // Fall back to the first JSON object in the payload.
        const match = trimmed.match(/\{[\s\S]*\}/);

        if (match) {
            return JSON.parse(match[0]);
        }

        throw new Error('Gemini returned a response that could not be parsed.');
    }
};

const normaliseQuestions = (questions) => {
    if (!Array.isArray(questions)) return [];

    return questions
        .map((item) => {
            const options = Array.isArray(item?.options)
                ? item.options.map((option) => String(option).trim()).filter(Boolean)
                : [];

            const answer = String(item?.answer || '').trim();

            return {
                question: String(item?.question || '').trim(),
                options,
                answer,
            };
        })
        .filter((item) => item.question && item.options.length >= 2 && item.answer);
};

const callGemini = async (apiKey, modelName, prompt) => {
  const response = await fetch(
    `${API_BASE}/${modelName}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    }
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.error?.message || `Gemini request failed with status ${response.status}.`;
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }

  const text = payload?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('');

  return parseModelJson(text);
};

/**
 * Ask Gemini for a set of questions.
 */
const generateQuestions = async ({
    audience,
    topic,
    difficulty,
    count,
    instruction,
    model,
}) => {
    const apiKey = getApiKey();

    if (!apiKey) {
        const error = new Error('GEMINI_API_KEY is not configured on the server.');
        error.statusCode = 503;
        throw error;
    }

    const prompt = buildPrompt({ audience, topic, difficulty, count, instruction });

    const preferred = stripQuotes(model || process.env.GEMINI_MODEL || DEFAULT_MODEL);
    const candidates = [
      preferred,
      ...FALLBACK_MODELS.filter((name) => name !== preferred),
    ];

    let lastError = null;

    for (const modelName of candidates) {
      try {
        const parsed = await callGemini(apiKey, modelName, prompt);
        const questions = normaliseQuestions(parsed.questions);

        if (questions.length === 0) {
          lastError = new Error('Gemini did not return any usable questions.');
          continue;
        }

        return questions;
      } catch (error) {
        lastError = error;

        // A bad key or a malformed request will not be fixed by another model.
        if (error.statusCode === 400 || error.statusCode === 401 || error.statusCode === 403) {
          throw error;
        }

        console.warn(`[gemini] "${modelName}" failed: ${error.message}`);
      }
    }

    const error = lastError || new Error('Gemini did not return any usable questions.');
    error.statusCode = error.statusCode === 429 ? 429 : 502;
    throw error;
};

module.exports = {
    generateQuestions,
    TOPICS,
    DIFFICULTIES,
    AUDIENCES,
    DEFAULT_MODEL,
};
