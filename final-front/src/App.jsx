import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';
import Cursor from './components/Cursor';

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession();
        setIsAuthenticated(!!session.tokens);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  if (!authChecked) {
    return (
      <div className="loading-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <Router>
      <Cursor />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;