const Cart = require('../models/Cart');

// @desc    Get logged in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      res.json(cart.cartItems);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync user's cart
// @route   POST /api/cart
// @access  Private
const syncCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (cart) {
      cart.cartItems = cartItems;
      await cart.save();
    } else {
      cart = await Cart.create({
        user: req.user._id,
        cartItems,
      });
    }
    
    res.status(201).json(cart.cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, syncCart };
