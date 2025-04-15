import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './containers/Login/loginPage';
//import Register from './containers/Login/Register';
//import ForgotPassword from './containers/Login/ForgotPassword';
import MyIdeas from './containers/MyIdeas/Myideas';
import HomePage from './containers/HomePage/HomePage';
import MainLayout from './layout/MainLayout';

const App = () => {
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');
  const userBranch = localStorage.getItem('userBranch');

  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />

        {/* PRIVATE ROUTES z MenuBar */}
        <Route element={<MainLayout userRole={userRole} onLogout={handleLogout} />}>
          <Route path="/homePage" element={<HomePage userEmail={userEmail} userRole={userRole} userBranch={userBranch} />} />
          <Route path='/myIdeas' element={<MyIdeas userEmail={userEmail} userRole={userRole} userBranch={userBranch} />} />
          {/* Dodasz więcej stron tutaj */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
