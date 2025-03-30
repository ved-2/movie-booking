const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { isNotLoggedIn } = require('../middleware/auth');

// Login choice page
router.get('/login-choice', isNotLoggedIn, (req, res) => {
    res.render('auth/login-choice', { 
        title: 'Choose Login Type - Movie Booking System'
    });
});

// User login page
router.get('/user-login', isNotLoggedIn, (req, res) => {
    res.render('auth/user-login', { 
        title: 'User Login - Movie Booking System'
    });
});

// Admin login page
router.get('/admin-login', isNotLoggedIn, (req, res) => {
    res.render('auth/admin-login', { 
        title: 'Admin Login - Movie Booking System'
    });
});

// User login process
router.post('/user-login', isNotLoggedIn, async (req, res) => {
    try {
        const { email, password } = req.body;
        
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

        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        res.redirect('/movies');
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/user-login', {
            error: 'An error occurred during login',
            title: 'User Login - Movie Booking System'
        });
    }
});

// Admin login process
router.post('/admin-login', isNotLoggedIn, async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (email === 'admin@admin.com' && password === 'admin123') {
            req.session.user = {
                id: 'admin',
                username: 'admin',
                email: 'admin@admin.com',
                role: 'admin'
            };
            return res.redirect('/admin/dashboard');
        }

        res.render('auth/admin-login', {
            error: 'Invalid admin credentials',
            title: 'Admin Login - Movie Booking System'
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.render('auth/admin-login', {
            error: 'An error occurred during login',
            title: 'Admin Login - Movie Booking System'
        });
    }
});

// Update the root login route to redirect to login choice
router.get('/login', (req, res) => {
    res.redirect('/auth/login-choice');
});

// Register page - only accessible if not logged in
router.get('/register', isNotLoggedIn, (req, res) => {
    res.render('auth/register', { 
        title: 'Register - Movie Booking System' 
    });
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