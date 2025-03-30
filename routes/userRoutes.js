const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const dbOperations = require('../controllers/dbOperations');

// User profile
router.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const user = await dbOperations.getUserById(req.session.user.id);
        res.render('user/profile', {
            user,
            title: 'My Profile - Movie Booking System'
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// User bookings
router.get('/bookings', isLoggedIn, async (req, res) => {
    try {
        const bookings = await dbOperations.getBookingsByUser(req.session.user.id);
        res.render('user/bookings', {
            bookings,
            title: 'My Bookings - Movie Booking System'
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

module.exports = router; 