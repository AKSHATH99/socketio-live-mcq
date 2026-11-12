const express = require('express');
// Requiring the google auth module (not the raw passport package) guarantees the
// Google strategy is registered and exposes `isGoogleAuthEnabled`.
const passport = require('../lib/googleAuth.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * Step 1 — Redirect to Google with role in `state`
 * Example FE link:
 * /api/auth/google?role=student  OR  /api/auth/google?role=teacher
 */
router.get('/google', (req, res, next) => {
    const role = req.query.role; // 'student' or 'teacher'
    if (!role) return res.status(400).send('Missing role');

    if (!passport.isGoogleAuthEnabled) {
        console.warn('[auth] Google sign-in requested but credentials are not configured.');
        return res.redirect(`/${role}/auth/signin?error=google_unavailable`);
    }

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: role
    })(req, res, next);
});

/**
 * Step 2 — Google callback
 */
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user) => {
        const role = req.query.state;
        const signinPath =
            role === 'teacher' ? '/teacher/auth/signin' : '/student/auth/signin';

        if (err) {
            console.error('Google authentication error:', err);
            return res.redirect(`${signinPath}?error=google`);
        }
        if (!user) {
            return res.redirect(signinPath);
        }

        const token = jwt.sign(
            { id: user.id, role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Send JWT in cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Redirect by role
        if (role === 'student') {
            return res.redirect(`/student/${user.id}`);
        } else if (role === 'teacher') {
            return res.redirect(`/teacher/${user.id}`);
        } else {
            return res.redirect(`/`);
        }
    })(req, res, next);
});

module.exports = router;
