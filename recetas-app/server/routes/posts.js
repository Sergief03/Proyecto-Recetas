const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// @route   GET /api/posts
// @desc    Obtener todos los posts
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const posts = await Post.find().populate('receta usuario');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// @route   POST /api/posts
// @desc    Crear un nuevo post
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { receta, usuario } = req.body;

    const post = await Post.create({
      receta,
      usuario
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Eliminar un post
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    await post.remove();
    res.json({ message: 'Post eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

module.exports = router;
