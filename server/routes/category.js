const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  seedCategories,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCategories)
  .post(protect, admin, createCategory);

router.post('/seed', protect, admin, seedCategories);
router.get('/slug/:slug', getCategoryBySlug);

router.route('/:id')
  .get(getCategoryById)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

module.exports = router;
