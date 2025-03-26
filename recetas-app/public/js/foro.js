document.addEventListener('DOMContentLoaded', () => {
    const listaPosts = document.getElementById('lista-posts');
    const btnPublicar = document.getElementById('btn-publicar');
    
    // Función para cargar los posts del foro
    const loadPosts = () => {
        fetch('/api/foro')
            .then(res => res.json())
            .then(posts => {
                listaPosts.innerHTML = '';
                posts.forEach(post => {
                    const postCard = document.createElement('div');
                    postCard.className = 'col-md-4 mb-4';
                    postCard.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${post.receta.nombre}</h5>
                                <p class="card-text">Publicado por: ${post.usuario}</p>
                                <div class="btn-group">
                                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${post._id}">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    `;
                    listaPosts.appendChild(postCard);
                });
            })
            .catch(err => {
                console.error(err);
                listaPosts.innerHTML = '<p>Error al cargar los posts</p>';
            });
    };

    // Función para publicar una receta en el foro
    if (btnPublicar) {
        btnPublicar.addEventListener('click', () => {
            const recetaId = document.getElementById('receta-id').value; // Assuming there's an input for receta ID
            fetch('/api/foro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ recetaId })
            })
            .then(res => res.json())
            .then(data => {
                alert('Receta publicada en el foro');
                loadPosts();
            })
            .catch(err => {
                console.error(err);
                alert('Error al publicar la receta');
            });
        });
    }

    // Load posts on page load
    loadPosts();
});
