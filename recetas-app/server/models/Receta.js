const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  cantidad: {
    type: String,
    required: true
  },
  unidad: {
    type: String,
    required: true
  }
});

const RecipeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  ingredientes: [IngredientSchema],
  pasos: [String],
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publicado: {
    type: Boolean,
    default: false
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
