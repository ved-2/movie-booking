const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const dbOperations = require('../controllers/dbOperations');

// Admin dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const movies = await dbOperations.getAllMovies();
        const shows = await dbOperations.getAllShows();
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

router.post('/shows', isAdmin, async (req, res) => {
    try {
        await dbOperations.createShow(req.body);
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

router.delete('/shows/:id', isAdmin, async (req, res) => {
    try {
        await dbOperations.deleteShow(req.params.id);
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Movie management routes
router.get('/movies/new', isAdmin, (req, res) => {
    res.render('admin/movies/new', {
        title: 'Add New Movie - Movie Booking System'
    });
});

router.post('/movies', isAdmin, async (req, res) => {
    try {
        await dbOperations.createMovie(req.body);
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Theater management routes
router.get('/theaters/new', isAdmin, (req, res) => {
    res.render('admin/theaters/new', {
        title: 'Add New Theater - Movie Booking System'
    });
});

router.post('/theaters', isAdmin, async (req, res) => {
    try {
        await dbOperations.createTheater(req.body);
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

module.exports = router; 