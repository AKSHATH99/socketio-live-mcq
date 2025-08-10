const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Step 1: Redirect to Google for login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Step 2: Handle Google callback
router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        // Create JWT for our app
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Send JWT in cookie (so existing middleware works)
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        // Redirect to dashboard
        res.redirect('/dashboard');
    }
);

module.exports = router;
