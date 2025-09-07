/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#007bff',
    icon: 'fas fa-tag'
  });

  const iconOptions = [
    { value: 'fas fa-utensils', label: 'Alimentation', icon: 'fas fa-utensils' },
    { value: 'fas fa-car', label: 'Transport', icon: 'fas fa-car' },
    { value: 'fas fa-home', label: 'Logement', icon: 'fas fa-home' },
    { value: 'fas fa-heartbeat', label: 'Santé', icon: 'fas fa-heartbeat' },
    { value: 'fas fa-gamepad', label: 'Loisirs', icon: 'fas fa-gamepad' },
    { value: 'fas fa-tshirt', label: 'Vêtements', icon: 'fas fa-tshirt' },
    { value: 'fas fa-graduation-cap', label: 'Éducation', icon: 'fas fa-graduation-cap' },
    { value: 'fas fa-shopping-cart', label: 'Shopping', icon: 'fas fa-shopping-cart' },
    { value: 'fas fa-gas-pump', label: 'Carburant', icon: 'fas fa-gas-pump' },
    { value: 'fas fa-phone', label: 'Téléphone', icon: 'fas fa-phone' },
    { value: 'fas fa-wifi', label: 'Internet', icon: 'fas fa-wifi' },
    { value: 'fas fa-film', label: 'Divertissement', icon: 'fas fa-film' },
    { value: 'fas fa-dumbbell', label: 'Sport', icon: 'fas fa-dumbbell' },
    { value: 'fas fa-plane', label: 'Voyage', icon: 'fas fa-plane' },
    { value: 'fas fa-gift', label: 'Cadeaux', icon: 'fas fa-gift' },
    { value: 'fas fa-ellipsis-h', label: 'Autres', icon: 'fas fa-ellipsis-h' }
  ];

  const colorOptions = [
    '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
    '#6f42c1', '#e83e8c', '#fd7e14', '#20c997', '#6c757d'
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    const mockCategories = [
      {
        _id: '1',
        name: 'Alimentation',
        color: '#e74c3c',
        icon: 'fas fa-utensils'
      },
      {
        _id: '2',
        name: 'Transport',
        color: '#3498db',
        icon: 'fas fa-car'
      },
      {
        _id: '3',
        name: 'Loisirs',
        color: '#9b59b6',
        icon: 'fas fa-gamepad'
      },
      {
        _id: '4',
        name: 'Santé',
        color: '#2ecc71',
        icon: 'fas fa-heartbeat'
      },
      {
        _id: '5',
        name: 'Logement',
        color: '#f39c12',
        icon: 'fas fa-home'
      }
    ];
    setCategories(mockCategories);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat._id === editingCategory._id 
          ? { ...editingCategory, ...formData }
          : cat
      ));
      setSuccess('Catégorie modifiée avec succès');
    } else {
      const newCategory = {
        _id: Date.now().toString(),
        ...formData
      };
      setCategories([...categories, newCategory]);
      setSuccess('Catégorie créée avec succès');
    }
    resetForm();
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon
    });
    setShowModal(true);
  };

  const handleDelete = () => {
    setCategories(categories.filter(cat => cat._id !== categoryToDelete._id));
    setSuccess('Catégorie supprimée avec succès');
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#007bff',
      icon: 'fas fa-tag'
    });
    setEditingCategory(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const CustomModal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h3>{title}</h3>
            <button onClick={onClose} className="modal-close">&times;</button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <div className="header-content">
          <h2>
            <i className="fas fa-tags"></i>
            Mes Catégories
          </h2>
          <p>Gérez vos catégories de dépenses et personnalisez votre organisation</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="btn btn-primary"
        >
          <i className="fas fa-plus"></i>
          Nouvelle Catégorie
        </button>
      </div>

      <div className="categories-card">
        {categories.length > 0 ? (
          <div className="categories-table">
            <div className="table-header">
              <div><i className="fas fa-image"></i> Icône</div>
              <div><i className="fas fa-tag"></i> Nom</div>
              <div><i className="fas fa-palette"></i> Couleur</div>
              <div></div>
            </div>
            <div className="table-body">
              {categories.map(category => (
                <div className="table-row" key={category._id}>
                  <div className="table-cell icon-cell">
                    <i className={category.icon} style={{color: category.color, fontSize: '1.2rem'}}></i>
                  </div>
                  <div className="table-cell name-cell">
                    <strong>{category.name}</strong>
                  </div>
                  <div className="table-cell color-cell">
                    <span className="color-badge" style={{backgroundColor: category.color}}></span>
                    <span className="color-code">{category.color}</span>
                  </div>
                  <div className="table-cell actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEdit(category)}
                        title="Modifier cette catégorie"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => {
                          setCategoryToDelete(category);
                          setShowDeleteModal(true);
                        }}
                        title="Supprimer cette catégorie"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-tags"></i>
            <h5>Aucune catégorie trouvée</h5>
            <p>Une catégorie contient : Nom, Icône, Couleur pour organiser vos dépenses</p>
            <p>Les catégories vous aident à classer et analyser vos transactions</p>
            <button 
              onClick={openCreateModal}
              className="btn btn-primary"
            >
              <i className="fas fa-plus"></i>
              Nouvelle Catégorie
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <CustomModal 
          show={showModal} 
          onClose={() => setShowModal(false)}
          title={editingCategory ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
        >
          <form onSubmit={handleSubmit} className="custom-form">
            <div className="form-group">
              <label>Nom *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Icône</label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="form-select"
              >
                {iconOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                {editingCategory ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </CustomModal>
      )}

      {showDeleteModal && (
        <CustomModal 
          show={showDeleteModal} 
          onClose={() => setShowDeleteModal(false)}
          title="Confirmer la suppression"
        >
          <div>
            <p>Êtes-vous sûr de vouloir supprimer la catégorie "{categoryToDelete?.name}" ?</p>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={handleDelete}
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default Categories;



