const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      default: '/images/sample.jpg',
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
