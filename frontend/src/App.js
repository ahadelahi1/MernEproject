import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ExpoList from './pages/ExpoList';
import AddExpo from './pages/AddExpo';
import EditExpo from './pages/EditExpo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="admin-panel d-flex">
        <Sidebar />
        <div className="main-content flex-grow-1">
          <div className="p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expos" element={<ExpoList />} />
              <Route path="/expos/add" element={<AddExpo />} />
              <Route path="/expos/edit/:id" element={<EditExpo />} />
            </Routes>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
