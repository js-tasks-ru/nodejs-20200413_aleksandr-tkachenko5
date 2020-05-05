const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  images: [String],

});

/**
 * Schema configuration:
 *  Indexes:
 *    title,
 *    description,
 *  Indexes weights:
 *    title: 10,
 *    description: 5,
 *  Indexes name:
 *    TextSearchIndex
 *  Default language:
 *    russian
 *
 * */
productSchema.index(
    {
      title: 'text',
      description: 'text',
    },
    {
      name: 'TextSearchIndex',
      default_language: 'russian',
      weights: {
        title: 10,
        description: 5,
      },
    });

module.exports = connection.model('Product', productSchema);
