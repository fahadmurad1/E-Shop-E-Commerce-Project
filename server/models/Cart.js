const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
