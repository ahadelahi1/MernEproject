import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ExhibitorSidebar from './components/ExhibitorSidebar';
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
import VisitorList from './pages/VisitorList';
import ExhibitorRegister from './Exhibitor/ExhibitorRegister';
import ExhibitorLogin from './Exhibitor/ExhibitorLogin';
import BoothBooking from './Exhibitor/BoothBooking';
import ExhibitorDashboard from './Exhibitor/ExhibitorDashboard';
import ExhibitorProfile from './Exhibitor/ExhibitorProfile';

function AppContent() {
  const location = useLocation();

  // Exhibitor specific routes
  const exhibitorRoutes = [
    '/exhibitorreg',
    '/exhibitorlogin',
    '/booking',
    '/exhibitordashboard',
    '/exhibitorprofile'
  ];

  // Pages jahan koi sidebar nahi dikhana
  const noSidebarRoutes = [
    '/register',
    '/login',
    '/fp',
    '/re'
  ];

  // Show flags
  const isExhibitorRoute = exhibitorRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  const isNoSidebarRoute = noSidebarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  const showExhibitorSidebar = isExhibitorRoute;
  const showAdminSidebar = !isExhibitorRoute && !isNoSidebarRoute;

  return (
    <div className="admin-panel d-flex">
      {/* Conditional Sidebars */}
      {showAdminSidebar && <Sidebar />}
      {showExhibitorSidebar && <ExhibitorSidebar />}

      <div className="main-content flex-grow-1">
        <div className="p-4">
          <Routes>
            {/* Admin Routes */}
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
            <Route path="/visitors" element={<VisitorList />} />

            {/* Auth Routes */}
            <Route path="/register" element={<RegisterData />} />
            <Route path="/login" element={<Login />} />
            <Route path="/fp" element={<ForgetPassword />} />
            <Route path="/re/:token" element={<ResetPassword />} />

            {/* Exhibitor Routes */}
            <Route path="/exhibitorreg" element={<ExhibitorRegister />} />
            <Route path="/exhibitorlogin" element={<ExhibitorLogin />} />
            <Route path="/booking" element={<BoothBooking />} />
            <Route path="/exhibitordashboard" element={<ExhibitorDashboard />} />
            <Route path="/exhibitorprofile" element={<ExhibitorProfile />} />
          </Routes>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
