/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './IncomeList.css';



const IncomeList = () => {
  const [incomes, setIncomes] = useState([
    {
      _id: '1',
      title: 'Salaire',
      amount: 2500.00,
      source: 'Emploi principal',
      date: '2025-09-04',
      description: 'Salaire mensuel',
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'Freelance',
      amount: 800.00,
      source: 'Travail indépendant',
      date: '2025-09-03',
      description: 'Projet web développement',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      _id: '3',
      title: 'Dividendes',
      amount: 150.00,
      source: 'Investissements',
      date: '2025-09-02',
      description: 'Dividendes actions',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [searchTerm, setSearchTerm] = useState('');

  // États pour les modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [incomeToDelete, setIncomeToDelete] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    createdAt: new Date().toISOString()
  });

  useEffect(() => {
    fetchIncomes();
  }, [filters]);

  const fetchIncomes = () => {
    setLoading(true);
    const mockIncomes = [
      {
        _id: '1',
        title: 'Salaire',
        amount: 2500.00,
        source: 'Emploi principal',
        date: new Date().toISOString(),
        description: 'Salaire mensuel',
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        title: 'Freelance',
        amount: 800.00,
        source: 'Travail indépendant',
        date: new Date(Date.now() - 86400000).toISOString(),
        description: 'Projet freelance',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        _id: '3',
        title: 'Dividendes',
        amount: 150.00,
        source: 'Investissements',
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        description: 'Dividendes actions',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];
    setIncomes(mockIncomes);
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  // Filtrage des revenus
  const filteredIncomes = incomes.filter(income => {
    const matchesSearch = searchTerm === '' || 
      income.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleDeleteIncome = () => {
    setIncomes(incomes.filter(income => income._id !== incomeToDelete._id));
    setShowDeleteModal(false);
    setIncomeToDelete(null);
  };

  const handleAddIncome = (e) => {
    e.preventDefault();
    const newIncome = {
      _id: Date.now().toString(),
      title: formData.title,
      amount: parseFloat(formData.amount),
      source: formData.source,
      date: formData.date,
      description: formData.description,
      createdAt: new Date().toISOString()
    };
    setIncomes([newIncome, ...incomes]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditIncome = (e) => {
    e.preventDefault();
    const updatedIncomes = incomes.map(income =>
      income._id === editingIncome._id
        ? {
            ...income,
            title: formData.title,
            amount: parseFloat(formData.amount),
            source: formData.source,
            date: formData.date,
            description: formData.description
          }
        : income
    );
    setIncomes(updatedIncomes);
    setShowEditModal(false);
    setEditingIncome(null);
    resetForm();
  };

  const openEditModal = (income) => {
    setEditingIncome(income);
    setFormData({
      title: income.title,
      amount: income.amount.toString(),
      source: income.source || '',
      description: income.description,
      date: income.date.split('T')[0]
    });
    setShowEditModal(true);
  };

  const openViewModal = (income) => {
    setCurrentIncome(income);
    setShowViewModal(true);
  };

  const exportToCSV = () => {
    const headers = ['Titre', 'Montant', 'Date', 'Source', 'Description', 'Date de création'];
    const csvData = [
      headers,
      ...filteredIncomes.map(income => [
        income.title,
        income.amount,
        formatDate(income.date),
        income.source,
        income.description || '',
        formatDate(income.createdAt)
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `revenus_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      source: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="income-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="income-list-container">
      <div className="income-header">
        <div className="header-content">
          <h2>
            <i className="fas fa-coins"></i>
            Mes Revenus
          </h2>
          <p>Gérez vos sources de revenus et suivez vos entrées d'argent</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <i className="fas fa-plus"></i>
          Nouveau Revenu
        </button>
      </div>

      {/* Search and Filters */}
      <div className="filters-card">
        <div className="filters-header">
          <h5>
            <i className="fas fa-filter"></i>
            Recherche et Filtres
          </h5>
        </div>
        
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Rechercher par titre, description ou source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="clear-search"
                title="Effacer la recherche"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label>Mois</label>
            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className="form-select"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2023, i, 1).toLocaleDateString('fr-FR', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Année</label>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="form-select"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={2020 + i} value={2020 + i}>
                  {2020 + i}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Incomes Table */}
      <div className="incomes-card">
        {filteredIncomes.length > 0 ? (
          <div className="incomes-table">
            <div className="table-header">
              <div><i className="fas fa-file-text"></i> Description</div>
              <div><i className="fas fa-euro-sign"></i> Montant</div>
              <div><i className="fas fa-calendar"></i> Date</div>
              <div><i className="fas fa-building"></i> Source</div>
              <div></div>
            </div>
            <div className="table-body">
              {filteredIncomes.map(income => (
                <div key={income._id} className="table-row">
                  <div className="table-cell">
                    <div className="income-info">
                      <strong>{income.title}</strong>
                      {income.description && (
                        <small className="income-description">{income.description}</small>
                      )}
                    </div>
                  </div>
                  <div className="table-cell amount-cell">
                    <span className="income-amount">{formatCurrency(income.amount)}</span>
                  </div>
                  <div className="table-cell date-cell">
                    <span>{formatDate(income.date)}</span>
                  </div>
                  <div className="table-cell source-cell">
                    <span className="source-badge">{income.source}</span>
                  </div>
                  <div className="table-cell">
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => openViewModal(income)}
                        title="Voir les détails complets"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => openEditModal(income)}
                        title="Modifier ce revenu"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => {
                          setIncomeToDelete(income);
                          setShowDeleteModal(true);
                        }}
                        title="Supprimer ce revenu"
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
            <i className="fas fa-coins"></i>
            <h5>Aucun revenu trouvé</h5>
            <p>Un revenu contient : Montant, Date, Source, Description (optionnelle), Date de création (auto-générée)</p>
            <p>Les revenus apparaissent dans les résumés mensuels et calculs de budget</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              <i className="fas fa-plus"></i>
              Nouveau Revenu
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Ajouter un revenu</h3>
              <button onClick={() => setShowAddModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleAddIncome}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="form-control"
                    placeholder="Ex: Salaire, Prime, Freelance..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Source *</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="form-control"
                    placeholder="Ex: Emploi principal, Travail indépendant, Investissements..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Montant * (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="form-control"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description (optionnelle)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="form-control"
                    rows="3"
                    placeholder="Détails supplémentaires sur ce revenu..."
                  />
                </div>
                <div className="form-info">
                  <small className="text-muted">
                    <i className="fas fa-info-circle"></i>
                    La date de création sera automatiquement générée lors de l'ajout.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Modifier le revenu</h3>
              <button onClick={() => setShowEditModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleEditIncome}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="form-control"
                    placeholder="Ex: Salaire, Prime, Freelance..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Source *</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="form-control"
                    placeholder="Ex: Emploi principal, Travail indépendant, Investissements..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Montant * (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="form-control"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description (optionnelle)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="form-control"
                    rows="3"
                    placeholder="Détails supplémentaires sur ce revenu..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && currentIncome && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Détails du revenu</h3>
              <button onClick={() => setShowViewModal(false)} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="income-details">
                <div className="detail-row">
                  <strong>Titre :</strong>
                  <span>{currentIncome.title}</span>
                </div>
                <div className="detail-row">
                  <strong>Montant :</strong>
                  <span className="amount-highlight-success">{formatCurrency(currentIncome.amount)}</span>
                </div>
                <div className="detail-row">
                  <strong>Source :</strong>
                  <span className="source-badge">{currentIncome.source}</span>
                </div>
                <div className="detail-row">
                  <strong>Date :</strong>
                  <span>{formatDate(currentIncome.date)}</span>
                </div>
                {currentIncome.description && (
                  <div className="detail-row">
                    <strong>Description :</strong>
                    <span>{currentIncome.description}</span>
                  </div>
                )}
                <div className="detail-row">
                  <strong>Date de création :</strong>
                  <span>{formatDate(currentIncome.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button onClick={() => setShowDeleteModal(false)} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer ce revenu ?</p>
              {incomeToDelete && (
                <div className="income-preview">
                  <strong>{incomeToDelete.title}</strong><br />
                  <span className="amount-success">{formatCurrency(incomeToDelete.amount)}</span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </button>
              <button className="btn btn-danger" onClick={handleDeleteIncome}>
                <i className="fas fa-trash"></i>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeList;
