const express = require('express'); // Import the Express framework
const mongoose = require('mongoose');
const cors = require('cors');
const ClientModel = require('./models/client');
const ContactModel = require('./models/contact');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb+srv://gabrielmarvelmwandi:4MnpSX55wPtYv3fd@dpt.cwkgmwz.mongodb.net/?retryWrites=true&w=majority&appName=dpt");

// Route to get all clients
app.get('/', async(req, res) => {
    try {
        // Fetch all client documents from the database
        const clients = await ClientModel.find({});
        res.json(clients); // Send the clients as a JSON response
    } catch (err) {
        // Handle any errors that occur during the database operation
        res.status(500).json({ error: err.message });
    }
});

// Route to create a new client
app.post("/createClient", async(req, res) => {
    try {
        const clientData = req.body;
        const newClient = new ClientModel(clientData);
        await newClient.save();
        res.json(newClient);
    } catch (err) {
        console.error(err);
        if (err.code === 11000) { // Duplicate key error
            res.status(400).json({ error: 'Email or clientCode already exists.' });
        } else {
            res.status(500).json({ error: 'An error occurred while creating the client.' });
        }
    }
});



// Route to get all contacts
app.get('/contacts', async(req, res) => {
    try {
        // Fetch all contact documents from the database
        const contacts = await ContactModel.find({});
        res.json(contacts); // Send the contacts as a JSON response
    } catch (err) {
        // Handle any errors that occur during the database operation
        res.status(500).json({ error: err.message });
    }
});

// Route to create a new contact
app.post('/createContact', async(req, res) => {
    console.log("New Contact Data ");

    try {
        const contactData = req.body; // Extract contact data from the request body

        console.log(contactData);

        // Check if the contact already exists by its contact number
        const existingContact = await ContactModel.findOne({ contact: contactData.contact });
        if (existingContact) {
            // If a contact with the same contact number already exists, return an error
            return res.status(400).json({ error: "Contact number already exists." });
        }

        // Create a new ContactModel instance with the provided data
        const newContact = new ContactModel(contactData);
        await newContact.save();

        res.json(newContact);

    } catch (err) {
        // Log the error and handle any issues during the database operation
        console.error(err);
        if (err.code === 11000) {
            res.status(400).json({ error: "Contact number already exists." });
        } else {
            res.status(500).json({ error: "An error occurred while creating the contact." });
        }
    }
});


// Route to update a client's linked contacts
app.put('/clients/:clientId', async(req, res) => {
    try {
        const { clientId } = req.params; // Extract client ID from the request parameters
        const { linkedContacts } = req.body; // Extract linked contacts (array of contact IDs) from the request body

        // Validate that linkedContacts is an array
        if (!linkedContacts || !Array.isArray(linkedContacts)) {
            return res.status(400).json({ error: "Invalid linkedContacts format." });
        }

        const client = await ClientModel.findById(clientId);
        if (!client) {
            return res.status(404).json({ error: "Client not found." });
        }

        client.linkedContacts = linkedContacts; // Update client's linked contacts
        await client.save(); // Save the updated client to the database

        res.json(client); // Send the updated client as a JSON response
    } catch (err) {
        // Log the error and handle any issues during the update operation
        console.error(err);
        res.status(500).json({ error: "An error occurred while linking contacts." });
    }
});

// Start the Express server and listen on port 3001
app.listen(3001, () => {
    console.log("Server is running on port 3001"); // Log server start message
});