import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ExpoList from './pages/ExpoList';
import AddExpo from './pages/AddExpo';
import EditExpo from './pages/EditExpo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterData from './register/Register';
import Login from './register/Login';
import ForgetPassword from './register/ForgetPassword';
import ResetPassword from './register/ResetPassword';

function App() {
  let [newroute ,setnewroute]=useState("");




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
              <Route path="/register" element={<RegisterData />} />
              <Route path= "/login" element={<Login/>}/>
              <Route path= "/fp" element={<ForgetPassword/>}/>

              <Route path ='/re/:token' element ={<ResetPassword/>} />
            </Routes>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
