import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from './apiConfig';

const AssignBus = () => {
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [busDetails, setBusDetails] = useState({});
  const [RouteBusDetails, setRouteBusDetails] = useState({});
  const [DriverDetail, setDriverDetail] = useState({});
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Fetch all drivers, routes, and trips from backend upon component mount
    axios.all([
      axios.get(`${apiUrl}/api/driver/all`),
      axios.get(`${apiUrl}/api/bus-routes`),
      axios.get(`${apiUrl}/api/trips`)
    ])
    .then(axios.spread((driversRes, routesRes, tripsRes) => {
      setDrivers(driversRes.data);
      setRoutes(routesRes.data);
      setTrips(tripsRes.data);

      // Fetch additional details
      fetchBusDetails(routesRes.data);
      fetchBusRouteDetails(tripsRes.data);
      fetchDriverDetails(tripsRes.data);
    }))
    .catch(err => {
      console.error('Error fetching data:', err);
    });
  }, []);

  const fetchBusDetails = async (routesData) => {
    try {
      const promises = routesData.map(route =>
        axios.get(`${apiUrl}/api/bus-details/${route.busId}`)
      );
      const responses = await Promise.all(promises);
      const busDetailsData = responses.reduce((acc, response, index) => {
        const busDetail = response.data;
        acc[routesData[index]._id] = busDetail;
        return acc;
      }, {});
      setBusDetails(busDetailsData);
    } catch (error) {
      console.error('Error fetching bus details:', error);
    }
  };

  const fetchDriverDetails = async (driverData) => {
    try {
      const promises = driverData.map(driver =>
        axios.get(`${apiUrl}/api/driver/id/${driver.driverId}`)
      );
      const responses = await Promise.all(promises);
      const driverDetailData = responses.reduce((acc, response, index) => {
        const driverDetail = response.data;
        acc[driverData[index]._id] = {
          fullname: driverDetail.fullname
        };
        return acc;
      }, {});
      setDriverDetail(driverDetailData);
    } catch (error) {
      console.error('Error fetching driver details:', error);
    }
  };

  const fetchBusRouteDetails = async (tripsData) => {
    try {
      const promises = tripsData.map(async (trip) => {
        const response = await axios.get(`${apiUrl}/api/bus-routes/${trip.busRouteId}`);
        const busRouteDetail = response.data;
  
        const busDetailsResponse = await axios.get(`${apiUrl}/api/bus-details/${busRouteDetail.busId}`);
        const busDetail = busDetailsResponse.data;
  
        return {
          _id: trip._id,
          origin: busRouteDetail.origin.routeName,
          destination: busRouteDetail.destination.routeName,
          busName: busDetail.busName,
          busNumber: busDetail.busNumber,
        };
      });
  
      const resolvedResponses = await Promise.all(promises);
      const busRouteDetailsData = resolvedResponses.reduce((acc, data) => {
        acc[data._id] = {
          origin: data.origin,
          destination: data.destination,
          busName: data.busName,
          busNumber: data.busNumber,
        };
        return acc;
      }, {});
  
      setRouteBusDetails(busRouteDetailsData);
    } catch (error) {
      console.error('Error fetching bus route details:', error);
    }
  };

  const handleAssignBus = () => {
    if (!selectedDriver || !selectedRoute) {
      console.error('Please select both driver and route.');
      return;
    }

    axios.post(`${apiUrl}/api/trips/`, {
      driverId: selectedDriver,
      busRouteId: selectedRoute
    })
      .then(res => {
        console.log('Route assigned successfully:', res.data);
        setTrips([...trips, res.data]);
      })
      .catch(err => {
        console.error('Error assigning route:', err);
      });
  };

  const handleUpdateTrip = (tripId, updatedData) => {
    // Handle update logic here
    // Show the select options for driver and route
    setSelectedDriver(updatedData.driverId);
    setSelectedRoute(updatedData.busRouteId);
  };

  const handleConfirmUpdate = (tripId) => {
    // Handle confirm update logic here
    axios.put(`${apiUrl}/api/trips/${tripId}`, {
      driverId: selectedDriver,
      busRouteId: selectedRoute
    })
      .then(res => {
        console.log('Trip updated successfully:', res.data);
        const updatedTrips = trips.map(trip =>
          trip._id === tripId ? res.data : trip
        );
        setTrips(updatedTrips);
        setSelectedDriver(''); // Reset selected driver
        setSelectedRoute(''); // Reset selected route
      })
      .catch(err => {
        console.error('Error updating trip:', err);
      });
  };

  const handleDeleteTrip = (tripId) => {
    axios.delete(`${apiUrl}/api/trips/${tripId}`)
      .then(res => {
        console.log('Trip deleted successfully:', res.data.message);
        setTrips(trips.filter(trip => trip._id !== tripId));
      })
      .catch(err => {
        console.error('Error deleting trip:', err);
      });
  };

  return (
    <div className="container mt-5">
      <h2>Assign Bus Route to Driver</h2>
      <div className="row mb-3">
        <div className="col-md-4">
          <select className="form-select" value={selectedDriver} onChange={e => setSelectedDriver(e.target.value)}>
            <option value="">Select Driver</option>
            {drivers.map(driver => (
              <option key={driver._id} value={driver._id}>{driver.fullname}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={selectedRoute} onChange={e => setSelectedRoute(e.target.value)}>
            <option value="">Select Route</option>
            {routes.map(route => (
              <option key={route._id} value={route._id}>
                {`${route.origin.routeName} to ${route.destination.routeName} - ${busDetails[route._id] ? `${busDetails[route._id].busName} (${busDetails[route._id].busNumber})` : ''}`}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary" onClick={handleAssignBus}>Assign Route</button>
        </div>
      </div>

      <h2>Assigned Trips</h2>
      <ul className="list-group">
        {trips.map(trip => (
          <li key={trip._id} className="list-group-item">
            <p><strong>Driver:</strong> {DriverDetail[trip._id] ? `${DriverDetail[trip._id].fullname} ` : 'Loading...'}</p>
            <p><strong>Bus Route:</strong> {RouteBusDetails[trip._id] ? `${RouteBusDetails[trip._id].origin} to ${RouteBusDetails[trip._id].destination} - ${RouteBusDetails[trip._id].busName} - ${RouteBusDetails[trip._id].busNumber}` : 'Loading...'}</p>
            <button className="btn btn-warning me-2" onClick={() => handleUpdateTrip(trip._id, { driverId: trip.driverId, busRouteId: trip.busRouteId })}>Update</button>
            <button className="btn btn-danger" onClick={() => handleDeleteTrip(trip._id)}>Delete</button>
            {selectedDriver && selectedRoute && (
              <div className="mt-3">
                <select className="form-select me-2" value={selectedDriver} onChange={e => setSelectedDriver(e.target.value)}>
                  <option value="">Select Driver</option>
                  {drivers.map(driver => (
                    <option key={driver._id} value={driver._id}>{driver.fullname}</option>
                  ))}
                </select>
                <select className="form-select me-2" value={selectedRoute} onChange={e => setSelectedRoute(e.target.value)}>
                  <option value="">Select Route</option>
                  {routes.map(route => (
                    <option key={route._id} value={route._id}>
                      {`${route.origin.routeName} to ${route.destination.routeName} - ${busDetails[route._id] ? `${busDetails[route._id].busName} (${busDetails[route._id].busNumber})` : ''}`}
                    </option>
                  ))}
                </select>
                <button className="btn btn-success" onClick={() => handleConfirmUpdate(trip._id)}>Confirm Update</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignBus;
