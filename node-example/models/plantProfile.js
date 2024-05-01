// models/plantprofiles.js

const mongoose = require('mongoose');

// Define the schema for plant profiles
const plantProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    scientific_name: {
        type: String,
        required: true
    },
    description: String,
    growth_stages: [{
        stage: String,
        description: String
    }],
    environmental_requirements: {
        airTemp: {
            min: Number,
            max: Number,
            unit: String
        },
        humidity: {
            min: Number,
            max: Number,
            unit: String
        },
        airPress: {
            min: Number,
            max: Number,
            unit: String
        },
        light: String
    }
});

// Create a model based on the schema
const PlantProfile = mongoose.model('PlantProfile', plantProfileSchema);

module.exports = PlantProfile;
