const cron = require('node-cron');
const Show = require('../models/show');
const Movie = require('../models/movie');
const Theater = require('../models/theater');

async function createShowsForDate(date) {
    try {
        const movies = await Movie.find();
        const theaters = await Theater.find();
        const shows = [];

        movies.forEach(movie => {
            theaters.forEach(theater => {
                // Create 3 shows per day
                [10, 14, 18].forEach(hour => {
                    const showTime = new Date(date);
                    showTime.setHours(hour, 0, 0, 0);

                    // Randomly select a screen from the theater
                    const screen = theater.screens[Math.floor(Math.random() * theater.screens.length)];

                    shows.push({
                        movie: movie._id,
                        theater: theater._id,
                        screen: screen.screenNumber,
                        showTime: showTime,
                        price: {
                            standard: 150,
                            premium: 200,
                            vip: 300
                        },
                        availableSeats: screen.seats.map(seat => seat.row + seat.number)
                    });
                });
            });
        });

        await Show.insertMany(shows);
        console.log(`Created ${shows.length} shows for ${date.toDateString()}`);
    } catch (error) {
        console.error('Error creating shows:', error);
    }
}

async function cleanOldShows() {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        await Show.deleteMany({ showTime: { $lt: yesterday } });
        console.log('Cleaned old shows');
    } catch (error) {
        console.error('Error cleaning old shows:', error);
    }
}

// Schedule the cron job to run at midnight every day
function scheduleShowUpdates() {
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily show update...');
        
        // Clean old shows
        await cleanOldShows();

        // Create shows for 7 days from tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const lastDay = new Date(tomorrow);
        lastDay.setDate(lastDay.getDate() + 6);

        for (let date = new Date(tomorrow); date <= lastDay; date.setDate(date.getDate() + 1)) {
            await createShowsForDate(new Date(date));
        }
    });
}

module.exports = { scheduleShowUpdates }; 