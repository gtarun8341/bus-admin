import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from './apiConfig';

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [newBusName, setNewBusName] = useState('');
  const [newBusNumber, setNewBusNumber] = useState('');
  const [newBusModel, setNewBusModel] = useState('');
  const [newBusCapacity, setNewBusCapacity] = useState('');
  const [editingBusId, setEditingBusId] = useState(null); // State to track which bus is being edited

  useEffect(() => {
    // Fetch all buses from backend upon component mount
    axios.get(`${apiUrl}/api/bus-details`)
      .then(res => {
        setBuses(res.data);
      })
      .catch(err => {
        console.error('Error fetching buses:', err);
      });
  }, []);

  const handleAddBus = () => {
    // Send POST request to add a new bus
    axios.post(`${apiUrl}/api/bus-details`, {
        busName: newBusName,
        busNumber: newBusNumber,
        busModel: newBusModel,
        capacity: newBusCapacity,
      })
      .then(res => {
        setBuses([...buses, res.data]);
        setNewBusName('');
        setNewBusNumber('');
        setNewBusModel('');
        setNewBusCapacity('');
      })
      .catch(err => {
        console.error('Error adding bus:', err);
      });
  };

  const handleDeleteBus = (id) => {
    // Send DELETE request to delete a bus by ID
    axios.delete(`${apiUrl}/api/bus-details/${id}`)
      .then(res => {
        setBuses(buses.filter(bus => bus._id !== id));
      })
      .catch(err => {
        console.error('Error deleting bus:', err);
      });
  };

  const handleEditBus = (bus) => {
    // Set the bus data into editing state
    setNewBusName(bus.busName);
    setNewBusNumber(bus.busNumber);
    setNewBusModel(bus.busModel);
    setNewBusCapacity(bus.capacity);
    setEditingBusId(bus._id);
  };

  const handleModifyBus = (id) => {
    // Send PUT request to modify a bus by ID
    axios.put(`${apiUrl}/api/bus-details/${id}`, {
        busName: newBusName,
        busNumber: newBusNumber,
        busModel: newBusModel,
        capacity: newBusCapacity,
      })
      .then(res => {
        const updatedBuses = buses.map(bus =>
          bus._id === id ? res.data : bus
        );
        setBuses(updatedBuses);
        setEditingBusId(null); // Reset editing state after successful modification
      })
      .catch(err => {
        console.error('Error modifying bus:', err);
      });
  };

  return (
    <div className="container">
      <h2 className="mt-4">Buses</h2>
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Add New Bus</h3>
          <div className="form-row">
            <div className="form-group col-md-3">
              <input type="text" className="form-control mb-2" placeholder="Bus Name" value={newBusName} onChange={e => setNewBusName(e.target.value)} />
            </div>
            <div className="form-group col-md-3">
              <input type="text" className="form-control mb-2" placeholder="Bus Number" value={newBusNumber} onChange={e => setNewBusNumber(e.target.value)} />
            </div>
            <div className="form-group col-md-3">
              <input type="text" className="form-control mb-2" placeholder="Bus Model" value={newBusModel} onChange={e => setNewBusModel(e.target.value)} />
            </div>
            <div className="form-group col-md-3">
              <input type="number" className="form-control mb-2" placeholder="Capacity" value={newBusCapacity} onChange={e => setNewBusCapacity(e.target.value)} />
            </div>
            <div className="form-group col-md-12">
              <button className="btn btn-primary mb-2" onClick={handleAddBus}>Add Bus</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h3 className="card-title">Existing Buses</h3>
          <table className="table table-bordered table-hover">
            <thead className="thead-light">
              <tr>
                <th>Bus Name</th>
                <th>Bus Number</th>
                <th>Model</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map(bus => (
                <tr key={bus._id}>
                  <td>{editingBusId === bus._id ? (
                    <input type="text" className="form-control" value={newBusName} onChange={e => setNewBusName(e.target.value)} />
                  ) : (
                    bus.busName
                  )}</td>
                  <td>{editingBusId === bus._id ? (
                    <input type="text" className="form-control" value={newBusNumber} onChange={e => setNewBusNumber(e.target.value)} />
                  ) : (
                    bus.busNumber
                  )}</td>
                  <td>{editingBusId === bus._id ? (
                    <input type="text" className="form-control" value={newBusModel} onChange={e => setNewBusModel(e.target.value)} />
                  ) : (
                    bus.busModel
                  )}</td>
                  <td>{editingBusId === bus._id ? (
                    <input type="number" className="form-control" value={newBusCapacity} onChange={e => setNewBusCapacity(e.target.value)} />
                  ) : (
                    bus.capacity
                  )}</td>
                  <td>
                    {editingBusId === bus._id ? (
                      <div>
                        <button className="btn btn-success btn-sm mr-2" onClick={() => handleModifyBus(bus._id)}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingBusId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div>
                        <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEditBus(bus)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBus(bus._id)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Buses;
