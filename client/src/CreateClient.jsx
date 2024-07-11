import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function CreateClient() {
    const [firstname, setFirstname] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!firstname) {
            newErrors.firstname = "Firstname is required.";
        }
        if (!email) {
            newErrors.email = "Email is required.";
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                newErrors.email = "Please enter a valid email address.";
            }
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        axios.post("http://localhost:3001/createClient", { firstname, surname, email })
            .then(result => {
                console.log(result);
                navigate('/');
            })
            .catch(err => {
                console.error(err);
                setErrors({ submit: "An error occurred while creating the client." });
            });
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: '' }));
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={handleSubmit}>
                    <h2>Add Client</h2>
                    {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
                    
                    <div className="mb-3">
                        <label>Firstname</label>
                        <input
                            type="text"
                            name="firstname"
                            placeholder="Enter name"
                            className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
                            value={firstname}
                            onChange={handleInputChange(setFirstname)}
                        />
                        {errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label>Surname</label>
                        <input
                            type="text"
                            name="surname"
                            placeholder="Enter surname"
                            className={`form-control`}
                            value={surname}
                            onChange={handleInputChange(setSurname)}
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Enter email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            value={email}
                            onChange={handleInputChange(setEmail)}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    
                    <button type="submit" className="btn btn-success">Submit</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Back</button>
                </form>
            </div>
        </div>
    );
}

export default CreateClient;
