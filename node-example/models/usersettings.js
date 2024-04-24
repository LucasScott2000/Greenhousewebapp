// usersettings.js
const mongoose = require('mongoose');

// Define the UserSettings schema
const userSettingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    preferredUnit: String,
    mode: String,
    revertProfileOverwrite: Boolean
}, { collection: 'UserSettings' }); // Specify the collection name

// Create the UserSettings model
const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

module.exports = UserSettings;
