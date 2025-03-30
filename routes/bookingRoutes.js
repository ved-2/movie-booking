const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const Booking = require('../models/booking');
const Show = require('../models/show');

// Get all bookings for current user
router.get('/my-bookings', isLoggedIn, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.session.user._id })
            .populate({
                path: 'show',
                populate: {
                    path: 'movie theater'
                }
            })
            .sort({ createdAt: -1 });

        res.render('bookings/my-bookings', { 
            bookings,
            title: 'My Bookings - Movie Booking System'
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        req.flash('error', 'Failed to load bookings');
        res.redirect('/');
    }
});

// Get specific booking
router.get('/:id', isLoggedIn, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate({
                path: 'show',
                populate: {
                    path: 'movie theater'
                }
            });

        if (!booking) {
            req.flash('error', 'Booking not found');
            return res.redirect('/bookings/my-bookings');
        }

        if (booking.user.toString() !== req.session.user._id.toString()) {
            req.flash('error', 'Not authorized');
            return res.redirect('/bookings/my-bookings');
        }

        res.render('bookings/show', { 
            booking,
            title: 'Booking Details - Movie Booking System'
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        req.flash('error', 'Failed to load booking details');
        res.redirect('/bookings/my-bookings');
    }
});

// Create new booking
router.post('/', isLoggedIn, async (req, res) => {
    try {
        console.log('Received booking request:', req.body);
        const { showId, selectedSeats, totalAmount } = req.body;
        
        // Log the extracted values
        console.log('Extracted values:', { showId, selectedSeats, totalAmount });

        // Validate required fields
        if (!showId || !selectedSeats || !totalAmount) {
            console.log('Missing fields:', {
                showId: !!showId,
                selectedSeats: !!selectedSeats,
                totalAmount: !!totalAmount
            });
            req.flash('error', 'Missing required booking information');
            return res.redirect(`/shows/${showId}/book`);
        }

        // Parse the selected seats from JSON string
        const parsedSeats = JSON.parse(selectedSeats);
        
        if (!parsedSeats || parsedSeats.length === 0) {
            req.flash('error', 'Please select seats to book');
            return res.redirect(`/shows/${showId}/book`);
        }

        const show = await Show.findById(showId);
        if (!show) {
            req.flash('error', 'Show not found');
            return res.redirect('/movies');
        }

        // Verify seats are available
        const unavailableSeats = parsedSeats.filter(seat => !show.availableSeats.includes(seat));
        if (unavailableSeats.length > 0) {
            req.flash('error', `Seats ${unavailableSeats.join(', ')} are no longer available`);
            return res.redirect(`/shows/${showId}/book`);
        }

        // Create the booking
        const booking = new Booking({
            user: req.session.user._id,
            show: showId,
            seats: parsedSeats,
            totalAmount: parseFloat(totalAmount)
        });

        // Update available seats
        show.availableSeats = show.availableSeats.filter(seat => !parsedSeats.includes(seat));

        // Save both booking and updated show
        await Promise.all([booking.save(), show.save()]);

        req.flash('success', 'Booking confirmed successfully!');
        res.redirect(`/bookings/${booking._id}`);
    } catch (error) {
        console.error('Error creating booking:', error);
        req.flash('error', 'Failed to create booking');
        res.redirect('/movies');
    }
});

// Cancel booking
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            req.flash('error', 'Booking not found');
            return res.redirect('/bookings/my-bookings');
        }

        if (booking.user.toString() !== req.session.user._id.toString()) {
            req.flash('error', 'Not authorized');
            return res.redirect('/bookings/my-bookings');
        }

        // Return seats to available seats
        const show = await Show.findById(booking.show);
        if (show) {
            show.availableSeats.push(...booking.seats);
            await show.save();
        }

        await booking.remove();
        req.flash('success', 'Booking cancelled successfully');
        res.redirect('/bookings/my-bookings');
    } catch (error) {
        console.error('Error cancelling booking:', error);
        req.flash('error', 'Failed to cancel booking');
        res.redirect('/bookings/my-bookings');
    }
});

module.exports = router; 