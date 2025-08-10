const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { prisma } = require('../lib/prisma');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Find or create teacher/student
        let user = await prisma.student.findUnique({
            where: { email: profile.emails[0].value }
        });

        if (!user) {
            user = await prisma.student.create({
                data: {
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: "", // Not needed for Google users
                }
            });
        }

        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

// Serialize/deserialize (required for passport sessions, but can be skipped if JWT only)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await prisma.student   .findUnique({ where: { id } });
    done(null, user);
});
