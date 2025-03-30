const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    theater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater',
        required: true
    },
    screen: {
        type: Number,
        required: true
    },
    showTime: {
        type: Date,
        required: true
    },
    price: {
        standard: Number,
        premium: Number,
        vip: Number
    },
    availableSeats: [{
        row: String,
        number: Number,
        type: String
    }]
});

module.exports = mongoose.model('Show', showSchema); 