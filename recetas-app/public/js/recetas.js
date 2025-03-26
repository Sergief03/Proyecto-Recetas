document.addEventListener('DOMContentLoaded', () => {
    // Validación del formulario
    const validateForm = () => {
        const nombre = document.getElementById('receta-nombre').value;
        const ingredientes = document.querySelectorAll('.ingrediente-row');
        const pasos = document.querySelectorAll('.paso-texto');
        
        if (!nombre) {
            alert('Por favor, ingresa el nombre de la receta.');
            return false;
        }
        
        if (ingredientes.length === 0 || Array.from(ingredientes).some(row => !row.querySelector('.ingrediente-nombre').value || !row.querySelector('.ingrediente-cantidad').value)) {
            alert('Por favor, completa todos los ingredientes.');
            return false;
        }
        
        if (pasos.length === 0 || Array.from(pasos).some(textarea => !textarea.value.trim())) {
            alert('Por favor, completa todos los pasos.');
            return false;
        }
        
        return true;
    };

    // Elementos del DOM

    // Elementos del DOM
    const btnNuevaReceta = document.getElementById('btn-nueva-receta');
    const recetaModal = new bootstrap.Modal(document.getElementById('receta-modal'));
    const btnGuardarReceta = document.getElementById('btn-guardar-receta');
    const listaRecetas = document.getElementById('lista-recetas');
    const btnAddIngrediente = document.getElementById('btn-add-ingrediente');
    const btnAddPaso = document.getElementById('btn-add-paso');
    const ingredientesContainer = document.getElementById('ingredientes-container');
    const pasosContainer = document.getElementById('pasos-container');
    
    // Variable para guardar el ID de la receta en edición
    let recetaEditId = null;
    
    // Función para cargar las recetas del usuario
    window.loadRecetas = () => {
        // Verificar autenticación
        const token = localStorage.getItem('token');
        if (!token) return;
        
        // Limpiar lista de recetas
        if (listaRecetas) {
            listaRecetas.innerHTML = '<div class="col-12 text-center"><p>Cargando recetas...</p></div>';
            
            // Obtener recetas del usuario
            fetch('/api/recetas', {
                headers: {
                    'x-auth-token': token
                }
            })
            .then(res => res.json())
            .then(recetas => {
                if (recetas.length === 0) {
                    listaRecetas.innerHTML = '<div class="col-12 text-center"><p>No tienes recetas guardadas. ¡Crea tu primera receta!</p></div>';
                } else {
                    listaRecetas.innerHTML = '';
                    
                    // Mostrar cada receta
                    recetas.forEach(receta => {
                        const recetaCard = document.createElement('div');
                        recetaCard.className = 'col-md-4 mb-4';
                        recetaCard.innerHTML = `
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${receta.nombre}</h5>
                                    <p class="card-text">${receta.ingredientes.length} ingredientes | ${receta.pasos.length} pasos</p>
                                    <p class="text-muted small">
                                        ${receta.publicado ? '<span class="badge bg-success">Publicada</span>' : '<span class="badge bg-secondary">Privada</span>'}
                                    </p>
                                    <div class="btn-group">
                                        <button class="btn btn-sm btn-primary btn-ver" data-id="${receta._id}">Ver</button>
                                        <button class="btn btn-sm btn-warning btn-editar" data-id="${receta._id}">Editar</button>
                                        <button class="btn btn-sm btn-danger btn-eliminar" data-id="${receta._id}">Eliminar</button>
                                    </div>
                                </div>
                            </div>
                        `;
                        listaRecetas.appendChild(recetaCard);
                    });
                    
                    // Agregar event listeners a los botones
                    document.querySelectorAll('.btn-ver').forEach(btn => {
                        btn.addEventListener('click', () => verReceta(btn.getAttribute('data-id')));
                    });
                    
                    document.querySelectorAll('.btn-editar').forEach(btn => {
                        btn.addEventListener('click', () => editarReceta(btn.getAttribute('data-id')));
                    });
                    
                    document.querySelectorAll('.btn-eliminar').forEach(btn => {
                        btn.addEventListener('click', () => eliminarReceta(btn.getAttribute('data-id')));
                    });
                }
            })
            .catch(err => {
                console.error(err);
                listaRecetas.innerHTML = '<div class="col-12 text-center"><p>Error al cargar recetas</p></div>';
            });
        }
    };
    
    // Función para ver detalles de una receta
    const verReceta = (id) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        fetch(`/api/recetas/${id}`, {
            headers: {
                'x-auth-token': token
            }
        })
        .then(res => res.json())
        .then(receta => {
            // Aquí puedes crear un modal o sección para mostrar detalles
            alert(`Receta: ${receta.nombre}\n\nIngredientes: ${receta.ingredientes.map(i => `${i.cantidad} ${i.unidad} de ${i.nombre}`).join(', ')}\n\nPasos: ${receta.pasos.join('\n')}`);
        })
        .catch(err => {
            console.error(err);
            alert('Error al cargar los detalles de la receta');
        });
    };
    
    // Función para editar una receta
    const editarReceta = (id) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        fetch(`/api/recetas/${id}`, {
            headers: {
                'x-auth-token': token
            }
        })
        .then(res => res.json())
        .then(receta => {
            // Limpiar formulario
            limpiarFormulario();
            
            // Establecer ID de receta en edición
            recetaEditId = receta._id;
            
            // Llenar formulario con datos de la receta
            document.getElementById('receta-nombre').value = receta.nombre;
            document.getElementById('receta-publicar').checked = receta.publicado || false;
            
            // Llenar ingredientes
            ingredientesContainer.innerHTML = '';
            receta.ingredientes.forEach((ingrediente, index) => {
                const ingredienteRow = crearFilaIngrediente();
                ingredienteRow.querySelector('.ingrediente-nombre').value = ingrediente.nombre;
                ingredienteRow.querySelector('.ingrediente-cantidad').value = ingrediente.cantidad;
                ingredienteRow.querySelector('.ingrediente-unidad').value = ingrediente.unidad;
                ingredientesContainer.appendChild(ingredienteRow);
            });
            
            // Llenar pasos
            pasosContainer.innerHTML = '';
            receta.pasos.forEach((paso, index) => {
                const pasoRow = crearFilaPaso(index + 1);
                pasoRow.querySelector('.paso-texto').value = paso;
                pasosContainer.appendChild(pasoRow);
            });
            
            // Mostrar modal
            document.querySelector('#receta-modal .modal-title').textContent = 'Editar Receta';
            recetaModal.show();
        })
        .catch(err => {
            console.error(err);
            alert('Error al cargar la receta para edición');
        });
    };
    
    // Función para eliminar una receta
    const eliminarReceta = (id) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta receta?')) return;
        
        const token = localStorage.getItem('token');
        if (!token) return;
        
        fetch(`/api/recetas/${id}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': token
            }
        })
        .then(res => res.json())
        .then(data => {
            alert('Receta eliminada con éxito');
            loadRecetas();
        })
        .catch(err => {
            console.error(err);
            alert('Error al eliminar la receta');
        });
    };
    
    // Función para crear una nueva fila de ingrediente
    const crearFilaIngrediente = () => {
        const row = document.createElement('div');
        row.className = 'row mb-2 ingrediente-row';
        row.innerHTML = `
            <div class="col">
                <input type="text" class="form-control ingrediente-nombre" placeholder="Ingrediente" required>
            </div>
            <div class="col-3">
                <input type="text" class="form-control ingrediente-cantidad" placeholder="Cantidad" required>
            </div>
            <div class="col-3">
                <select class="form-select ingrediente-unidad">
                    <option value="g">gramos</option>
                    <option value="kg">kilogramos</option>
                    <option value="ml">mililitros</option>
                    <option value="l">litros</option>
                    <option value="taza">tazas</option>
                    <option value="cucharada">cucharadas</option>
                    <option value="unidad">unidades</option>
                </select>
            </div>
            <div class="col-1">
                <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-ingrediente">×</button>
            </div>
        `;
        
        // Agregar evento para eliminar ingrediente
        row.querySelector('.btn-eliminar-ingrediente').addEventListener('click', () => {
            row.remove();
        });
        
        return row;
    };
    
    // Función para crear una nueva fila de paso
    const crearFilaPaso = (numero) => {
        const row = document.createElement('div');
        row.className = 'mb-2 paso-row';
        row.innerHTML = `
            <div class="input-group">
                <span class="input-group-text">${numero}</span>
                <textarea class="form-control paso-texto" rows="2" required></textarea>
                <button type="button" class="btn btn-outline-danger btn-eliminar-paso">×</button>
            </div>
        `;
        
        // Agregar evento para eliminar paso
        row.querySelector('.btn-eliminar-paso').addEventListener('click', () => {
            row.remove();
            // Renumerar pasos
            actualizarNumeroPasos();
        });
        
        return row;
    };
    
    // Función para actualizar los números de los pasos
    const actualizarNumeroPasos = () => {
        const pasos = pasosContainer.querySelectorAll('.paso-row');
        pasos.forEach((paso, index) => {
            paso.querySelector('.input-group-text').textContent = index + 1;
        });
    };
    
    // Función para limpiar el formulario
    const limpiarFormulario = () => {
        document.getElementById('receta-nombre').value = '';
        document.getElementById('receta-publicar').checked = false;
        
        // Limpiar ingredientes (dejar solo uno)
        ingredientesContainer.innerHTML = '';
        ingredientesContainer.appendChild(crearFilaIngrediente());
        
        // Limpiar pasos (dejar solo uno)
        pasosContainer.innerHTML = '';
        pasosContainer.appendChild(crearFilaPaso(1));
        
        // Resetear ID de edición
        recetaEditId = null;
    };
    
    // Event listeners
    if (btnNuevaReceta) {
        btnNuevaReceta.addEventListener('click', () => {
            limpiarFormulario();
            document.querySelector('#receta-modal .modal-title').textContent = 'Nueva Receta';
            recetaModal.show();
        });
    }
    
    if (btnAddIngrediente) {
        btnAddIngrediente.addEventListener('click', () => {
            ingredientesContainer.appendChild(crearFilaIngrediente());
        });
    }
    
    if (btnAddPaso) {
        btnAddPaso.addEventListener('click', () => {
            const numPasos = pasosContainer.querySelectorAll('.paso-row').length;
            pasosContainer.appendChild(crearFilaPaso(numPasos + 1));
        });
    }
    
    if (btnGuardarReceta) {
        btnGuardarReceta.addEventListener('click', () => {
            // Validar datos del formulario
            if (!validateForm()) return;

            // Obtener datos del formulario

            const nombre = document.getElementById('receta-nombre').value;
            const publicado = document.getElementById('receta-publicar').checked;
            
            // Obtener ingredientes
            const ingredientes = [];
            document.querySelectorAll('.ingrediente-row').forEach(row => {
                const nombre = row.querySelector('.ingrediente-nombre').value;
                const cantidad = row.querySelector('.ingrediente-cantidad').value;
                const unidad = row.querySelector('.ingrediente-unidad').value;
                
                if (nombre && cantidad) {
                    ingredientes.push({ nombre, cantidad, unidad });
                }
            });
            
            // Obtener pasos
            const pasos = [];
            document.querySelectorAll('.paso-texto').forEach(textarea => {
                if (textarea.value.trim()) {
                    pasos.push(textarea.value.trim());
                }
            });
            
            // Validar datos
            if (!nombre || ingredientes.length === 0 || pasos.length === 0) {
                alert('Por favor completa todos los campos requeridos');
                return;
            }
            
            // Crear objeto con datos de la receta
            const recetaData = {
                nombre,
                ingredientes,
                pasos,
                publicado
            };
            
            const token = localStorage.getItem('token');
            if (!token) return;
            
            // Determinar si es creación o edición
            const url = recetaEditId ? `/api/recetas/${recetaEditId}` : '/api/recetas';
            const method = recetaEditId ? 'PUT' : 'POST';
            
            // Enviar datos al servidor
            const token = localStorage.getItem('token');
            if (!token) return;

            fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(recetaData)
            })
            .then(res => res.json())
            .then(data => {
                if (data._id) {
                    alert(recetaEditId ? 'Receta actualizada con éxito' : 'Receta creada con éxito');
                    recetaModal.hide();
                    loadRecetas();
                } else {
                    alert(data.msg || 'Error al guardar la receta');
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error al guardar la receta');
            });
        });
    }
});
