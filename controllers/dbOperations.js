const Movie = require('../models/movie');
const Show = require('../models/show');
const Booking = require('../models/booking');
const Theater = require('../models/theater');
const User = require('../models/user');

// Movie Operations
exports.getAllMovies = async () => {
    return await Movie.find({});
};

exports.getMovieById = async (id) => {
    return await Movie.findById(id);
};

exports.createMovie = async (movieData) => {
    const movie = new Movie(movieData);
    return await movie.save();
};

// Show Operations
exports.getAllShows = async () => {
    return await Show.find({})
        .populate('movie')
        .populate('theater');
};

exports.getShowById = async (id) => {
    return await Show.findById(id)
        .populate('movie')
        .populate({
            path: 'theater',
            populate: {
                path: 'screens'
            }
        });
};

exports.getShowsByMovie = async (movieId) => {
    return await Show.find({ movie: movieId })
        .populate('theater')
        .sort('showTime');
};

exports.createShow = async (showData) => {
    const show = new Show(showData);
    return await show.save();
};

// Booking Operations
exports.createBooking = async (bookingData) => {
    // Implementation for creating a booking
    // This will be implemented when we add authentication
};

exports.getBookingsByUser = async (userId) => {
    return await Booking.find({ user: userId })
        .populate('show')
        .populate('user');
};

// Theater Operations
exports.getAllTheaters = async () => {
    return await Theater.find({});
};

exports.getTheaterById = async (id) => {
    return await Theater.findById(id);
};

exports.createTheater = async (theaterData) => {
    const theater = new Theater(theaterData);
    return await theater.save();
};

exports.deleteMovie = async (movieId) => {
    return await Movie.findByIdAndDelete(movieId);
};

exports.deleteShowsByMovie = async (movieId) => {
    return await Show.deleteMany({ movie: movieId });
}; 