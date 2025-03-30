const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const dbOperations = require('../controllers/dbOperations');

// Show booking form
router.get('/new/:showId', isLoggedIn, async (req, res) => {
    try {
        const show = await dbOperations.getShowById(req.params.showId);
        if (!show) {
            return res.status(404).render('404', { 
                title: '404 Not Found - Movie Booking System' 
            });
        }
        res.render('bookings/new', { 
            show,
            title: `Book Tickets - ${show.movie.title} - Movie Booking System`
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Create booking
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const booking = await dbOperations.createBooking({
            ...req.body,
            user: req.session.user.id
        });
        res.render('bookings/success', {
            booking,
            title: 'Booking Confirmed - Movie Booking System'
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// View booking details
router.get('/:id', isLoggedIn, async (req, res) => {
    try {
        const booking = await dbOperations.getBookingById(req.params.id);
        res.render('bookings/show', { 
            booking,
            title: 'Booking Details - Movie Booking System'
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

module.exports = router; 