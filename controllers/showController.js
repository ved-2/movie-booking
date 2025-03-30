const Show = require('../models/show');

exports.getBookingPage = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id)
            .populate('movie')
            .populate('theater');

        if (!show) {
            req.flash('error', 'Show not found');
            return res.redirect('/movies');
        }

        // Check if show time has passed
        if (new Date(show.showTime) < new Date()) {
            req.flash('error', 'This show has already started');
            return res.redirect('/movies');
        }

        res.render('shows/book', {
            show,
            title: `Book Tickets - ${show.movie.title} - Movie Booking System`
        });
    } catch (error) {
        console.error('Error loading booking page:', error);
        req.flash('error', 'Failed to load booking page');
        res.redirect('/movies');
    }
}; 