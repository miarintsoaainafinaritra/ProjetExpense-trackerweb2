/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ExpenseList.css';


const ExpenseList = () => {
  const [expenses, setExpenses] = useState([
    {
      _id: '1',
      title: 'Courses alimentaires',
      amount: 85.50,
      category: { _id: '1', name: 'Alimentation', color: '#e74c3c' },
      date: '2024-01-15',
      description: 'Supermarché',
      type: 'ponctuelle',
      receipt: 'recu_courses_2024.pdf',
      createdAt: new Date('2024-01-15').toISOString(),
      startDate: null,
      endDate: null
    },
    {
      _id: '2',
      title: 'Essence voiture',
      amount: 65.00,
      category: { _id: '2', name: 'Transport', color: '#3498db' },
      date: '2024-01-14',
      description: 'Station service',
      type: 'ponctuelle',
      receipt: null,
      createdAt: new Date('2024-01-14').toISOString(),
      startDate: null,
      endDate: null
    }
  ]);
  
  const [categories] = useState([
    { _id: '1', name: 'Alimentation', color: '#e74c3c' },
    { _id: '2', name: 'Transport', color: '#3498db' },
    { _id: '3', name: 'Loisirs', color: '#9b59b6' },
    { _id: '4', name: 'Logement', color: '#f39c12' },
    { _id: '5', name: 'Santé', color: '#2ecc71' }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    category: 'all'
  });


  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);


  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'ponctuelle',
    receipt: null,
    startDate: '',
    endDate: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      type: 'ponctuelle',
      receipt: null,
      startDate: '',
      endDate: ''
    });
  };



  const handleDeleteExpense = () => {
    setExpenses(expenses.filter(expense => expense._id !== expenseToDelete._id));
    setShowDeleteModal(false);
    setExpenseToDelete(null);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExpense = {
      _id: Date.now().toString(),
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: categories.find(cat => cat._id === formData.category) || { name: 'Autre', color: '#6c757d' },
      date: formData.date,
      description: formData.description,
      type: formData.type,
      receipt: formData.receipt,
      createdAt: new Date().toISOString(),
      startDate: formData.type === 'recurrente' ? formData.startDate : null,
      endDate: formData.type === 'recurrente' ? formData.endDate : null
    };
    setExpenses([newExpense, ...expenses]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditExpense = (e) => {
    e.preventDefault();
    const updatedExpenses = expenses.map(expense =>
      expense._id === currentExpense._id ? currentExpense : expense
    );
    setExpenses(updatedExpenses);
    setShowEditModal(false);
    setCurrentExpense(null);
    resetForm();
  };

  const openEditModal = (expense) => {
   
    const expenseCopy = {
      ...expense,
      date: expense.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0]
    };
    setCurrentExpense(expenseCopy);
    setShowEditModal(true);
  };

  const openViewModal = (expense) => {
    setCurrentExpense(expense);
    setShowViewModal(true);
  };


  const handleDownloadReceipt = (receiptName) => {
 
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Reçu de dépense) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000348 00000 n 
0000000441 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
538
%%EOF`;
    
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = receiptName || 'recu.pdf';
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = ['Titre', 'Montant', 'Date', 'Catégorie', 'Type', 'Description', 'Date de création'];
    const csvData = [
      headers,
      ...filteredExpenses.map(expense => [
        expense.title,
        expense.amount,
        formatDate(expense.date),
        expense.category.name,
        getTypeLabel(expense.type),
        expense.description || '',
        formatDate(expense.createdAt)
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `depenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'category' ? value : parseInt(value)
    }));
  };


  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = searchTerm === '' || 
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filters.category === 'all' || expense.category._id === filters.category;
    
    return matchesSearch && matchesCategory;
  });

  const getTypeLabel = (type) => {
    return type === 'ponctuelle' ? 'Ponctuelle' : 'Récurrente';
  };

  const getTypeBadgeVariant = (type) => {
    return type === 'ponctuelle' ? 'primary' : 'warning';
  };

  if (loading) {
    return (
      <div className="expense-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list-container">
      <div className="expense-header">
        <div className="header-content">
          <h2>
            <i className="fas fa-money-bill-wave"></i>
            Mes Dépenses
          </h2>
          <p>Gérez vos dépenses et contrôlez vos sorties d'argent</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <i className="fas fa-plus"></i>
          Nouvelle Dépense
        </button>
      </div>

      <div className="content-wrapper">
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
              placeholder="Rechercher par titre, description ou catégorie..."
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
          <div className="filter-group">
            <label>Catégorie</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}


      {/* Expenses Table */}
      <div className="expenses-card">
        {filteredExpenses.length > 0 ? (
          <div className="expenses-table">
            <div className="table-header">
              <div><i className="fas fa-file-text"></i> Description</div>
              <div><i className="fas fa-euro-sign"></i> Montant</div>
              <div><i className="fas fa-calendar"></i> Date</div>
              <div><i className="fas fa-tag"></i> Catégorie</div>
              <div></div>
            </div>
            <div className="table-body">
              {filteredExpenses.map(expense => (
                <div key={expense._id} className="table-row">
                  <div className="table-cell">
                    <div className="expense-info">
                      <strong>{expense.title}</strong>
                      {expense.description && (
                        <small className="expense-description">{expense.description}</small>
                      )}
                      <div className="action-buttons">
                        <button
                          className="btn-view"
                          onClick={() => openViewModal(expense)}
                          title="Voir"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => openEditModal(expense)}
                          title="Modifier"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => {
                            setExpenseToDelete(expense);
                            setShowDeleteModal(true);
                          }}
                          title="Supprimer"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="table-cell amount-cell">
                    <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                  </div>
                  <div className="table-cell date-cell">
                    <span>{formatDate(expense.date)}</span>
                  </div>
                  <div className="table-cell category-cell">
                    <span 
                      className="category-badge" 
                      style={{backgroundColor: expense.category.color}}
                    >
                      {expense.category.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-money-bill-wave"></i>
            <h5>Aucune dépense trouvée</h5>
            <p>Une dépense contient : Montant, Date, Catégorie, Description (optionnelle), Type (ponctuelle/récurrente), Reçu (optionnel)</p>
            <p>Les dépenses ponctuelles ont une date unique, les récurrentes ont une période avec dates de début/fin</p>
            <p>La date de création est automatiquement générée lors de l'ajout</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              <i className="fas fa-plus"></i>
              Nouvelle Dépense
            </button>
          </div>
        )}
      </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Ajouter une dépense</h3>
              <button onClick={() => setShowAddModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleAddExpense}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="form-control"
                    placeholder="Ex: Courses alimentaires, Essence..."
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
                  <label>Catégorie *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="form-control"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Type de dépense</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="type"
                        value="ponctuelle"
                        checked={formData.type === 'ponctuelle'}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                      />
                      <span>Ponctuelle</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="type"
                        value="recurrente"
                        checked={formData.type === 'recurrente'}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                      />
                      <span>Récurrente</span>
                    </label>
                  </div>
                </div>
                
                {formData.type === 'ponctuelle' ? (
                  <div className="form-group">
                    <label><i className="fas fa-calendar"></i> Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="form-control"
                      required
                    />
                  </div>
                ) : (
                  <div className="form-row">
                    <div className="form-group">
                      <label><i className="fas fa-calendar"></i> Date de début *</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label><i className="fas fa-calendar"></i> Date de fin (optionnelle)</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        className="form-control"
                      />
                      <small className="form-text">Laissez vide pour une dépense illimitée</small>
                    </div>
                  </div>
                )}
                
                <div className="form-group">
                  <label>Reçu (optionnel)</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      id="receipt-upload-add"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert('Le fichier ne peut pas dépasser 5 MB');
                            e.target.value = '';
                            return;
                          }
                          setFormData({...formData, receipt: file.name});
                        }
                      }}
                      className="file-input"
                    />
                    <label htmlFor="receipt-upload-add" className="file-upload-label">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>Téléverser un reçu</span>
                      <small>JPG, PNG, PDF - Max 5MB</small>
                    </label>
                    {formData.receipt && (
                      <div className="file-preview">
                        <i className="fas fa-file"></i>
                        <span>{formData.receipt}</span>
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, receipt: null})}
                          className="remove-file"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Description (optionnelle)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="form-control"
                    rows="3"
                    placeholder="Détails supplémentaires sur cette dépense..."
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
      {showEditModal && currentExpense && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Modifier la dépense</h3>
              <button onClick={() => setShowEditModal(false)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={handleEditExpense}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre *</label>
                  <input
                    type="text"
                    value={currentExpense?.title || ''}
                    onChange={(e) => setCurrentExpense({...currentExpense, title: e.target.value})}
                    className="form-control"
                    placeholder="Ex: Courses alimentaires, Essence..."
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Montant * (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentExpense?.amount || ''}
                    onChange={(e) => setCurrentExpense({...currentExpense, amount: e.target.value})}
                    className="form-control"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Catégorie *</label>
                  <select
                    value={currentExpense?.category?._id || ''}
                    onChange={(e) => setCurrentExpense({...currentExpense, category: categories.find(cat => cat._id === e.target.value)})}
                    className="form-control"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Type de dépense</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="type-edit"
                        value="ponctuelle"
                        checked={currentExpense?.type === 'ponctuelle'}
                        onChange={(e) => setCurrentExpense({...currentExpense, type: e.target.value})}
                      />
                      Ponctuelle
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="type-edit"
                        value="recurrente"
                        checked={currentExpense?.type === 'recurrente'}
                        onChange={(e) => setCurrentExpense({...currentExpense, type: e.target.value})}
                      />
                      Récurrente
                    </label>
                  </div>
                </div>
                
                {currentExpense?.type === 'ponctuelle' ? (
                  <div className="form-group">
                    <label><i className="fas fa-calendar"></i> Date *</label>
                    <input
                      type="date"
                      value={currentExpense?.date ? currentExpense.date.split('T')[0] : ''}
                      onChange={(e) => setCurrentExpense({...currentExpense, date: e.target.value})}
                      className="form-control"
                      required
                    />
                  </div>
                ) : (
                  <div className="form-row">
                    <div className="form-group">
                      <label><i className="fas fa-calendar"></i> Date de début *</label>
                      <input
                        type="date"
                        value={currentExpense?.startDate || ''}
                        onChange={(e) => setCurrentExpense({...currentExpense, startDate: e.target.value})}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label><i className="fas fa-calendar"></i> Date de fin</label>
                      <input
                        type="date"
                        value={currentExpense?.endDate || ''}
                        onChange={(e) => setCurrentExpense({...currentExpense, endDate: e.target.value})}
                        className="form-control"
                      />
                      <div className="form-text">Laissez vide pour une récurrence illimitée</div>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Reçu (optionnel)</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      id="receipt-upload"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert('Le fichier ne peut pas dépasser 5 MB');
                            e.target.value = '';
                            return;
                          }
                          setCurrentExpense({...currentExpense, receipt: file.name});
                        }
                      }}
                      className="file-input"
                    />
                    <label htmlFor="receipt-upload" className="file-upload-label">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>Téléverser un reçu</span>
                      <small>JPG, PNG, PDF - Max 5MB</small>
                    </label>
                    {currentExpense?.receipt && (
                      <div className="file-preview">
                        <i className="fas fa-file"></i>
                        <span>{currentExpense.receipt}</span>
                        <button 
                          type="button" 
                          onClick={() => setCurrentExpense({...currentExpense, receipt: null})}
                          className="remove-file"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description (optionnelle)</label>
                  <textarea
                    value={currentExpense?.description || ''}
                    onChange={(e) => setCurrentExpense({...currentExpense, description: e.target.value})}
                    className="form-control"
                    rows="3"
                    placeholder="Ajoutez des détails sur cette dépense..."
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
      {showViewModal && currentExpense && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Détails de la dépense</h3>
              <button onClick={() => setShowViewModal(false)} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="expense-details">
                <div className="detail-row">
                  <strong>Titre :</strong>
                  <span>{currentExpense.title}</span>
                </div>
                <div className="detail-row">
                  <strong>Montant :</strong>
                  <span className="amount-highlight">{formatCurrency(currentExpense.amount)}</span>
                </div>
                <div className="detail-row">
                  <strong>Catégorie :</strong>
                  <span 
                    className="category-badge" 
                    style={{backgroundColor: currentExpense.category.color}}
                  >
                    {currentExpense.category.name}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Type :</strong>
                  <span className={`type-badge ${getTypeBadgeVariant(currentExpense.type)}`}>
                    {getTypeLabel(currentExpense.type)}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Date :</strong>
                  <span>{formatDate(currentExpense.date)}</span>
                </div>
                {currentExpense.type === 'récurrente' && (
                  <>
                    {currentExpense.startDate && (
                      <div className="detail-row">
                        <strong>Date de début :</strong>
                        <span>{formatDate(currentExpense.startDate)}</span>
                      </div>
                    )}
                    {currentExpense.endDate && (
                      <div className="detail-row">
                        <strong>Date de fin :</strong>
                        <span>{formatDate(currentExpense.endDate)}</span>
                      </div>
                    )}
                  </>
                )}
                {currentExpense.description && (
                  <div className="detail-row">
                    <strong>Description :</strong>
                    <span>{currentExpense.description}</span>
                  </div>
                )}
                <div className="detail-row">
                  <strong>Reçu :</strong>
                  {currentExpense.receipt ? (
                    <div className="receipt-preview">
                      <i className="fas fa-file-pdf"></i>
                      <span>{currentExpense.receipt}</span>
                      <button 
                        className="btn-download" 
                        title="Télécharger le reçu"
                        onClick={() => handleDownloadReceipt(currentExpense.receipt)}
                      >
                        <i className="fas fa-download"></i>
                        Télécharger
                      </button>
                    </div>
                  ) : (
                    <span className="no-receipt-text">Aucun reçu</span>
                  )}
                </div>
                <div className="detail-row">
                  <strong>Date de création :</strong>
                  <span>{formatDate(currentExpense.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-success" 
                onClick={exportToCSV}
                title="Télécharger les données en CSV"
              >
                <i className="fas fa-download"></i>
                Télécharger CSV
              </button>
              <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button onClick={() => setShowDeleteModal(false)} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer cette dépense ?</p>
              {expenseToDelete && (
                <div className="expense-preview">
                  <strong>{expenseToDelete.title}</strong><br />
                  <span className="text-muted">{expenseToDelete.category?.name}</span><br />
                  <span className="amount-danger">{formatCurrency(expenseToDelete.amount)}</span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </button>
              <button className="btn btn-danger" onClick={handleDeleteExpense}>
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
export default ExpenseList;
