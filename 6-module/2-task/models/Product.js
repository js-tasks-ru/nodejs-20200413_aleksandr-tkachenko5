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

// eslint-disable-next-line valid-jsdoc
/**
 * Getting the product by Subcategory
 * */
productSchema.statics.getProductsBySubcategory = function(subcategory) {
  return this.find({subcategory: subcategory});
};


// eslint-disable-next-line valid-jsdoc
/**
 * Getting the product by ID
 * */
productSchema.statics.getProductById = function(id) {
  return this.find({_id: id});
};

// eslint-disable-next-line valid-jsdoc
/**
 * Getting products list
 * */
productSchema.statics.getAllProducts = function() {
  return this.find({});
};

// eslint-disable-next-line valid-jsdoc
/**
 * Replace "_id" field to "id"
 * */
productSchema.methods.idFormatter = function() {
  const obj = this.toObject();

  //  Rename fields
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

module.exports = connection.model('Product', productSchema);
