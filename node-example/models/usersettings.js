const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    preferredUnit: String,
    mode: String,
    revertProfileOverwrite: Boolean
});

module.exports = mongoose.model('UserSettings', userSettingsSchema);
