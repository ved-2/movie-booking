const mongoose = require('mongoose');
const Movie = require('../models/movie');
const Theater = require('../models/theater');
const Show = require('../models/show');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const seedShows = async () => {
    try {
        // Clear existing shows
        await Show.deleteMany({});

        // Get all movies and theaters
        const movies = await Movie.find();
        const theaters = await Theater.find();

        if (!movies.length || !theaters.length) {
            console.log('Please seed movies and theaters first!');
            return;
        }

        // Create shows for each movie in each theater
        const shows = [];
        const today = new Date();

        movies.forEach(movie => {
            theaters.forEach(theater => {
                // Create shows for the next 7 days
                for (let i = 0; i < 7; i++) {
                    const showDate = new Date(today);
                    showDate.setDate(today.getDate() + i);

                    // Create 3 shows per day
                    [10, 14, 18].forEach(hour => {
                        const showTime = new Date(showDate);
                        showTime.setHours(hour, 0, 0, 0);

                        shows.push({
                            movie: movie._id,
                            theater: theater._id,
                            screen: Math.floor(Math.random() * theater.screens.length) + 1,
                            showTime: showTime,
                            price: {
                                standard: 150,
                                premium: 200,
                                vip: 300
                            },
                            availableSeats: theater.screens[0].seats.map(seat => seat.row + seat.number)
                        });
                    });
                }
            });
        });

        // Insert shows
        await Show.insertMany(shows);
        console.log(`${shows.length} shows have been created!`);

    } catch (error) {
        console.error('Error seeding shows:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedShows(); 