const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const methodOverride = require('method-override');
require('dotenv').config();

// Import routes
const movieRoutes = require('./routes/movieRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Express layouts setup
app.use(expressLayouts);
app.set('layout', 'layouts/boilerplate');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method')); // For PUT/DELETE requests

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Add user to all templates
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
    next();
});

// Routes
app.get('/', async (req, res) => {
    // Redirect to login if not authenticated
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    
    // If authenticated, show movies
    try {
        const movies = await require('./controllers/dbOperations').getAllMovies();
        res.render('movies/index', { 
            movies,
            title: 'Home - Movie Booking System'
        });
    } catch (error) {
        res.status(500).send('Error loading homepage');
    }
});

// Mount all routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/movies', movieRoutes);
app.use('/shows', showRoutes);
app.use('/bookings', bookingRoutes);
app.use('/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        error: err, 
        message: err.message,
        title: 'Error - Movie Booking System'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: '404 Not Found - Movie Booking System'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 