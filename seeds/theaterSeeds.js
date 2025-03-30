const mongoose = require('mongoose');
const Theater = require('../models/theater');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const theaters = [
    {
        name: 'PVR Cinemas',
        location: 'City Mall',
        seatingCapacity: 200,
        screens: [
            {
                screenNumber: 1,
                seats: generateSeats()
            },
            {
                screenNumber: 2,
                seats: generateSeats()
            }
        ]
    },
    {
        name: 'INOX Movies',
        location: 'Metro Mall',
        seatingCapacity: 180,
        screens: [
            {
                screenNumber: 1,
                seats: generateSeats()
            },
            {
                screenNumber: 2,
                seats: generateSeats()
            }
        ]
    }
];

function generateSeats() {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;

    rows.forEach(row => {
        for (let i = 1; i <= seatsPerRow; i++) {
            let type = 'standard';
            if (row === 'G' || row === 'H') type = 'premium';
            if (row === 'A' || row === 'B') type = 'vip';

            seats.push({
                row,
                number: i,
                type
            });
        }
    });

    return seats;
}

const seedTheaters = async () => {
    try {
        await Theater.deleteMany({});
        await Theater.insertMany(theaters);
        console.log('Theaters seeded successfully!');
    } catch (error) {
        console.error('Error seeding theaters:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedTheaters(); 