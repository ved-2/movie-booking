const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const dbOperations = require('../controllers/dbOperations');
const showController = require('../controllers/showController');

// Get all shows
router.get('/', async (req, res) => {
    try {
        const shows = await dbOperations.getAllShows();
        res.render('shows/index', { shows });
    } catch (error) {
        res.status(500).send('Error fetching shows');
    }
});

// Show new show form
router.get('/new', async (req, res) => {
    try {
        const movies = await dbOperations.getAllMovies();
        const theaters = await dbOperations.getAllTheaters();
        res.render('shows/new', { movies, theaters });
    } catch (error) {
        res.status(500).send('Error loading form');
    }
});

// Create new show
router.post('/', async (req, res) => {
    try {
        await dbOperations.createShow(req.body);
        res.redirect('/shows');
    } catch (error) {
        res.status(500).send('Error creating show');
    }
});

// Get shows for a movie
router.get('/movie/:movieId', async (req, res) => {
    try {
        const movie = await dbOperations.getMovieById(req.params.movieId);
        const shows = await dbOperations.getShowsByMovie(req.params.movieId);
        res.render('shows/index', { 
            movie, 
            shows,
            title: `${movie.title} Shows - Movie Booking System`
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Get show details
router.get('/:id', isLoggedIn, async (req, res) => {
    try {
        const show = await dbOperations.getShowById(req.params.id);
        res.render('shows/show', { 
            show,
            title: `Book Show - ${show.movie.title} - Movie Booking System`
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

router.get('/:id/book', isLoggedIn, showController.getBookingPage);

module.exports = router; 