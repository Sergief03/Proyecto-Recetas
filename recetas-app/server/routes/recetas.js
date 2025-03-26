const express = require('express');
const router = express.Router();
const Recipe = require('../models/Receta'); // Updated import
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// @route   GET /api/recipes
// @desc    Obtener todas las recetas del usuario
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const recipes = await Recipe.find({ usuario: req.user._id });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// @route   POST /api/recipes
// @desc    Crear una nueva receta
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { nombre, ingredientes, pasos, publicado } = req.body;

    const recipe = await Recipe.create({
      nombre,
      ingredientes,
      pasos,
      usuario: req.user._id,
      publicado
    });

    // Si la receta se marca como publicada, crear un post en el foro
    if (publicado) {
      await Post.create({
        receta: recipe._id,
        usuario: req.user._id
      });
    }

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// @route   GET /api/recipes/:id
// @desc    Obtener una receta por ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    // Verificar que la receta pertenece al usuario o es pública
    if (recipe.usuario.toString() !== req.user._id.toString() && !recipe.publicado) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// @route   PUT /api/recipes/:id
// @desc    Actualizar una receta
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    // Verificar que la receta pertenece al usuario
    if (recipe.usuario.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { nombre, ingredientes, pasos, publicado } = req.body;

    // Si estaba privada y ahora se publica, crear post
    if (!recipe.publicado && publicado) {
      await Post.create({
        receta: recipe._id,
        usuario: req.user._id
      });
    }

    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { nombre, ingredientes, pasos, publicado },
      { new: true }
    );

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// @route   DELETE /api/recipes/:id
// @desc    Eliminar una receta
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    // Verificar que la receta pertenece al usuario
    if (recipe.usuario.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // Eliminar posts asociados
    await Post.deleteMany({ receta: recipe._id });
    
    // Eliminar la receta
    await recipe.remove();

    res.json({ message: 'Receta eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

module.exports = router;
