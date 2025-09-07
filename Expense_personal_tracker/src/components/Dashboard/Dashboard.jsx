import React, { useState, useMemo } from 'react';
import PieChart from '../Charts/PieChart';
import BarChart from '../Charts/BarChart';
import LineChart from '../Charts/LineChart';
import '../Charts/Charts.css';

const fullDashboardData = {
  transactions: [
    { id: '1', title: 'Salaire', amount: 2800.00, type: 'income', category: 'Salaire', source: 'Emploi principal', date: '2025-01-15', createdAt: '2025-01-15T08:00:00Z' },
    { id: '2', title: 'Courses alimentaires', amount: -320.50, type: 'expense', category: 'Alimentation', date: '2025-01-10' },
    { id: '3', title: 'Loyer', amount: -650.00, type: 'expense', category: 'Logement', date: '2025-01-01' },
    { id: '4', title: 'Transport', amount: -85.00, type: 'expense', category: 'Transport', date: '2025-01-05' },
    { id: '5', title: 'Loisirs', amount: -120.00, type: 'expense', category: 'Loisirs', date: '2025-01-20' },
    
    { id: '6', title: 'Salaire', amount: 2800.00, type: 'income', category: 'Salaire', source: 'Emploi principal', date: '2025-02-15', createdAt: '2025-02-15T08:00:00Z' },
    { id: '7', title: 'Freelance', amount: 400.00, type: 'income', category: 'Freelance', source: 'Travail indépendant', date: '2025-02-28', createdAt: '2025-02-28T18:30:00Z' },
    { id: '8', title: 'Courses alimentaires', amount: -285.30, type: 'expense', category: 'Alimentation', date: '2025-02-12' },
    { id: '9', title: 'Loyer', amount: -650.00, type: 'expense', category: 'Logement', date: '2025-02-01' },
    { id: '10', title: 'Essence', amount: -95.00, type: 'expense', category: 'Transport', date: '2025-02-08' },
    
    { id: '11', title: 'Salaire', amount: 2800.00, type: 'income', category: 'Salaire', source: 'Emploi principal', date: '2025-03-15', createdAt: '2025-03-15T08:00:00Z' },
    { id: '12', title: 'Freelance', amount: 650.00, type: 'income', category: 'Freelance', source: 'Travail indépendant', date: '2025-03-20', createdAt: '2025-03-20T16:45:00Z' },
    { id: '13', title: 'Courses alimentaires', amount: -485.50, type: 'expense', category: 'Alimentation', date: '2025-03-10' },
    { id: '14', title: 'Loyer', amount: -650.00, type: 'expense', category: 'Logement', date: '2025-03-01' },
    { id: '15', title: 'Transport', amount: -365.00, type: 'expense', category: 'Transport', date: '2025-03-05' },
    { id: '16', title: 'Loisirs', amount: -224.00, type: 'expense', category: 'Loisirs', date: '2025-03-18' },
    { id: '17', title: 'Santé', amount: -149.00, type: 'expense', category: 'Santé', date: '2025-03-22' },
    { id: '18', title: 'Restaurant', amount: -35.00, type: 'expense', category: 'Alimentation', date: '2025-03-25' },
  ],
  categories: [
    { name: 'Alimentation', color: '#e74c3c' },
    { name: 'Transport', color: '#3498db' },
    { name: 'Loisirs', color: '#9b59b6' },
    { name: 'Logement', color: '#f39c12' },
    { name: 'Santé', color: '#2ecc71' },
    { name: 'Salaire', color: '#27ae60' },
    { name: 'Freelance', color: '#16a085' }
  ]
};

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('2025-03');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const filteredData = useMemo(() => {
    const monthTransactions = fullDashboardData.transactions.filter(transaction => {
      const transactionMonth = transaction.date.substring(0, 7);
      const matchesMonth = transactionMonth === selectedMonth;
      const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
      const matchesType = selectedType === 'all' || transaction.type === selectedType;
      
      return matchesMonth && matchesCategory && matchesType;
    });

    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = Math.abs(monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0));

    const balance = totalIncome - totalExpenses;

    const expensesByCategory = {};
    monthTransactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = transaction.category;
        if (!expensesByCategory[category]) {
          expensesByCategory[category] = 0;
        }
        expensesByCategory[category] += Math.abs(transaction.amount);
      });

    const categoryData = Object.entries(expensesByCategory).map(([name, value]) => {
      const categoryInfo = fullDashboardData.categories.find(cat => cat.name === name);
      return {
        name,
        value,
        color: categoryInfo?.color || '#95a5a6'
      };
    });

    const recentTransactions = monthTransactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    return {
      summary: { totalIncome, totalExpenses, balance },
      categoryData,
      recentTransactions
    };
  }, [selectedMonth, selectedCategory, selectedType]);

  const monthlyTrendData = useMemo(() => {
    const months = ['2024-10', '2024-11', '2024-12', '2025-01', '2025-02', '2025-03'];
    const labels = months.map(month => {
      const date = new Date(month + '-01');
      return date.toLocaleDateString('fr-FR', { month: 'short' });
    });

    const income = months.map(month => {
      return fullDashboardData.transactions
        .filter(t => t.date.substring(0, 7) === month && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    });

    const expenses = months.map(month => {
      return Math.abs(fullDashboardData.transactions
        .filter(t => t.date.substring(0, 7) === month && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0));
    });

    return { labels, income, expenses };
  }, []);

  const getMonthName = (monthString) => {
    const date = new Date(monthString + '-01');
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h2>
            <i className="fas fa-chart-pie"></i>
            Tableau de Bord
          </h2>
          <p>Vue d'ensemble de vos finances et analyse des tendances</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-card">
        <div className="filters-header">
          <h5>
            <i className="fas fa-filter"></i>
            Filtres et Période
          </h5>
        </div>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label>Mois</label>
            <select 
              className="form-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="2025-01">Janvier 2025</option>
              <option value="2025-02">Février 2025</option>
              <option value="2025-03">Mars 2025</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Catégorie</label>
            <select 
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Toutes les catégories</option>
              {fullDashboardData.categories.filter(cat => 
                cat.name !== 'Salaire' && cat.name !== 'Freelance'
              ).map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Type</label>
            <select 
              className="form-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="income">Revenus</option>
              <option value="expense">Dépenses</option>
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card expense">
          <div className="stat-content">
            <h3>{formatCurrency(filteredData.summary.totalExpenses)}</h3>
            <p className="stat-label">Total Dépenses</p>
          </div>
        </div>

        <div className="stat-card count">
          <div className="stat-content">
            <h3>{filteredData.recentTransactions.filter(t => t.type === 'expense').length}</h3>
            <p className="stat-label">Nombre de Dépenses</p>
          </div>
        </div>

        <div className="stat-card average">
          <div className="stat-content">
            <h3>{formatCurrency(filteredData.recentTransactions.filter(t => t.type === 'expense').length > 0 ? 
              filteredData.summary.totalExpenses / filteredData.recentTransactions.filter(t => t.type === 'expense').length : 0)}</h3>
            <p className="stat-label">Moyenne par Dépense</p>
          </div>
        </div>
      </div>


      <div className="dashboard-content">
        <div className="charts-grid">
          <PieChart 
            data={filteredData.categoryData} 
            title="Répartition par catégorie" 
          />
          <BarChart 
            data={filteredData.categoryData} 
            title="Dépenses par catégorie" 
          />
        </div>
        
        <div className="chart-full-width">
          <h3>Évolution mensuelle des revenus et dépenses (6 derniers mois)</h3>
          <LineChart 
            data={monthlyTrendData} 
          />
        </div>

        <div className="transactions-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-history"></i>
              Transactions Récentes - {getMonthName(selectedMonth)}
            </h3>
          </div>
          <div className="recent-transactions">
            {filteredData.recentTransactions.length > 0 ? (
              filteredData.recentTransactions.map(transaction => (
                <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-info">
                    <div className="transaction-title">{transaction.title}</div>
                    <div className="transaction-details">
                      <span className="transaction-category">{transaction.category}</span>
                      <span className="transaction-date">
                        {new Date(transaction.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="transaction-amount">
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <i className="fas fa-chart-line"></i>
                <h5>Aucune transaction trouvée</h5>
                <p>Aucune transaction ne correspond aux filtres sélectionnés pour cette période.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
