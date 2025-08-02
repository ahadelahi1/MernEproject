import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h5 className="text-center mb-4">EventSphere Admin</h5>
      <Link to="/">Dashboard</Link>
      <Link to="/expos">Manage Expos</Link>
    </div>
  );
};

export default Sidebar;
