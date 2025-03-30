const mongoose = require('mongoose');
const Movie = require('../models/movie');
require('dotenv').config();

const movies = [
    {
        title: "Inception",
        description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        duration: 148,
        genre: ["Action", "Sci-Fi", "Thriller"],
        rating: 8.8,
        posterUrl: "https://example.com/inception.jpg",
        releaseDate: new Date("2010-07-16"),
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"]
    },
    {
        title: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        duration: 152,
        genre: ["Action", "Crime", "Drama"],
        rating: 9.0,
        posterUrl: "https://example.com/dark-knight.jpg",
        releaseDate: new Date("2008-07-18"),
        director: "Christopher Nolan",
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"]
    },
    {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        duration: 169,
        genre: ["Adventure", "Drama", "Sci-Fi"],
        rating: 8.6,
        posterUrl: "https://example.com/interstellar.jpg",
        releaseDate: new Date("2014-11-07"),
        director: "Christopher Nolan",
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"]
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
    }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Clear existing movies
        await Movie.deleteMany({});
        console.log('Cleared existing movies');

        // Insert new movies
        await Movie.insertMany(movies);
        console.log('Sample movies added successfully');
    } catch (error) {
        console.error('Error seeding movies:', error);
    }
    
    mongoose.disconnect();
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    mongoose.disconnect();
}); 