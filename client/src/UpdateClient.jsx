import React from "react";

function UpdateClient () {
    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form>
                    <h2>Update Client</h2>
                    <div className="mb-2">
                        <label htmlFor="">Firstname</label>
                        <input type="text" placeholder="Enter name" className="form-control" />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Surname</label>
                        <input type="text" placeholder="Enter surname" className="form-control" />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Email</label>
                        <input type="text" placeholder="Enter email" className="form-control" />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Contacts</label>
                        <input type="text" placeholder="Enter contact" className="form-control" />
                    </div>
                    <button className="btn  btn-success">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default UpdateClient;