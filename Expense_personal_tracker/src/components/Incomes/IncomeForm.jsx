/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const IncomeForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchIncome();
    }
  }, [id, isEdit]);

  const fetchIncome = async () => {
    try {
      const response = await axios.get(`/incomes/${id}`);
      const income = response.data;
      
      setFormData({
        amount: income.amount.toString(),
        source: income.source,
        description: income.description || '',
        date: new Date(income.date).toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Erreur lors du chargement du revenu:', error);
      setError('Erreur lors du chargement du revenu');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let response;
      if (isEdit) {
        response = await axios.put(`/incomes/${id}`, formData);
      } else {
        response = await axios.post('/incomes', formData);
      }

      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/incomes');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{isEdit ? 'Modifier le Revenu' : 'Nouveau Revenu'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form className="income-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Source *</label>
          <input type="text" name="source" value={formData.source} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Montant *</label>
          <input type="number" step="0.01" min="0.01" name="amount" value={formData.amount} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Date *</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea rows={3} name="description" value={formData.description} onChange={handleChange} />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Sauvegarde...
            </>
          ) : (
            <>
              {isEdit ? 'Modifier' : 'Créer'}
            </>
          )}
        </button>
        <button type="button" className="submit-btn" onClick={() => navigate('/incomes')}>
          Retour
        </button>
      </form>
    </div>
  );
};

export default IncomeForm;
