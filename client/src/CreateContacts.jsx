import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function CreateContact() {
    const [contact, setContact] = useState(""); // State for contact number
    const [error, setError] = useState(null); // State for form submission error
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        setError(null); // Clear previous errors

        try {
            const result = await axios.post("http://localhost:3001/createContact", { contact }); // Post data to backend
            console.log(result); // Log result
            navigate('/'); // Navigate to home page or another route after successful submission
        } catch (err) {
            console.error('Error details:', err.response || err.message || err); // Log error details
            setError("An error occurred while creating the contact."); // Set submission error
        }
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={handleSubmit}>
                    <h2>Add Contact</h2>
                    {error && <div className="alert alert-danger">{error}</div>} {/* Display submission error */}
                    <div className="mb-3">
                        <label className="form-label">Contact Number</label> 
                        <input
                            type="text"
                            placeholder="Enter contact number"
                            className="form-control"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)} // Update contact state
                        />
                    </div>
                    <button type="submit" className="btn btn-success">Submit</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/')}>Back</button>
                </form>
            </div>
        </div>
    );
}

export default CreateContact;
