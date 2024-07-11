import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';

function ViewClient() {
    const [data, setData] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [view, setView] = useState('clients'); // 'clients' or 'contacts'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch data based on view
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const url = view === 'clients' ? 'http://localhost:3001' : 'http://localhost:3001/contacts';
                const result = await axios.get(url);
                setData(result.data);
            } catch (err) {
                setError("An error occurred while fetching data.");
            }
            setLoading(false);
        };

        fetchData();
    }, [view]);

    // Fetch contacts if viewing clients
    useEffect(() => {
        if (view === 'clients') {
            const fetchContacts = async () => {
                try {
                    const result = await axios.get('http://localhost:3001/contacts');
                    setContacts(result.data);
                } catch (err) {
                    console.error("An error occurred while fetching contacts.");
                }
            };
            fetchContacts();
        }
    }, [view]);

    // Handle linking of contacts to a client
    const handleLinkContacts = async (clientId, linkedContacts) => {
        try {
            await axios.put(`http://localhost:3001/clients/${clientId}`, { linkedContacts });
            const result = await axios.get('http://localhost:3001');
            setData(result.data);
            setShowModal(false);
        } catch (err) {
            setError("An error occurred while linking contacts.");
        }
    };

    return (
        <div className="d-flex flex-column vh-100 bg-primary p-4">
            <div className="container bg-white rounded p-3 shadow-sm">
                <div className="d-flex justify-content-between mb-3">
                    <div>
                        <button className="btn btn-success" onClick={() => setView('clients')}>View Clients</button>
                        <button className="btn btn-success ms-2" onClick={() => setView('contacts')}>View Contacts</button>
                    </div>
                    <div>
                        <Link to='/create' className="btn btn-success">Add Client +</Link>
                        <Link to='/create-contact' className="btn btn-primary ms-2">Add Contact +</Link>
                    </div>
                </div>

                <h2 className="mb-4">
                    {view === 'clients' ? 'Client List' : 'Contact List'}
                </h2>

                {loading && <p>Loading...</p>}
                {error && <div className="alert alert-danger">{error}</div>}
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            {view === 'clients' ? (
                                <>
                                    <th>Name</th>
                                    <th>Client Code</th>
                                    <th>No. linked Contacts</th>
                                    
                                </>
                            ) : (
                                <>
                                    <th>Phone</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item._id}>
                                {view === 'clients' ? (
                                    <>
                                        <td>{item.firstname} {item.surname}</td>
                                        <td>{item.clientCode}</td>
                                        <td>{item.linkedContacts ? item.linkedContacts.length : 0}</td>
                                        <td>
                                            <button
                                                className="btn btn-info"
                                                onClick={() => {
                                                    setSelectedClient(item);
                                                    setShowModal(true);
                                                }}
                                            >
                                                Link Contacts
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{item.contact}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal for linking contacts */}
                {showModal && selectedClient && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Link Contacts to {selectedClient.firstname} {selectedClient.surname}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const selectedContacts = Array.from(e.target.elements['contacts'])
                                            .filter(checkbox => checkbox.checked)
                                            .map(checkbox => checkbox.value);
                                        handleLinkContacts(selectedClient._id, selectedContacts);
                                    }}>
                                        {contacts.map(contact => (
                                            <div className="form-check" key={contact._id}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name="contacts"
                                                    value={contact._id}
                                                    id={`contact-${contact._id}`}
                                                />
                                                <label className="form-check-label">
                                                    {contact.firstname} {contact.surname} - {contact.email} - {contact.contact}
                                                </label>
                                            </div>
                                        ))}
                                        <button type="submit" className="btn btn-success mt-3">Link Selected Contacts</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewClient;
