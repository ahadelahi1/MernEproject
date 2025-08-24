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
import ProtectedRoute from './components/ProtectedRoute';
import ExhibitorList from './pages/ExhibitorList';
import Index from './WebPages/Index';
import ParticipationList from './pages/ParticipationList';



// import AddParticipation from './components/AddParticipation';

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

  // Pages jahan sidebar nahi chahiye
  const noSidebarRoutes = [
    '/',
    '/register',
    '/login',
    '/fp',
    '/re/:token',
    '/admin-login',
  ];

  const isExhibitorRoute = exhibitorRoutes.some(route =>
    location.pathname.startsWith(route)
  );

// special case for reset password
const isResetPasswordRoute = location.pathname.startsWith('/re/');

const isNoSidebarRoute =
  noSidebarRoutes.includes(location.pathname) || isResetPasswordRoute;


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
            {/* Admin Login */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Admin Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/expos" element={
              <ProtectedRoute><ExpoList /></ProtectedRoute>
            } />
            <Route path="/expos/add" element={
              <ProtectedRoute><AddExpo /></ProtectedRoute>
            } />
            <Route path="/expos/edit/:id" element={
              <ProtectedRoute><EditExpo /></ProtectedRoute>
            } />
            <Route path="/halls/edit/:id" element={
              <ProtectedRoute><EditHall /></ProtectedRoute>
            } />
            <Route path="/halls/add" element={
              <ProtectedRoute><AddHall /></ProtectedRoute>
            } />
            <Route path="/halls" element={
              <ProtectedRoute><ShowHalls /></ProtectedRoute>
            } />
            <Route path="/add-booth" element={
              <ProtectedRoute><AddBooth /></ProtectedRoute>
            } />
            <Route path="/booths" element={
              <ProtectedRoute><ShowBooths /></ProtectedRoute>
            } />
            <Route path="/booths/edit/:id" element={
              <ProtectedRoute><EditBooth /></ProtectedRoute>
            } />
            <Route path="/visitors" element={
              <ProtectedRoute><VisitorList /></ProtectedRoute>
            } />
            <Route path="/exhibitors" element={
              <ProtectedRoute><ExhibitorList /></ProtectedRoute>
            } />
            <Route path="/participation" element={
              <ProtectedRoute><ParticipationList /></ProtectedRoute>
            } />

            {/* Normal Auth Routes */}
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





            {/* Web Main */}
            <Route path="/" element={<Index />} />

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
