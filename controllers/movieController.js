exports.getMovieShows = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).render('error', {
                error: 'Movie not found',
                title: 'Error - Movie Booking System'
            });
        }

        // Only get shows that haven't started yet
        const now = new Date();
        const shows = await Show.find({
            movie: req.params.id,
            showTime: { $gt: now }
        })
        .populate('theater')
        .sort({ showTime: 1 });

        res.render('movies/shows', {
            movie,
            shows,
            title: `${movie.title} - Shows - Movie Booking System`
        });
    } catch (error) {
        console.error('Error fetching movie shows:', error);
        res.status(500).render('error', {
            error: 'Error loading shows',
            title: 'Error - Movie Booking System'
        });
    }
}; 