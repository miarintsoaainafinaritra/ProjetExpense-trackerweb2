/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setCategories([
        {_id: '1', name: 'Alimentation', icon: 'fas fa-utensils', color: '#FF6384'},
        {_id: '2', name: 'Transport', icon: 'fas fa-car', color: '#36A2EB'}
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="categories-container">
      <h2>Catégories</h2>
      
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <ul className="categories-list">
          {categories.map(category => (
            <li key={category._id}>
              <i className={category.icon} style={{color: category.color}}></i>
              {category.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Categories;
