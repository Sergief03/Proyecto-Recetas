// Función para obtener el token de autenticación
const getAuthToken = () => localStorage.getItem('authToken');

// Función para redirigir si no está autenticado
const redirectToAuthIfNotAuthenticated = () => {
  if (!getAuthToken()) {
    window.location.href = 'auth.html';
  }
};

// Exportar funciones
export { getAuthToken, redirectToAuthIfNotAuthenticated }; 