document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('form-registro');
    const formLogin = document.getElementById('form-login');
    
    // Verificar si el usuario ya está autenticado
    const checkAuth = () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Redirigir a la página principal si ya está autenticado
            window.location.href = 'index.html';
        }
    };
    
    // Verificar autenticación al cargar la página
    checkAuth();

    // Handle registration
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Mostrar indicador de carga
            const submitBtn = formRegistro.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Procesando...';
            
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: nombre, email, password })
                });

                const data = await response.json();
                
                if (response.ok) {
                    // Registro exitoso
                    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                    
                    // Limpiar el formulario
                    formRegistro.reset();
                    
                    // Cambiar a la pestaña de inicio de sesión
                    document.getElementById('login-email').value = email;
                    document.getElementById('login-tab').click();
                } else {
                    // Error en el registro
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor. Inténtalo de nuevo más tarde.');
            } finally {
                // Restaurar el botón
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // Handle login
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Mostrar indicador de carga
            const submitBtn = formLogin.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Procesando...';
            
            const loginEmail = document.getElementById('login-email').value;
            const loginPassword = document.getElementById('login-password').value;

            try {
                console.log('Intentando iniciar sesión con:', { email: loginEmail });
                
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: loginEmail, password: loginPassword })
                });

                const data = await response.json();
                console.log('Respuesta del servidor:', data);

                if (response.ok) {
                    // Guardar token y datos del usuario
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userName', data.user.username);
                    localStorage.setItem('userEmail', data.user.email);
                    
                    // Mostrar mensaje de éxito
                    alert('¡Inicio de sesión exitoso!');
                    
                    // Redirigir a la página principal
                    window.location.href = 'index.html';
                } else {
                    // Error en el inicio de sesión
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor. Inténtalo de nuevo más tarde.');
            } finally {
                // Restaurar el botón
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});
