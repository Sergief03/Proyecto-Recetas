const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Assuming Post model exists
const Recipe = require('../models/Receta'); // Assuming Receta model exists
const { protect } = require('../middleware/auth');

// @route   POST /api/foro
// @desc    Publicar una receta en el foro
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { recetaId } = req.body;

    const post = await Post.create({
      receta: recetaId,
      usuario: req.user._id
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// @route   GET /api/foro
// @desc    Obtener recetas del foro
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('receta');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// @route   POST /api/foro/:id/comentarios
// @desc    Comentar en una receta del foro
// @access  Private
router.post('/:id/comentarios', protect, async (req, res) => {
  // Logic to add comments to a post
});

// @route   POST /api/foro/:id/likes
// @desc    Dar "me gusta" a una receta del foro
// @access  Private
router.post('/:id/likes', protect, async (req, res) => {
  // Logic to like a post
});

module.exports = router;
