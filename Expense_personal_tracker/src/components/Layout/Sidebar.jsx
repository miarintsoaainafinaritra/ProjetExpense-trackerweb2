import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="fas fa-wallet"></i>
          <span>MoneyTracker</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-title">TABLEAU DE BORD</div>
          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <Link 
                to="/" 
                className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                <i className="fas fa-chart-line"></i>
                <span>Vue d'ensemble</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">TRANSACTIONS</div>
          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <Link 
                to="/expenses" 
                className={`sidebar-link ${location.pathname === '/expenses' ? 'active' : ''}`}
              >
                <i className="fas fa-credit-card"></i>
                <span>Dépenses</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link 
                to="/incomes" 
                className={`sidebar-link ${location.pathname === '/incomes' ? 'active' : ''}`}
              >
                <i className="fas fa-coins"></i>
                <span>Revenus</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">CONFIGURATION</div>
          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <Link 
                to="/categories" 
                className={`sidebar-link ${location.pathname === '/categories' ? 'active' : ''}`}
              >
                <i className="fas fa-tags"></i>
                <span>Catégories</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link 
                to="/profile" 
                className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}
              >
                <i className="fas fa-user-cog"></i>
                <span>Profil</span>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="sidebar-footer">
          <button 
            className="sidebar-link logout-link"
            onClick={handleLogout}
            title="Se déconnecter"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
