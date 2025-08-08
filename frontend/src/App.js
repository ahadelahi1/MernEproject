import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ExpoList from './pages/ExpoList';
import AddExpo from './pages/AddExpo';
import EditExpo from './pages/EditExpo';
import EditHall from './pages/EditHall';
import AddHall from './pages/AddHall';
import ShowHalls from './pages/ShowHalls';
import AddBooth from './pages/AddBooth';
import ShowBooths from './pages/ShowBooths';
import EditBooth from './pages/EditBooths';
import AdminLogin from './pages/AdminLogin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterData from './register/Register';
import Login from './register/Login';
import ForgetPassword from './register/ForgetPassword';
import ResetPassword from './register/ResetPassword';
import "bootstrap-icons/font/bootstrap-icons.css";

// ✅ Yeh wala component router ke andar hona chahiye
function AppContent() {
  const location = useLocation();

  // ✅ Sidebar hide karna hai login/register pages par
  const hideSidebarRoutes = ['/register', '/login', '/fp', '/re'];
  const shouldHideSidebar = hideSidebarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="admin-panel d-flex">
      {/* ✅ Conditional Sidebar */}
      {!shouldHideSidebar && <Sidebar />}

      <div className="main-content flex-grow-1">
        <div className="p-4">
          <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/expos" element={<ExpoList />} />
                    <Route path="/expos/add" element={<AddExpo />} />
                    <Route path="/expos/edit/:id" element={<EditExpo />} />
                    <Route path="/halls/edit/:id" element={<EditHall />} />
                    <Route path="/halls/add" element={<AddHall />} />
                    <Route path="/halls" element={<ShowHalls />} />
                    <Route path="/add-booth" element={<AddBooth />} />
                    <Route path="/booths" element={<ShowBooths />} />
                    <Route path="/booths/edit/:id" element={<EditBooth />} />
            <Route path="/register" element={<RegisterData />} />
            <Route path="/login" element={<Login />} />
            <Route path="/fp" element={<ForgetPassword />} />
            <Route path="/re/:token" element={<ResetPassword />} />
          </Routes>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

// ✅ Main App component — sirf Router wrap karta hai
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
