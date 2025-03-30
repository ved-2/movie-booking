const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    seatingCapacity: {
        type: Number,
        required: true
    },
    screens: [{
        screenNumber: Number,
        seats: [{
            row: String,
            number: Number,
            type: {
                type: String,
                enum: ['standard', 'premium', 'vip'],
                default: 'standard'
            }
        }]
    }]
});

module.exports = mongoose.model('Theater', theaterSchema); 