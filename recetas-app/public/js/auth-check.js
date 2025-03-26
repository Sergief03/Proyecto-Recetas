// Verificar autenticación
const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Redirigir a la página de autenticación si no está autenticado
        window.location.href = 'auth.html';
        return false;
    }
    return true;
};

// Ejecutar verificación al cargar
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
}); 