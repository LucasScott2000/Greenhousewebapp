// server.js
const express = require('express');
const mongoose = require('mongoose');
const PlantProfile = require('./models/plantProfile');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://lscott:Mine513jw62@clusterghms.mqurwz8.mongodb.net/GHMS?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected');
    // Start the server after the database connection is established
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch(err => console.error('MongoDB Connection Error:', err));

// Middleware
app.use(express.json());

// Routes
app.get('/plant-profiles', async (req, res) => {
    try {
        const plantProfiles = await PlantProfile.find();
        res.json(plantProfiles);
    } catch (error) {
        console.error('Error fetching plant profiles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
