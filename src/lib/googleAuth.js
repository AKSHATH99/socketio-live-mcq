const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { prisma } = require('../lib/prisma');

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

// The strategy is only registered when credentials are present. Registering it
// eagerly with missing credentials throws ("OAuth2Strategy requires a clientID
// option") and takes the whole server down, so Google sign-in is disabled
// instead of crashing the process.
const isGoogleAuthEnabled = Boolean(clientID && clientSecret);

if (isGoogleAuthEnabled) {
    passport.use(
        new GoogleStrategy(
            {
                clientID,
                clientSecret,
                callbackURL: process.env.NODE_ENV === 'production' ? 'https://socketio-live-mcq.onrender.com/api/auth/google/callback' : 'http://localhost:3000/api/auth/google/callback',
                passReqToCallback: true
            },
            async (req, accessToken, refreshToken, profile, done) => {
                try {
                    const role = req.query.state; // student or teacher
                    let user;

                    if (role === 'student') {
                        user = await prisma.student.findUnique({
                            where: { email: profile.emails[0].value }
                        });
                        if (!user) {
                            user = await prisma.student.create({
                                data: {
                                    name: profile.displayName,
                                    email: profile.emails[0].value,
                                    password: '' // Not used for Google users
                                }
                            });
                        }
                    } else if (role === 'teacher') {
                        user = await prisma.teacher.findUnique({
                            where: { email: profile.emails[0].value }
                        });
                        if (!user) {
                            user = await prisma.teacher.create({
                                data: {
                                    name: profile.displayName,
                                    email: profile.emails[0].value,
                                    password: ''
                                }
                            });
                        }
                    } else {
                        return done(new Error('Invalid role'), null);
                    }

                    done(null, user);
                } catch (err) {
                    done(err, null);
                }
            }
        )
    );
} else {
    console.warn('[auth] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set - Google sign-in is disabled.');
}

// For JWT-only usage, these can just be pass-throughs
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    let user = await prisma.student.findUnique({ where: { id } });
    if (!user) {
        user = await prisma.teacher.findUnique({ where: { id } });
    }
    done(null, user);
});

module.exports = passport;
module.exports.isGoogleAuthEnabled = isGoogleAuthEnabled;
