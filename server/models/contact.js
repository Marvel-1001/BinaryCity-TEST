const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    contact: { type: Number, unique: true, required: true }
});

const ContactModel = mongoose.model('Contact', ContactSchema);
module.exports = ContactModel;