import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from './apiConfig';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const BusStopList = () => {
  const [busStops, setBusStops] = useState([]);
  const [busDetails, setBusDetails] = useState([]);
  const [selectedBuses, setSelectedBuses] = useState([]);
  const [busStopDetails, setBusStopDetails] = useState({});

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
  }, [busStops]);

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
      await axios.put(`${apiUrl}/api/busStops/${busStopId}`, { buses: selectedBusIds });
      
      // Update busStopDetails with the newly added buses
      setBusStopDetails(prevDetails => ({
        ...prevDetails,
        [busStopId]: busDetails.filter(bus => selectedBusIds.includes(bus._id))
      }));

      setSelectedBuses([]);
    } catch (error) {
      console.error('Error updating bus stop:', error);
    }
  };

  return (
    <Container>
      <h2 className="my-4 text-center">Manage Bus Stops</h2>
      <Row>
        {busStops.map(busStop => (
          <Col md={4} key={busStop._id} className="mb-4">
            <Card>
              <Card.Img variant="top" src={busStop.stationImage} alt={busStop.stationName} />
              <Card.Body>
                <Card.Title>{busStop.stationName}</Card.Title>
                <Card.Text>
                  <strong>Coordinates:</strong> {busStop.coordinate.latitude}, {busStop.coordinate.longitude}
                </Card.Text>
                <Card.Text>
                  <strong>Distance:</strong> {busStop.distance} km
                </Card.Text>
                <Card.Text>
                  <strong>Time:</strong> {busStop.time}
                </Card.Text>
                <Form>
                  <Form.Group controlId={`formBusSelection_${busStop._id}`}>
                    <Form.Label><strong>Select Bus:</strong></Form.Label>
                    {busDetails.map(bus => (
                      <Form.Check
                        type="checkbox"
                        id={`busCheckbox_${busStop._id}_${bus._id}`}
                        value={bus._id}
                        label={`${bus.busName} - ${bus.busNumber}`}
                        onChange={(e) => handleBusChange(e, busStop._id)}
                        key={bus._id}
                      />
                    ))}
                  </Form.Group>
                  <Button
                    variant="primary"
                    onClick={() => handleAddToBusStop(busStop._id)}
                    className="mt-2"
                  >
                    Add to Bus Stop
                  </Button>
                </Form>
                <div className="mt-4">
                  <h5>Selected Buses for {busStop.stationName}</h5>
                  <ul>
                    {busStopDetails[busStop._id] && busStopDetails[busStop._id].map(bus => (
                      <li key={bus._id}>
                        {bus.busName} - {bus.busNumber}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BusStopList;
