const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const dbOperations = require('../controllers/dbOperations');

// All routes require login
router.use(isLoggedIn);

// Get all movies
router.get('/', async (req, res) => {
    try {
        const movies = await dbOperations.getAllMovies();
        res.render('movies/index', { 
            movies,
            title: 'Movies - Movie Booking System'
        });
    } catch (error) {
        res.status(500).render('error', { error });
    }
});

// Show new movie form
router.get('/new', (req, res) => {
    res.render('movies/new');
});

// Create new movie
router.post('/', async (req, res) => {
    try {
        await dbOperations.createMovie(req.body);
        res.redirect('/movies');
    } catch (error) {
        res.status(500).send('Error creating movie');
    }
});

// Show single movie with its shows
router.get('/:id', async (req, res) => {
    try {
        const movie = await dbOperations.getMovieById(req.params.id);
        const shows = await dbOperations.getShowsByMovie(req.params.id);
        res.render('movies/show', { movie, shows, title: `${movie.title} - Movie Booking System` });
    } catch (error) {
        res.status(500).send('Error fetching movie details');
    }
});

// Add this new route for showing all shows
router.get('/:id/shows', async (req, res) => {
    try {
        const movie = await dbOperations.getMovieById(req.params.id);
        const shows = await dbOperations.getShowsByMovie(req.params.id);
        res.render('movies/shows', { 
            movie, 
            shows,
            title: `${movie.title} - Shows - Movie Booking System`
        });
    } catch (error) {
        res.status(500).render('error', {
            error,
            message: 'Error fetching show details',
            title: 'Error - Movie Booking System'
        });
    }
});

// Delete movie
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        await dbOperations.deleteMovie(req.params.id);
        // Delete associated shows
        await dbOperations.deleteShowsByMovie(req.params.id);
        res.redirect('/movies');
    } catch (error) {
        res.status(500).render('error', { 
            error,
            title: 'Error - Movie Booking System'
        });
    }
});

module.exports = router; 