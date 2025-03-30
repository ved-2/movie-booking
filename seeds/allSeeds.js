const mongoose = require('mongoose');
const Movie = require('../models/movie');
const Theater = require('../models/theater');
const Show = require('../models/show');
require('dotenv').config();

// Movie data (keeping your existing movie data)
const movies = [
    {
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        duration: 148,
        genre: ["Action", "Sci-Fi", "Thriller"],
        releaseDate: new Date("2010-07-16"),
        posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        rating: 8.8
    },
    {
        title: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        duration: 152,
        genre: ["Action", "Crime", "Drama"],
        releaseDate: new Date("2008-07-18"),
        posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
        rating: 9.0
    },
    {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        duration: 169,
        genre: ["Adventure", "Drama", "Sci-Fi"],
        releaseDate: new Date("2014-11-07"),
        posterUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        rating: 8.6
    },
    {
        title: "The Matrix",
        description: "A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.",
        duration: 136,
        genre: ["Action", "Sci-Fi"],
        releaseDate: new Date("1999-03-31"),
        posterUrl: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
        rating: 8.7
    },
    {
        title: "Pulp Fiction",
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        duration: 154,
        genre: ["Crime", "Drama"],
        releaseDate: new Date("1994-10-14"),
        posterUrl: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        rating: 8.9
    },
    {
        title: "Avengers: Endgame",
        description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        duration: 181,
        genre: ["Action", "Adventure", "Drama"],
        releaseDate: new Date("2019-04-26"),
        posterUrl: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
        rating: 8.4
    },
    {
        title: "Spider-Man: No Way Home",
        description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
        duration: 148,
        genre: ["Action", "Adventure", "Fantasy"],
        releaseDate: new Date("2021-12-17"),
        posterUrl: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg",
        rating: 8.3
    },
    {
        title: "Dune",
        description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
        duration: 155,
        genre: ["Action", "Adventure", "Drama"],
        releaseDate: new Date("2021-10-22"),
        posterUrl: "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
        rating: 8.0
    },
    {
        title: "The Shawshank Redemption",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        duration: 142,
        genre: ["Drama"],
        releaseDate: new Date("1994-10-14"),
        posterUrl: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        rating: 9.3
    },
    {
        title: "Parasite",
        description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        duration: 132,
        genre: ["Drama", "Thriller"],
        releaseDate: new Date("2019-11-08"),
        posterUrl: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
        rating: 8.6
    }
];

// Theater data
const theaters = [
    {
        name: "PVR Cinemas",
        location: "City Mall, Downtown",
        seatingCapacity: 150,
        screens: [
            {
                screenNumber: 1,
                seats: generateSeats('A', 'J', 15) // 10 rows, 15 seats each
            },
            {
                screenNumber: 2,
                seats: generateSeats('A', 'H', 12) // 8 rows, 12 seats each
            }
        ]
    },
    {
        name: "INOX Movies",
        location: "Metro Plaza, Uptown",
        seatingCapacity: 120,
        screens: [
            {
                screenNumber: 1,
                seats: generateSeats('A', 'H', 15) // 8 rows, 15 seats each
            }
        ]
    },
    {
        name: "Cineplex",
        location: "Central Square",
        seatingCapacity: 200,
        screens: [
            {
                screenNumber: 1,
                seats: generateSeats('A', 'K', 20) // 11 rows, 20 seats each
            },
            {
                screenNumber: 2,
                seats: generateSeats('A', 'J', 18) // 10 rows, 18 seats each
            }
        ]
    }
];

// Function to generate seats
function generateSeats(startRow, endRow, seatsPerRow) {
    const seats = [];
    for (let row = startRow.charCodeAt(0); row <= endRow.charCodeAt(0); row++) {
        for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
            seats.push({
                row: String.fromCharCode(row),
                number: seatNum,
                type: seatNum <= 5 ? 'standard' : seatNum <= 10 ? 'premium' : 'vip'
            });
        }
    }
    return seats;
}

// Function to generate show times for next 7 days
function generateShowTimes(movieId, theaterId, screenNumber) {
    const shows = [];
    const showTimes = ['10:00', '13:30', '17:00', '20:30'];
    const today = new Date();

    for (let day = 0; day < 7; day++) {
        showTimes.forEach(time => {
            const [hours, minutes] = time.split(':');
            const showTime = new Date(today);
            showTime.setDate(today.getDate() + day);
            showTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            shows.push({
                movie: movieId,
                theater: theaterId,
                screen: screenNumber,
                showTime: showTime,
                price: {
                    standard: 150,
                    premium: 200,
                    vip: 300
                },
                availableSeats: [] // This will be populated after creation
            });
        });
    }
    return shows;
}

// Connect and seed data
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    await Show.deleteMany({});
    console.log('Cleared existing data');

    // Insert movies
    const savedMovies = await Movie.insertMany(movies);
    console.log('Movies added');

    // Insert theaters
    const savedTheaters = await Theater.insertMany(theaters);
    console.log('Theaters added');

    // Generate and insert shows
    const shows = [];
    savedMovies.forEach(movie => {
        savedTheaters.forEach(theater => {
            theater.screens.forEach(screen => {
                const screenShows = generateShowTimes(movie._id, theater._id, screen.screenNumber);
                shows.push(...screenShows);
            });
        });
    });

    await Show.insertMany(shows);
    console.log('Shows added');

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Database seeding completed');
})
.catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
}); 