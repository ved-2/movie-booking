const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { isNotLoggedIn } = require('../middleware/auth');

// Login page - only accessible if not logged in
router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('auth/login', { 
        title: 'Login - Movie Booking System',
        returnTo: req.session.returnTo || '/'
    });
});

// Register page - only accessible if not logged in
router.get('/register', isNotLoggedIn, (req, res) => {
    res.render('auth/register', { 
        title: 'Register - Movie Booking System' 
    });
});

// Login process
router.post('/login', isNotLoggedIn, async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check for admin login
        if (email === 'admin@admin.com' && password === 'admin123') {
            req.session.user = {
                id: 'admin',
                username: 'admin',
                email: 'admin@admin.com',
                role: 'admin'
            };
            return res.redirect('/admin/dashboard');
        }

        // For regular users, just create a new account if it doesn't exist
        let user = await User.findOne({ email });
        
        if (!user) {
            // Create new user account
            user = new User({
                username: email.split('@')[0],
                email,
                password,
                role: 'user'
            });
            await user.save();
        }

        // Log the user in
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        // Redirect to the originally requested URL or home
        const returnTo = req.session.returnTo || '/';
        delete req.session.returnTo;
        res.redirect(returnTo);
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', {
            error: 'An error occurred during login',
            title: 'Login - Movie Booking System'
        });
    }
});

// Register process - Simplified for users
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Create new user without restrictions
        const user = new User({
            username,
            email,
            password,
            role: 'user'
        });

        await user.save();
        
        // Automatically log in after registration
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        res.redirect('/');
    } catch (error) {
        console.error('Registration error:', error);
        res.render('auth/register', {
            error: 'An error occurred during registration',
            title: 'Register - Movie Booking System'
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router; 