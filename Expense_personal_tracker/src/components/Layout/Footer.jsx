import React from 'react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-simple">
          <p className="footer-text">© {currentYear} Expense Tracker - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}
