/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulation simple sans API - accepte n'importe quel email/mot de passe
    if (email && password && email.includes('@') && password.length >= 3) {
      const userData = {
        id: 1,
        email: email,
        firstName: email.split('@')[0].split('.')[0] || 'User',
        lastName: email.split('@')[0].split('.')[1] || 'Demo'
      };
      
      localStorage.setItem('userToken', `token_${Date.now()}`);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } else {
      return { success: false, message: 'Veuillez saisir un email valide et un mot de passe d\'au moins 3 caractères' };
    }
  };

  const signup = async (userData) => {
    // Simulation simple sans API
    const { email, firstName, lastName } = userData;
    
    if (email === 'demo@example.com') {
      return { success: false, message: 'Cet email est déjà utilisé' };
    }
    
    const newUser = {
      id: Date.now(),
      email,
      firstName,
      lastName
    };
    
    localStorage.setItem('userToken', `token_${newUser.id}`);
    localStorage.setItem('userData', JSON.stringify(newUser));
    
    setUser(newUser);
    setIsAuthenticated(true);
    
    return { success: true, user: newUser };
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
