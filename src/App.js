import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import Buses from './components/Buses';
import BusRoutes from './components/BusRoutes';
import AssignBus from './components/AssignBus';
import BusStopPage from './components/BusStopPage';
import BusStopList from './components/BusStopList';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const App = () => {
  return (
    <Router>
      <div className="container">
        <Navbar bg="light" expand="lg">
          <Navbar.Brand as={Link} to="/">Bus Management</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/buses">Manage Buses</Nav.Link>
              <Nav.Link as={Link} to="/routes">Manage Routes</Nav.Link>
              <Nav.Link as={Link} to="/assign-bus">Assign Bus to Driver</Nav.Link>
              <Nav.Link as={Link} to="/busStops">Manage Bus Stops</Nav.Link>
              <Nav.Link as={Link} to="/busStopList">Manage Bus Stops List</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="mt-4">
          <Routes>
            <Route path="/buses" element={<Buses />} />
            <Route path="/routes" element={<BusRoutes />} />
            <Route path="/assign-bus" element={<AssignBus />} />
            <Route path="/busStops" element={<BusStopPage />} />
            <Route path="/busStopList" element={<BusStopList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
