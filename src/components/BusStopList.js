import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from './apiConfig';

const BusStopList = () => {
  const [busStops, setBusStops] = useState([]);
  const [busDetails, setBusDetails] = useState([]);
  const [selectedBuses, setSelectedBuses] = useState([]); // State to hold selected bus details for each bus stop
  const [busStopDetails, setBusStopDetails] = useState({}); // State to hold selected bus details for each bus stop

  useEffect(() => {
    const fetchBusStops = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/busStops`);
        setBusStops(response.data);
      } catch (error) {
        console.error('Error fetching bus stops:', error);
      }
    };

    const fetchBusDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/bus-details`);
        setBusDetails(response.data);
      } catch (error) {
        console.error('Error fetching bus details:', error);
      }
    };

    fetchBusStops();
    fetchBusDetails();
  }, []);

  useEffect(() => {
    // Fetch bus details for each bus stop
    const fetchBusStopDetails = async () => {
      const busStopDetailsPromises = busStops.map(async (busStop) => {
        try {
          const response = await axios.get(`${apiUrl}/api/busStops/${busStop._id}`);
          return { busStopId: busStop._id, buses: response.data.buses };
        } catch (error) {
          console.error(`Error fetching bus details for bus stop ${busStop._id}:`, error);
          return { busStopId: busStop._id, buses: [] };
        }
      });
      const details = await Promise.all(busStopDetailsPromises);
      const detailsMap = {};
      details.forEach(detail => {
        detailsMap[detail.busStopId] = detail.buses;
      });
      setBusStopDetails(detailsMap);
    };

    fetchBusStopDetails();
  }, [busStops]); // Trigger fetch when busStops change

  const handleBusChange = (e, busStopId) => {
    const selectedBusId = e.target.value;
    if (e.target.checked) {
      setSelectedBuses(prevState => [...prevState, { busStopId, busId: selectedBusId }]);
    } else {
      setSelectedBuses(prevState => prevState.filter(bus => !(bus.busStopId === busStopId && bus.busId === selectedBusId)));
    }
  };

  const handleAddToBusStop = async (busStopId) => {
    try {
      const selectedBusIds = selectedBuses.filter(bus => bus.busStopId === busStopId).map(bus => bus.busId);
      const response = await axios.put(`${apiUrl}/api/busStops/${busStopId}`, {
        buses: selectedBusIds,
      });
      console.log('Updated bus stop:', response.data);
      // Clear selected buses after adding
      setSelectedBuses([]);
      // Optionally handle success feedback
    } catch (error) {
      console.error('Error updating bus stop:', error);
      // Optionally handle error feedback
    }
  };

  return (
    <div>
      <h2>Bus Stops</h2>
      <ul>
        {busStops.map(busStop => (
          <li key={busStop._id}>
            <p><strong>Station Name:</strong> {busStop.stationName}</p>
            <p><strong>Coordinates:</strong> {busStop.coordinate.latitude}, {busStop.coordinate.longitude}</p>
            <p><strong>Station Image:</strong> <img src={busStop.stationImage} alt={busStop.stationName} /></p>
            <p><strong>Distance:</strong> {busStop.distance}</p>
            <p><strong>Time:</strong> {busStop.time}</p>
            <div>
              <label><strong>Select Bus:</strong></label>
              {busDetails.map(bus => (
                <div key={bus._id}>
                  <input
                    type="checkbox"
                    id={`busCheckbox_${busStop._id}_${bus._id}`}
                    value={bus._id}
                    onChange={(e) => handleBusChange(e, busStop._id)}
                  />
                  <label htmlFor={`busCheckbox_${busStop._id}_${bus._id}`}>
                    {bus.busName} - {bus.busNumber}
                  </label>
                </div>
              ))}
            </div>
            <button onClick={() => handleAddToBusStop(busStop._id)}>Add to Bus Stop</button>
            {/* Display selected bus details for the bus stop */}
            <div>
              <h3>Selected Buses for {busStop.stationName}</h3>
              <ul>
                {busStopDetails[busStop._id] && busStopDetails[busStop._id].map(selectedBusId => {
                  const bus = busDetails.find(bus => bus._id === selectedBusId);
                  return (
                    <li key={selectedBusId}>
                      {bus && `${bus.busName} - ${bus.busNumber}`}
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusStopList;
