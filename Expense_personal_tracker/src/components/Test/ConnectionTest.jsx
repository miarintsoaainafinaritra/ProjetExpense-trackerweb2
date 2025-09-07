import React, { useState, useEffect } from 'react';
import { healthAPI } from '../../services/api';

const ConnectionTest = () => {
  const [backendStatus, setBackendStatus] = useState('testing');
  const [backendMessage, setBackendMessage] = useState('');
  const [testResults, setTestResults] = useState({
    backend: false,
    database: false,
    auth: false
  });

  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      setBackendStatus('testing');
      const response = await healthAPI.check();
      
      if (response.status === 'OK') {
        setBackendStatus('connected');
        setBackendMessage(response.message);
        setTestResults(prev => ({ ...prev, backend: true }));
      }
    } catch (error) {
      setBackendStatus('error');
      setBackendMessage(`Erreur: ${error.message}`);
      setTestResults(prev => ({ ...prev, backend: false }));
    }
  };

  const testAuth = async () => {
    try {
      // Test avec des données fictives pour vérifier la route
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@test.com', password: 'wrongpassword' }),
      });
      
      // Si on reçoit une réponse (même une erreur), cela signifie que la route fonctionne
      if (response.status === 401 || response.status === 500) {
        setTestResults(prev => ({ ...prev, auth: true }));
        return true;
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, auth: false }));
      return false;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#28a745';
      case 'error': return '#dc3545';
      case 'testing': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return '✅';
      case 'error': return '❌';
      case 'testing': return '🔄';
      default: return '⏳';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      zIndex: 1000,
      minWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>
        🔗 Test de Connexion
      </h3>
      
      <div style={{ marginBottom: '15px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          marginBottom: '8px'
        }}>
          <span>{getStatusIcon(backendStatus)}</span>
          <strong>Backend (Port 5000)</strong>
          <span style={{ color: getStatusColor(backendStatus) }}>
            {backendStatus}
          </span>
        </div>
        <div style={{ fontSize: '0.9em', color: '#666', marginLeft: '25px' }}>
          {backendMessage || 'Test en cours...'}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          marginBottom: '8px'
        }}>
          <span>{testResults.auth ? '✅' : '❌'}</span>
          <strong>Routes Auth</strong>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={testBackendConnection}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Retester Backend
        </button>
        <button 
          onClick={testAuth}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Tester Auth
        </button>
      </div>

      <div style={{ 
        fontSize: '0.8em', 
        color: '#666',
        borderTop: '1px solid #eee',
        paddingTop: '10px'
      }}>
        <div>Frontend: http://localhost:5175</div>
        <div>Backend: http://localhost:5000</div>
      </div>
    </div>
  );
};

export default ConnectionTest;
