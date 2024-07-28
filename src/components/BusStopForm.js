import React, { useState } from 'react';
import axios from 'axios';
import apiUrl from './apiConfig';

const BusStopForm = () => {
  const [stationName, setStationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [stationImage, setStationImage] = useState('');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/busStops/`, {
        stationName,
        coordinate: { latitude, longitude },
        stationImage,
        distance,
        time,
        buses,
        routes
      });
      console.log('Bus Stop created:', response.data);
      // Optionally handle success feedback or redirect
    } catch (error) {
      console.error('Error creating bus stop:', error);
      // Optionally handle error feedback
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Bus Stop</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="stationName" className="form-label">Station Name:</label>
          <input type="text" className="form-control" id="stationName" value={stationName} onChange={(e) => setStationName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="latitude" className="form-label">Latitude:</label>
          <input type="number" className="form-control" id="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="longitude" className="form-label">Longitude:</label>
          <input type="number" className="form-control" id="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="stationImage" className="form-label">Station Image URL:</label>
          <input type="text" className="form-control" id="stationImage" value={stationImage} onChange={(e) => setStationImage(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="distance" className="form-label">Distance:</label>
          <input type="text" className="form-control" id="distance" value={distance} onChange={(e) => setDistance(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="time" className="form-label">Time:</label>
          <input type="text" className="form-control" id="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
        {/* Select boxes for buses and routes */}
        <button type="submit" className="btn btn-primary">Add Bus Stop</button>
      </form>
    </div>
  );
};

export default BusStopForm;
