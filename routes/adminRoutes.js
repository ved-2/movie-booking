const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const dbOperations = require('../controllers/dbOperations');
const adminController = require('../controllers/adminController');

// Admin dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const movies = await dbOperations.getAllMovies();
        const shows = await adminController.getAllShows();
        const theaters = await dbOperations.getAllTheaters();
        
        res.render('admin/dashboard', {
            movies,
            shows,
            theaters,
            title: 'Admin Dashboard - Movie Booking System'
        });
    } catch (error) {
        res.status(500).render('error', {
            error,
            title: 'Error - Movie Booking System'
        });
    }
});

// Show management routes
router.get('/shows/new', isAdmin, async (req, res) => {
    try {
        const movies = await dbOperations.getAllMovies();
        const theaters = await dbOperations.getAllTheaters();
        res.render('admin/shows/new', {
            movies,
            theaters,
            title: 'Add New Show - Movie Booking System'
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

router.post('/shows', isAdmin, adminController.createShow);
router.get('/shows/:id/edit', isAdmin, adminController.getEditShow);
router.put('/shows/:id', isAdmin, adminController.updateShow);
router.delete('/shows/:id', isAdmin, adminController.deleteShow);

// Movie management routes
router.get('/movies/new', isAdmin, (req, res) => {
    res.render('admin/movies/new', {
        title: 'Add New Movie - Movie Booking System'
    });
});

router.post('/movies', isAdmin, adminController.createMovie);
router.get('/movies/:id/edit', isAdmin, adminController.getEditMovie);
router.put('/movies/:id', isAdmin, adminController.updateMovie);
router.delete('/movies/:id', isAdmin, adminController.deleteMovie);

// Theater management routes
router.get('/theaters/new', isAdmin, (req, res) => {
    res.render('admin/theaters/new', {
        title: 'Add New Theater - Admin Dashboard'
    });
});

router.post('/theaters', isAdmin, adminController.createTheater);
router.get('/theaters/:id/edit', isAdmin, adminController.getEditTheater);
router.put('/theaters/:id', isAdmin, adminController.updateTheater);
router.delete('/theaters/:id', isAdmin, adminController.deleteTheater);

// Helper function to generate seats
function generateSeats(rows, seatsPerRow) {
    const seats = [];
    const rowLetters = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));
    
    rowLetters.forEach(row => {
        for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
            const seatType = getSeatType(row, seatNum, seatsPerRow);
            seats.push({
                seatNumber: `${row}${seatNum}`,
                type: seatType,
                price: getSeatPrice(seatType)
            });
        }
    });
    
    return seats;
}

function getSeatType(row, seatNum, totalSeats) {
    // First two rows are VIP
    if (row <= 'B') return 'vip';
    // Middle rows and center seats are premium
    if (row <= 'F' && seatNum > Math.floor(totalSeats * 0.2) && seatNum <= Math.floor(totalSeats * 0.8)) {
        return 'premium';
    }
    return 'standard';
}

function getSeatPrice(type) {
    switch (type) {
        case 'vip': return 500;
        case 'premium': return 300;
        default: return 200;
    }
}

module.exports = router; 