import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">Bus Management</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/buses">Manage Buses</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/routes">Manage Routes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/assign-bus">Assign Bus to Driver</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/busStops">Manage Bus Stops</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/busStopList">Manage Bus Stops List</Link>
              </li>
            </ul>
          </div>
        </nav>

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
