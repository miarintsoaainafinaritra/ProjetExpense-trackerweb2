import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import ExpenseList from './components/Expenses/ExpenseList';
import IncomeList from './components/Incomes/IncomeList';
import Categories from './components/Categories/Categories';
import Profile from './components/Profile/Profile';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Footer from './components/Layout/Footer';
import './App.css';
import './components/Auth/Auth.css';
import './components/Dashboard/Dashboard.css';
import './components/Expenses/ExpenseList.css';
import './components/Incomes/IncomeList.css';
import './components/Categories/Categories.css';
import './components/Profile/Profile.css';
import './components/Layout/Navbar.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      {isAuthenticated && (
        <div className="app-header">
          <div className="app-brand">
            <i className="fas fa-wallet"></i>
            <span>MoneyTracker</span>
          </div>
          <div className="header-actions">
            <button 
              className="dark-mode-toggle" 
              onClick={toggleDarkMode}
              title={darkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      )}
      <div className="app-layout">
        {isAuthenticated && <Sidebar />}
        <div className="content-area">
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} 
            />
            <Route 
              path="/" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/expenses" 
              element={isAuthenticated ? <ExpenseList /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/incomes" 
              element={isAuthenticated ? <IncomeList /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/categories" 
              element={isAuthenticated ? <Categories /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </div>
      {isAuthenticated && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
