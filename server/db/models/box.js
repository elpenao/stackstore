'use strict';
var mongoose = require('mongoose');
var enums = require('./enums.js');

var BoxSchema = new mongoose.Schema({

    name: { type: String, required: true},
    description: String,
    imgUrl: String,
    isActive: Boolean,
    gender: { type: String, enum: enums.gender },
    ageRange: { type: String, enum: enums.ageRange },
    interest: { type: String, enum: enums.interest },
    keywords: [String],
    items: [String],
    premiumItems: [String]

}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

mongoose.model('Box', BoxSchema);