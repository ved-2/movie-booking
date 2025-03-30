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
        standard: {
            type: Number,
            required: true
        },
        premium: {
            type: Number,
            required: true
        },
        vip: {
            type: Number,
            required: true
        }
    },
    availableSeats: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Show', showSchema); 