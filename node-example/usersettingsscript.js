// usersettingsscript.js
const mongoose = require('mongoose');
const UserSettings = require('./models/usersettings'); // Import the UserSettings model

// Connect to MongoDB with the correct database
mongoose.connect('mongodb+srv://lscott:Mine513jw62@clusterghms.mqurwz8.mongodb.net/GHMS?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Define user data with preferences
const usersData = [
    {
        user: '659f0b61cab9ed772220d1f2', // Replace with the ObjectId of the user
        preferredUnit: 'celsius',
        mode: 'light',
        revertProfileOverwrite: false
    },
    {
        user: '6609c7fed7f853a33ae43898', // Replace with the ObjectId of the user
        preferredUnit: 'fahrenheit',
        mode: 'dark',
        revertProfileOverwrite: true
    },
    {
        user: '6609c80fd7f853a33ae43899', // Replace with the ObjectId of the user
        preferredUnit: 'celsius',
        mode: 'light',
        revertProfileOverwrite: false
    }
];

// Function to save user settings
async function saveUserSettings(userData) {
    try {
        const newUserSettings = new UserSettings(userData);
        const savedUserSettings = await newUserSettings.save();
        console.log('User settings saved:', savedUserSettings);
    } catch (error) {
        console.error('Error saving user settings:', error);
    }
}

// Loop through the users data and save user settings
async function saveUserSettingsForEachUser(usersData) {
    for (const userData of usersData) {
        await saveUserSettings(userData);
    }
}

// Call the function to save user settings
saveUserSettingsForEachUser(usersData);
