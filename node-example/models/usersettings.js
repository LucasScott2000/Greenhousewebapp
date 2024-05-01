// usersettings.js
const mongoose = require('mongoose');

// Define the UserSettings schema
const userSettingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    preferredUnit: {
        type: String,
        default: 'celsius' // Default value for preferredUnit
    },
    mode: {
        type: String,
        default: 'light' // Default value for mode
    },
    revertProfileOverwrite: {
        type: Boolean,
        default: false // Default value for revertProfileOverwrite
    }
}, { collection: 'UserSettings' }); // Specify the collection name

// Create the UserSettings model
const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

module.exports = UserSettings;