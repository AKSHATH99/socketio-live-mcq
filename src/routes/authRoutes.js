const express = require('express');
const passport = require('passport');
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

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: role
    })(req, res, next);
});

/**
 * Step 2 — Google callback
 */
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    (req, res) => {
        const role = req.query.state; // Comes back from Google
        const token = jwt.sign(
            { id: req.user.id, role },
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
            return res.redirect(`/student/${req.user.id}`);
        } else if (role === 'teacher') {
            return res.redirect(`/teacher/${req.user.id}`);
        } else {
            return res.redirect(`/`);
        }
    }
);

module.exports = router;
