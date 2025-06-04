import { useEffect } from 'react';
import { signInWithRedirect } from 'aws-amplify/auth';
import '../App.css';

const Login = () => {
  // Función para manejar el inicio de sesión con Cognito
  const handleSignIn = async () => {
    try {
      // Configurar opciones para la redirección
      const options = {
        provider: 'COGNITO'
      };
      
      // Redirigir al usuario a la página de inicio de sesión de Cognito
      await signInWithRedirect(options);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  // Efecto para verificar si el usuario ya está autenticado
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Importar de forma dinámica para evitar problemas de inicialización
        const { fetchAuthSession } = await import('aws-amplify/auth');
        // Verificar si hay una sesión activa
        const session = await fetchAuthSession();
        if (session.tokens) {
          // Si hay sesión, redirigir al dashboard
          window.location.href = '/dashboard';
        }
      } catch (error) {
        // Si no hay sesión, no hacer nada (mantener en la página de login)
        console.log('Usuario no autenticado');
      }
    };
    
    checkUser();
  }, []);

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="neon-title">
          <h1>Bienvenido</h1>
          <div className="neon-subtitle">Academia de Sistemas</div>
        </div>
        
        <div className="login-card">
          <p>Accede a tu cuenta para gestionar el sistema</p>
          <button className="login-button" onClick={handleSignIn}>
            Iniciar Sesión
          </button>
        </div>
        
        <div className="login-footer">
          <p>© {new Date().getFullYear()} Academia de Sistemas</p>
        </div>
      </div>
    </div>
  );
};

export default Login;