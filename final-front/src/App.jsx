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
        // Verificar si hay tokens válidos en la sesión
        if (session && session.tokens) {
          setIsAuthenticated(true);
          console.log("Usuario autenticado correctamente");
        }
      } catch (error) {
        console.log("Error de autenticación:", error);
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  // Verificar la URL para detectar el código de autenticación
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      console.log("Código de autenticación detectado, redirigiendo...");
      // Limpiar la URL y redirigir al dashboard
      window.history.replaceState({}, document.title, "/dashboard");
      setIsAuthenticated(true);
    }
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        {/* Ruta comodín para manejar todas las demás rutas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;