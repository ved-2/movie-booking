const Theater = require('../models/theater');
const Show = require('../models/show');
const Movie = require('../models/movie');
const Booking = require('../models/booking');

// Get all shows for admin dashboard
exports.getAllShows = async () => {
    return await Show.find()
        .populate('movie')
        .populate('theater')
        .sort({ showTime: 1 });
};

// Create new theater
exports.createTheater = async (req, res) => {
    try {
        const { name, location, screens } = req.body;
        
        // Process each screen's configuration
        const processedScreens = screens.map(screen => {
            const seats = [];
            const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            const vipRows = screen.vipRows.split(',').map(row => row.trim());
            const premiumRows = screen.premiumRows.split(',').map(row => row.trim());
            const seatsPerRow = parseInt(screen.seatsPerRow);

            rows.forEach(row => {
                for (let i = 1; i <= seatsPerRow; i++) {
                    let type = 'standard';
                    if (vipRows.includes(row)) type = 'vip';
                    if (premiumRows.includes(row)) type = 'premium';

                    seats.push({
                        row,
                        number: i,
                        type
                    });
                }
            });

            return {
                screenNumber: parseInt(screen.screenNumber),
                seats
            };
        });

        const theater = new Theater({
            name,
            location,
            seatingCapacity: processedScreens.reduce((total, screen) => 
                total + (screen.seats.length), 0),
            screens: processedScreens
        });

        await theater.save();
        req.flash('success', 'Theater created successfully');
        res.redirect('/admin/dashboard#theaters');
    } catch (error) {
        console.error('Error creating theater:', error);
        req.flash('error', 'Failed to create theater');
        res.redirect('/admin/theaters/new');
    }
};

// Movie Controllers
exports.getEditMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            req.flash('error', 'Movie not found');
            return res.redirect('/admin/dashboard');
        }
        res.render('admin/movies/edit', { movie });
    } catch (error) {
        console.error('Error fetching movie:', error);
        req.flash('error', 'Failed to load movie');
        res.redirect('/admin/dashboard');
    }
};

exports.updateMovie = async (req, res) => {
    try {
        const { title, description, duration, genre, releaseDate, posterUrl, rating } = req.body;
        
        // Convert genre string to array
        const genreArray = genre.split(',').map(g => g.trim());
        
        await Movie.findByIdAndUpdate(req.params.id, {
            title,
            description,
            duration,
            genre: genreArray,
            releaseDate,
            posterUrl,
            rating
        });
        
        req.flash('success', 'Movie updated successfully');
        res.redirect('/admin/dashboard#movies');
    } catch (error) {
        console.error('Error updating movie:', error);
        req.flash('error', 'Failed to update movie');
        res.redirect('/admin/dashboard');
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        // Also delete associated shows
        await Show.deleteMany({ movie: req.params.id });
        req.flash('success', 'Movie deleted successfully');
        res.redirect('/admin/dashboard#movies');
    } catch (error) {
        console.error('Error deleting movie:', error);
        req.flash('error', 'Failed to delete movie');
        res.redirect('/admin/dashboard');
    }
};

// Show Controllers
exports.getEditShow = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id)
            .populate('movie')
            .populate('theater');
        const movies = await Movie.find();
        const theaters = await Theater.find();
        
        if (!show) {
            req.flash('error', 'Show not found');
            return res.redirect('/admin/dashboard');
        }
        
        res.render('admin/shows/edit', { show, movies, theaters });
    } catch (error) {
        console.error('Error fetching show:', error);
        req.flash('error', 'Failed to load show');
        res.redirect('/admin/dashboard');
    }
};

exports.updateShow = async (req, res) => {
    try {
        const { movieId, theaterId, screen, showTime, price } = req.body;
        await Show.findByIdAndUpdate(req.params.id, {
            movie: movieId,
            theater: theaterId,
            screen,
            showTime,
            price
        });
        req.flash('success', 'Show updated successfully');
        res.redirect('/admin/dashboard#shows');
    } catch (error) {
        console.error('Error updating show:', error);
        req.flash('error', 'Failed to update show');
        res.redirect('/admin/dashboard');
    }
};

exports.deleteShow = async (req, res) => {
    try {
        await Show.findByIdAndDelete(req.params.id);
        // Also delete associated bookings
        await Booking.deleteMany({ show: req.params.id });
        req.flash('success', 'Show deleted successfully');
        res.redirect('/admin/dashboard#shows');
    } catch (error) {
        console.error('Error deleting show:', error);
        req.flash('error', 'Failed to delete show');
        res.redirect('/admin/dashboard');
    }
};

exports.createShow = async (req, res) => {
    try {
        const { movieId, theaterId, screen, showTime, price } = req.body;
        const show = new Show({
            movie: movieId,
            theater: theaterId,
            screen,
            showTime,
            price,
            availableSeats: [] // You'll need to populate this based on theater configuration
        });
        
        // Get theater to set available seats
        const theater = await Theater.findById(theaterId);
        const screenConfig = theater.screens.find(s => s.screenNumber === parseInt(screen));
        if (screenConfig) {
            show.availableSeats = screenConfig.seats.map(seat => seat.row + seat.number);
        }

        await show.save();
        req.flash('success', 'Show created successfully');
        res.redirect('/admin/dashboard#shows');
    } catch (error) {
        console.error('Error creating show:', error);
        req.flash('error', 'Failed to create show');
        res.redirect('/admin/shows/new');
    }
};

exports.createMovie = async (req, res) => {
    try {
        const { title, description, duration, genre, releaseDate, posterUrl, rating } = req.body;
        const genreArray = genre.split(',').map(g => g.trim());
        
        const movie = new Movie({
            title,
            description,
            duration,
            genre: genreArray,
            releaseDate,
            posterUrl,
            rating
        });

        await movie.save();
        req.flash('success', 'Movie created successfully');
        res.redirect('/admin/dashboard#movies');
    } catch (error) {
        console.error('Error creating movie:', error);
        req.flash('error', 'Failed to create movie');
        res.redirect('/admin/movies/new');
    }
};

exports.getEditTheater = async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id);
        if (!theater) {
            req.flash('error', 'Theater not found');
            return res.redirect('/admin/dashboard');
        }
        res.render('admin/theaters/edit', { theater });
    } catch (error) {
        console.error('Error fetching theater:', error);
        req.flash('error', 'Failed to load theater');
        res.redirect('/admin/dashboard');
    }
};

exports.updateTheater = async (req, res) => {
    try {
        const { name, location } = req.body;
        await Theater.findByIdAndUpdate(req.params.id, { name, location });
        req.flash('success', 'Theater updated successfully');
        res.redirect('/admin/dashboard#theaters');
    } catch (error) {
        console.error('Error updating theater:', error);
        req.flash('error', 'Failed to update theater');
        res.redirect('/admin/dashboard');
    }
};

exports.deleteTheater = async (req, res) => {
    try {
        await Theater.findByIdAndDelete(req.params.id);
        // Also delete associated shows
        await Show.deleteMany({ theater: req.params.id });
        req.flash('success', 'Theater deleted successfully');
        res.redirect('/admin/dashboard#theaters');
    } catch (error) {
        console.error('Error deleting theater:', error);
        req.flash('error', 'Failed to delete theater');
        res.redirect('/admin/dashboard');
    }
}; 