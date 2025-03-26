const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
require('dotenv').config();

// Ruta: GET api/busqueda
// Descripción: Buscar recetas en Google
router.get('/', auth, async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ msg: 'Se requiere un término de búsqueda' });
        }
        
        // Es necesario configurar una API key de Google Custom Search
        const apiKey = process.env.GOOGLE_API_KEY;
        const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
        
                if (!apiKey || !searchEngineId) {
            return res.status(500).json({ 
                msg: 'Error de configuración del servidor: API de Google no configurada',
                info: 'Contacte al administrador del sistema para configurar GOOGLE_API_KEY y GOOGLE_SEARCH_ENGINE_ID'
            });
        }
        
        // Realizar búsqueda en Google
        const searchUrl = `https://www.googleapis.com/customsearch/v1`;
        const response = await axios.get(searchUrl, {
            params: {
                key: apiKey,
                cx: searchEngineId,
                q: `receta ${query}` // Agregamos "receta" para mejorar resultados
            }
        });
        
        // Devolver resultados
        res.json(response.data);
    } catch (err) {
        console.error('Error de búsqueda en Google:', err.message);
        
        // Si es un error de la API de Google, devolver mensaje específico
        if (err.response && err.response.data) {
            return res.status(err.response.status).json({
                msg: 'Error en la búsqueda en Google',
                error: err.response.data
            });
        }
        
        res.status(500).json({ msg: 'Error del servidor al realizar la búsqueda' });
    }
});

module.exports = router;

