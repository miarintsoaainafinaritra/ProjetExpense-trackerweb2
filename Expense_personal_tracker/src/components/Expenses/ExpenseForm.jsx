/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    type: 'ponctuelle',
    date: '',
    startDate: '',
    endDate: ''
  });
  const [categories, setCategories] = useState([]);
  const [receiptFile, setReceiptFile] = useState(null);
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchExpense();
    }
  }, [id, isEdit]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const fetchExpense = async () => {
    try {
      const response = await axios.get(`/expenses/${id}`);
      const expense = response.data;
      
      setFormData({
        amount: expense.amount.toString(),
        description: expense.description || '',
        category: expense.category._id,
        type: expense.type,
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
        startDate: expense.startDate ? new Date(expense.startDate).toISOString().split('T')[0] : '',
        endDate: expense.endDate ? new Date(expense.endDate).toISOString().split('T')[0] : ''
      });
      
      if (expense.receipt) {
        setCurrentReceipt(expense.receipt);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la dépense:', error);
      setError('Erreur lors du chargement de la dépense');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'type') {
      if (value === 'ponctuelle') {
        setFormData(prev => ({
          ...prev,
          startDate: '',
          endDate: ''
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          date: ''
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Type de fichier non autorisé. Seuls JPG, PNG et PDF sont acceptés.');
        return;
      }
      
 
      if (file.size > 5 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. Taille maximale: 5MB.');
        return;
      }
      
      setReceiptFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
 
      if (formData.type === 'ponctuelle' && !formData.date) {
        setError('La date est obligatoire pour une dépense ponctuelle');
        setLoading(false);
        return;
      }

      if (formData.type === 'recurrente' && !formData.startDate) {
        setError('La date de début est obligatoire pour une dépense récurrente');
        setLoading(false);
        return;
      }

      if (formData.type === 'recurrente' && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
        setError('La date de fin doit être postérieure à la date de début');
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      submitData.append('amount', formData.amount);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('type', formData.type);
      
      if (formData.type === 'ponctuelle') {
        submitData.append('date', formData.date);
      } else {
        submitData.append('startDate', formData.startDate);
        if (formData.endDate) {
          submitData.append('endDate', formData.endDate);
        }
      }

      if (receiptFile) {
        submitData.append('receipt', receiptFile);
      }

      let response;
      if (isEdit) {
        response = await axios.put(`/expenses/${id}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post('/expenses', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/expenses');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const removeCurrentReceipt = async () => {
    try {
      await axios.delete(`/receipts/${id}`);
      setCurrentReceipt(null);
      setSuccess('Reçu supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du reçu:', error);
      setError('Erreur lors de la suppression du reçu');
    }
  };

  return (
    <div className="form-container">
      <h2>{isEdit ? 'Modifier la Dépense' : 'Nouvelle Dépense'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <i className="fas fa-euro-sign me-2"></i>
            Montant *
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="0.00"
          />
        </div>
        <div className="form-group">
          <label>
            <i className="fas fa-tags me-2"></i>
            Catégorie *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
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
          <label>
            <i className="fas fa-align-left me-2"></i>
            Description
          </label>
          <textarea
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description de la dépense (optionnel)"
          />
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-clock me-2"></i>
            Type de dépense *
          </label>
          <div>
            <input
              type="radio"
              name="type"
              value="ponctuelle"
              checked={formData.type === 'ponctuelle'}
              onChange={handleChange}
            />
            <label>Ponctuelle</label>
            <input
              type="radio"
              name="type"
              value="recurrente"
              checked={formData.type === 'recurrente'}
              onChange={handleChange}
            />
            <label>Récurrente</label>
          </div>
        </div>

        {formData.type === 'ponctuelle' && (
          <div className="form-group">
            <label>
              <i className="fas fa-calendar me-2"></i>
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {formData.type === 'recurrente' && (
          <div className="form-group">
            <label>
              <i className="fas fa-calendar-plus me-2"></i>
              Date de début *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <label>
              <i className="fas fa-calendar-minus me-2"></i>
              Date de fin (optionnel)
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate}
            />
          </div>
        )}

        <div className="form-group">
          <label>
            <i className="fas fa-file-upload me-2"></i>
            Reçu (optionnel)
          </label>
          
          {currentReceipt && (
            <div className="mb-2 p-2 bg-light rounded">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <i className="fas fa-file-alt me-2"></i>
                  <span>{currentReceipt.originalName}</span>
                  <small className="text-muted ms-2">
                    ({(currentReceipt.size / 1024).toFixed(1)} KB)
                  </small>
                </div>
                <div>
                  <a 
                    href={`${axios.defaults.baseURL}/receipts/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    <i className="fas fa-eye"></i>
                  </a>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={removeCurrentReceipt}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
          />
          <small className="text-muted">
            Formats acceptés: JPG, PNG, PDF. Taille maximale: 5MB.
          </small>
        </div>

        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/expenses')}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Retour
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Sauvegarde...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                {isEdit ? 'Modifier' : 'Créer'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
