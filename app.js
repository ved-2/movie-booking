const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const { scheduleShowUpdates } = require('./utils/showUpdater');
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
.then(() => {
    console.log('Connected to MongoDB');
    scheduleShowUpdates();
})
.catch(err => console.error('MongoDB connection error:', err));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Express layouts setup - Must come BEFORE routes
app.use(expressLayouts);
app.set('layout', 'layouts/boilerplate');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Flash messages middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.session.user;
    next();
});

// Add this after your other middleware configurations
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
        "img-src 'self' https: data:; " +
        "font-src 'self' https:; "
    );
    next();
});

// Routes
app.get('/', (req, res) => {
    // Redirect to login choice if not authenticated
    if (!req.session.user) {
        return res.redirect('/auth/login-choice');
    }
    
    // If authenticated, redirect based on role
    if (req.session.user.role === 'admin') {
        return res.redirect('/admin/dashboard');
    }
    
    // For regular users, show movies
    res.redirect('/movies');
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