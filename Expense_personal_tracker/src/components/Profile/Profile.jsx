import React, { useState } from "react";
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [preferencesData, setPreferencesData] = useState({
    currency: 'EUR',
    language: 'fr',
    darkMode: false,
    budgetAlerts: true
  });

  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    preferences: false
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePreferencesChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferencesData({
      ...preferencesData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(prev => ({ ...prev, profile: true }));

    setTimeout(() => {
      setSuccess('Profil mis à jour avec succès');
      setLoading(prev => ({ ...prev, profile: false }));
    }, 1000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(prev => ({ ...prev, password: true }));

    setTimeout(() => {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccess('Mot de passe modifié avec succès');
      setLoading(prev => ({ ...prev, password: false }));
    }, 1000);
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(prev => ({ ...prev, preferences: true }));

    setTimeout(() => {
      setSuccess('Préférences mises à jour avec succès');
      setLoading(prev => ({ ...prev, preferences: false }));
    }, 1000);
  };

  return (
    <div className="profile-container">
      <div className="profile-row">
        <div className="profile-col">
          <div className="profile-card">
            <div className="profile-header">
              <h4>
                <i className="fas fa-user-cog"></i>
                Mon Profil
              </h4>
            </div>
            <div className="profile-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="profile-tabs">
                <div className="tab-content">
                  <form onSubmit={handleProfileSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <i className="fas fa-user"></i>
                          Prénom
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          required
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          <i className="fas fa-user"></i>
                          Nom
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        <i className="fas fa-envelope"></i>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        required
                        className="form-control"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading.profile}
                      className="btn btn-primary"
                    >
                      {loading.profile ? (
                        <>
                          <div className="spinner"></div>
                          Mise à jour...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i>
                          Mettre à jour
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="tab-content">
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                      <label>
                        <i className="fas fa-lock"></i>
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="form-control"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <i className="fas fa-key"></i>
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength={6}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          <i className="fas fa-key"></i>
                          Confirmer le nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength={6}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading.password}
                      className="btn btn-warning"
                    >
                      {loading.password ? (
                        <>
                          <div className="spinner"></div>
                          Modification...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-key"></i>
                          Changer le mot de passe
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="tab-content">
                  <form onSubmit={handlePreferencesSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <i className="fas fa-money-bill"></i>
                          Devise
                        </label>
                        <select
                          name="currency"
                          value={preferencesData.currency}
                          onChange={handlePreferencesChange}
                          className="form-control"
                        >
                          <option value="EUR">Euro (€)</option>
                          <option value="USD">Dollar US ($)</option>
                          <option value="GBP">Livre Sterling (£)</option>
                          <option value="CAD">Dollar Canadien (CAD)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>
                          <i className="fas fa-language"></i>
                          Langue
                        </label>
                        <select
                          name="language"
                          value={preferencesData.language}
                          onChange={handlePreferencesChange}
                          className="form-control"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="checkbox-group">
                        <input
                          type="checkbox"
                          name="budgetAlerts"
                          checked={preferencesData.budgetAlerts}
                          onChange={handlePreferencesChange}
                          id="budgetAlerts"
                        />
                        <label htmlFor="budgetAlerts">
                          <i className="fas fa-bell"></i>
                          Alertes de budget
                        </label>
                      </div>
                      <small className="form-text">
                        Recevoir des alertes lorsque les dépenses dépassent les revenus
                      </small>
                    </div>

                    <button
                      type="submit"
                      disabled={loading.preferences}
                      className="btn btn-success"
                    >
                      {loading.preferences ? (
                        <>
                          <div className="spinner"></div>
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i>
                          Sauvegarder les préférences
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
