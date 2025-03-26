document.addEventListener('DOMContentLoaded', () => {
    const btnBuscar = document.getElementById('btn-buscar');
    const inputBusqueda = document.getElementById('input-busqueda');
    const resultadosBusqueda = document.getElementById('resultados-busqueda');

    // Función para buscar recetas en Google
    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => {
            const query = inputBusqueda.value;
            if (!query) {
                alert('Por favor, ingresa el nombre de la receta.');
                return;
            }

            fetch(`https://www.googleapis.com/customsearch/v1?key=YOUR_API_KEY&cx=YOUR_CX&q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    resultadosBusqueda.innerHTML = '';
                    data.items.forEach(item => {
                        const link = document.createElement('a');
                        link.href = item.link;
                        link.target = '_blank';
                        link.textContent = item.title;
                        resultadosBusqueda.appendChild(link);
                    });
                })
                .catch(err => {
                    console.error(err);
                    alert('Error al buscar recetas en Google');
                });
        });
    }
});
