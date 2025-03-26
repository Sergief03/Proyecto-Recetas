// Navegación SPA (Single Page Application)
document.addEventListener('DOMContentLoaded', () => {
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
    
    // Verificar autenticación al cargar la página
    if (!checkAuth()) return;
    
    // Mostrar nombre de usuario en la interfaz
    const userName = localStorage.getItem('userName') || 'Usuario';
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
    
    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        window.location.href = 'auth.html';
    };
    
    // Asignar evento al botón de cerrar sesión
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Elementos de navegación
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section');
    
    // Secciones
    const homeSection = document.getElementById('home-section');
    const recetasSection = document.getElementById('recetas-section');
    const foroSection = document.getElementById('foro-section');
    const busquedaSection = document.getElementById('busqueda-section');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    
    window.loadRecetas = () => {
        // Verificar autenticación
        const token = localStorage.getItem('token');
        if (!token) return;
        
        // Mensaje de carga
        if (postsForo) {
            postsForo.innerHTML = '<div class="text-center"><p>Cargando publicaciones...</p></div>';
        }

        // Cerrar el bloque if para postsForo
    };
    
    const showSection = (sectionId) => {
        sections.forEach(section => {
            section.style.display = 'none';
        });

        const activeSection = document.getElementById(`${sectionId}-section`);
        if (activeSection) {
            activeSection.style.display = 'block';
        }
        
        // Actualizar navegación activa
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // Event listeners para navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
    
    // Botón "Comenzar"
    const btnGetStarted = document.getElementById('btn-get-started');
    if (btnGetStarted) {
        btnGetStarted.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Si el usuario está autenticado, ir a recetas
            if (localStorage.getItem('token')) {
                showSection('recetas');
            } else {
                // Si no está autenticado, mostrar registro
                document.getElementById('register-section').style.display = 'block';
                homeSection.style.display = 'none';
            }
        });
    }
    
    // Obtener posts del foro
    fetch('/api/foro', {
        headers: {
            'x-auth-token': localStorage.getItem('token')
        }
    })

    // Mostrar la sección de inicio por defecto
    showSection('home');
});
