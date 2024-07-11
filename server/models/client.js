const mongoose = require('mongoose');

// Define the schema for the Client model
const ClientSchema = new mongoose.Schema({
    firstname: String,
    surname: String,
    clientCode: { type: String, unique: true },
    email: { type: String, unique: true },
    linkedContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }]
});

// Helper function to generate a sequential 3-digit number
const generateSequentialNumber = async() => {
    // Find the highest existing number for the given prefix
    const lastClient = await mongoose.model('Client').findOne().sort({ clientCode: -1 }).exec();
    if (!lastClient) return 1; // If no clients exist, start with 1

    // Extract the numeric part of the last client code
    const lastNumber = parseInt(lastClient.clientCode.substring(3), 10);
    return lastNumber + 1;
};

// Pre-save middleware to automatically generate a unique client code
ClientSchema.pre('save', async function(next) {
    if (!this.clientCode) {
        // Generate the alpha part of the client code
        const nameParts = this.firstname.split(/\s+/).concat(this.surname.split(/\s+/));
        let prefix = '';

        // Combine first letters of all name parts
        for (const part of nameParts) {
            if (part) {
                prefix += part.charAt(0);
                if (prefix.length === 3) break;
            }
        }

        // Ensure the prefix is exactly 3 letters
        if (prefix.length > 3) {
            prefix = prefix.substring(0, 3); // Truncate to 3 letters
        } else if (prefix.length < 3) {
            // Pad with subsequent letters if fewer than 3 letters
            const fillLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            while (prefix.length < 3) {
                prefix += fillLetters[prefix.length];
            }
        }

        prefix = prefix.toUpperCase(); // Convert to uppercase

        // Generate a sequential 3-digit number
        const sequentialNumber = await generateSequentialNumber();
        const numberPart = String(sequentialNumber).padStart(3, '0');

        // Combine to form the client code
        this.clientCode = `${prefix}${numberPart}`;
    }
    next();
});

// Create a Mongoose model based on the ClientSchema
const ClientModel = mongoose.model('Client', ClientSchema);

module.exports = ClientModel;