import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectDetails from './pages/ProjectDetails';

import './index.css';

function App() {
  return (
    <BrowserRouter>
       <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
