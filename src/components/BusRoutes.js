import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from './apiConfig';

const BusRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [newRoute, setNewRoute] = useState({
    origin: {
      latitude: '',
      longitude: '',
      description: '',
      time: '',
      routeName: '',
    },
    destination: {
      latitude: '',
      longitude: '',
      description: '',
      time: '',
      routeName: '',
    },
    checkpoints: [],
    busId: '',
  });
  const [checkpoint, setCheckpoint] = useState({
    latitude: '',
    longitude: '',
    description: '',
    time: '',
    routeName: '',
  });
  const [editingRouteId, setEditingRouteId] = useState(null); // State to track the route being edited

  useEffect(() => {
    // Fetch all bus routes and buses from backend upon component mount
    axios.all([
      axios.get(`${apiUrl}/api/bus-routes`),
      axios.get(`${apiUrl}/api/bus-details`), // Assuming endpoint for fetching buses
    ])
    .then(axios.spread((routesRes, busesRes) => {
      setRoutes(routesRes.data);
      setBuses(busesRes.data);
    }))
    .catch(err => {
      console.error('Error fetching data:', err);
    });
  }, []);

  const handleAddRoute = () => {
    // Send POST request to add a new bus route
    axios.post(`${apiUrl}/api/bus-routes`, newRoute)
      .then(res => {
        setRoutes([...routes, res.data]);
        setNewRoute({
          origin: {
            latitude: '',
            longitude: '',
            description: '',
            time: '',
            routeName: '',
          },
          destination: {
            latitude: '',
            longitude: '',
            description: '',
            time: '',
            routeName: '',
          },
          checkpoints: [],
          busId: '',
        });
      })
      .catch(err => {
        console.error('Error adding bus route:', err);
      });
  };

  const handleModifyRoute = (id, updatedRoute) => {
    // Send PUT request to modify a bus route
    axios.put(`${apiUrl}/api/bus-routes/${id}`, updatedRoute)
      .then(res => {
        console.log('Route modified successfully:', res.data);
        const updatedRoutes = routes.map(route =>
          route._id === id ? res.data : route
        );
        setRoutes(updatedRoutes);
        setEditingRouteId(null); // Reset editing state after successful modification
      })
      .catch(err => {
        console.error('Error modifying route:', err);
      });
  };

  const handleDeleteRoute = (id) => {
    // Send DELETE request to delete a bus route
    axios.delete(`${apiUrl}/api/bus-routes/${id}`)
      .then(res => {
        console.log('Route deleted successfully:', res.data);
        setRoutes(routes.filter(route => route._id !== id));
      })
      .catch(err => {
        console.error('Error deleting route:', err);
      });
  };

  const handleEditRoute = (route) => {
    // Set the current route data into editing state
    setNewRoute({
      origin: {
        latitude: route.origin.latitude,
        longitude: route.origin.longitude,
        description: route.origin.description,
        time: route.origin.time,
        routeName: route.origin.routeName,
      },
      destination: {
        latitude: route.destination.latitude,
        longitude: route.destination.longitude,
        description: route.destination.description,
        time: route.destination.time,
        routeName: route.destination.routeName,
      },
      checkpoints: [...route.checkpoints],
      busId: route.busId,
    });
    setEditingRouteId(route._id);
  };

  const handleCheckpointChange = (index, field, value) => {
    // Update a specific checkpoint's field based on index
    const updatedCheckpoints = [...newRoute.checkpoints];
    updatedCheckpoints[index] = {
      ...updatedCheckpoints[index],
      [field]: value,
    };
    setNewRoute({
      ...newRoute,
      checkpoints: updatedCheckpoints,
    });
  };

  const handleAddCheckpoint = () => {
    // Add the current checkpoint to the list of checkpoints
    setNewRoute({
      ...newRoute,
      checkpoints: [...newRoute.checkpoints, checkpoint],
    });
    // Clear the checkpoint state for adding a new one
    setCheckpoint({
      latitude: '',
      longitude: '',
      description: '',
      time: '',
      routeName: '',
    });
  };

  return (
    <div>
      <h2>Bus Routes</h2>
      <div>
        <div>
          <label>Select Bus:</label>
          <select value={newRoute.busId} onChange={e => setNewRoute({ ...newRoute, busId: e.target.value })}>
            <option value="">Select a bus</option>
            {buses.map(bus => (
              <option key={bus._id} value={bus._id}>{bus.busNumber}</option>
            ))}
          </select>
        </div>
        <h3>Add New Route</h3>
        <div>
          <h4>Origin</h4>
          <input type="text" placeholder="Latitude" value={newRoute.origin.latitude} onChange={e => setNewRoute({ ...newRoute, origin: { ...newRoute.origin, latitude: e.target.value } })} />
          <input type="text" placeholder="Longitude" value={newRoute.origin.longitude} onChange={e => setNewRoute({ ...newRoute, origin: { ...newRoute.origin, longitude: e.target.value } })} />
          <input type="text" placeholder="Description" value={newRoute.origin.description} onChange={e => setNewRoute({ ...newRoute, origin: { ...newRoute.origin, description: e.target.value } })} />
          <input type="text" placeholder="Time" value={newRoute.origin.time} onChange={e => setNewRoute({ ...newRoute, origin: { ...newRoute.origin, time: e.target.value } })} />
          <input type="text" placeholder="Route Name" value={newRoute.origin.routeName} onChange={e => setNewRoute({ ...newRoute, origin: { ...newRoute.origin, routeName: e.target.value } })} />
        </div>
        <div>
          <h4>Destination</h4>
          <input type="text" placeholder="Latitude" value={newRoute.destination.latitude} onChange={e => setNewRoute({ ...newRoute, destination: { ...newRoute.destination, latitude: e.target.value } })} />
          <input type="text" placeholder="Longitude" value={newRoute.destination.longitude} onChange={e => setNewRoute({ ...newRoute, destination: { ...newRoute.destination, longitude: e.target.value } })} />
          <input type="text" placeholder="Description" value={newRoute.destination.description} onChange={e => setNewRoute({ ...newRoute, destination: { ...newRoute.destination, description: e.target.value } })} />
          <input type="text" placeholder="Time" value={newRoute.destination.time} onChange={e => setNewRoute({ ...newRoute, destination: { ...newRoute.destination, time: e.target.value } })} />
          <input type="text" placeholder="Route Name" value={newRoute.destination.routeName} onChange={e => setNewRoute({ ...newRoute, destination: { ...newRoute.destination, routeName: e.target.value } })} />
        </div>
        <h4>Checkpoints</h4>
        <div>
          {newRoute.checkpoints.map((checkpoint, index) => (
            <div key={index}>
              <input type="text" placeholder="Latitude" value={checkpoint.latitude} onChange={e => handleCheckpointChange(index, 'latitude', e.target.value)} />
              <input type="text" placeholder="Longitude" value={checkpoint.longitude} onChange={e => handleCheckpointChange(index, 'longitude', e.target.value)} />
              <input type="text" placeholder="Description" value={checkpoint.description} onChange={e => handleCheckpointChange(index, 'description', e.target.value)} />
              <input type="text" placeholder="Time" value={checkpoint.time} onChange={e => handleCheckpointChange(index, 'time', e.target.value)} />
              <input type="text" placeholder="Route Name" value={checkpoint.routeName} onChange={e => handleCheckpointChange(index, 'routeName', e.target.value)} />
            </div>
          ))}
          <button onClick={handleAddCheckpoint}>Add Checkpoint</button>
        </div>
        <button onClick={handleAddRoute}>Add Route</button>
      </div>
      <div>
        <h3>Existing Routes</h3>
        <ul>
          {routes.map(route => (
            <li key={route._id}>
              <div>
              <span>Origin: {route.origin.description} - {route.origin.time}</span><br />
              <span>Destination: {route.destination.description} - {route.destination.time}</span><br />
              <span>Checkpoints: {route.checkpoints.map(checkpoint => (
                <span key={checkpoint._id}>{checkpoint.description} - {checkpoint.time}</span>
              ))}</span><br />
              <span>Bus Number: {buses.find(bus => bus._id === route.busId)?.busNumber}</span>
              <span>Bus Name: {buses.find(bus => bus._id === route.busId)?.busName}</span><br />
                {editingRouteId === route._id ? (
                  <div>
                    <div>
                    <input type="text" placeholder="Latitude" value={newRoute.origin.latitude} onChange={e => setNewRoute({ ...newRoute, origin: { ...newRoute.origin, latitude: e.target.value } })} />
                    <input type="text" placeholder="Longitude" value={newRoute.origin.longitude} onChange={e => setNewRoute({ ...newRoute, origin: { ...newRoute.origin, longitude: e.target.value } })} />
                    <input type="text" placeholder="Description" value={newRoute.origin.description} onChange={e => setNewRoute({ ...newRoute, origin: { ...newRoute.origin, description: e.target.value } })} />
                    <input type="text" placeholder="Time" value={newRoute.origin.time} onChange={e => setNewRoute({ ...newRoute, origin: { ...newRoute.origin, time: e.target.value } })} />
                    <input type="text" placeholder="Route Name" value={newRoute.origin.routeName} onChange={e => setNewRoute({ ...newRoute, origin: { ...newRoute.origin, routeName: e.target.value } })} />
                    </div>
                    <input type="text" placeholder="Latitude" value={newRoute.destination.latitude} onChange={e => setNewRoute({ ...newRoute, destination: { ...newRoute.destination, latitude: e.target.value } })} />
                    <input type="text" placeholder="Longitude" value={newRoute.destination.longitude} onChange={e => setNewRoute({ ...newRoute, destination: { ...newRoute.destination, longitude: e.target.value } })} />
                    <input type="text" placeholder="Description" value={newRoute.destination.description} onChange={e => setNewRoute({ ...newRoute, destination: { ...newRoute.destination, description: e.target.value } })} />
                    <input type="text" placeholder="Time" value={newRoute.destination.time} onChange={e => setNewRoute({ ...newRoute, destination: { ...newRoute.destination, time: e.target.value } })} />
                    <input type="text" placeholder="Route Name" value={newRoute.destination.routeName} onChange={e => setNewRoute({ ...newRoute, destination: { ...newRoute.destination, routeName: e.target.value } })} />
                    {newRoute.checkpoints.map((checkpoint, index) => (
                      <div key={index}>
                        <input type="text" placeholder="Latitude" value={checkpoint.latitude} onChange={e => handleCheckpointChange(index, 'latitude', e.target.value)} />
                        <input type="text" placeholder="Longitude" value={checkpoint.longitude} onChange={e => handleCheckpointChange(index, 'longitude', e.target.value)} />
                        <input type="text" placeholder="Description" value={checkpoint.description} onChange={e => handleCheckpointChange(index, 'description', e.target.value)} />
                        <input type="text" placeholder="Time" value={checkpoint.time} onChange={e => handleCheckpointChange(index, 'time', e.target.value)} />
                        <input type="text" placeholder="Route Name" value={checkpoint.routeName} onChange={e => handleCheckpointChange(index, 'routeName', e.target.value)} />
                      </div>
                    ))}
                    <button onClick={() => handleModifyRoute(route._id, newRoute)}>Save</button>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => handleEditRoute(route)}>Modify</button>
                    <button onClick={() => handleDeleteRoute(route._id)}>Delete</button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BusRoutes;
