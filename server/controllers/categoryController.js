const Category = require('../models/Category');

const generateSlug = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/id/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      slug: generateSlug(name),
      description,
      image,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      if (name) category.slug = generateSlug(name);
      category.description = description || category.description;
      category.image = image || category.image;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await Category.deleteOne({ _id: category._id });
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed Categories
// @route   POST /api/categories/seed
// @access  Private/Admin
const seedCategories = async (req, res) => {
  try {
    const defaultCategories = [
      { name: "Women's Fashion", description: "Latest trends in women's clothing and accessories.", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop" },
      { name: "Kids / Children", description: "Toys, clothes, and essentials for kids.", image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=800&auto=format&fit=crop" },
      { name: "Home Decoration", description: "Beautify your space with modern decor.", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop" },
      { name: "Grocery", description: "Fresh groceries delivered to your door.", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop" },
      { name: "Electronics", description: "Premium tech and gadgets.", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop" },
      { name: "Beauty Products", description: "Top-rated skincare and cosmetics.", image: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=800&auto=format&fit=crop" },
      { name: "Footwear", description: "Shoes for every occasion.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop" },
      { name: "Kitchen Items", description: "Essential tools for your kitchen.", image: "https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=800&auto=format&fit=crop" },
      { name: "Accessories", description: "Watches, bags, and jewelry.", image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=800&auto=format&fit=crop" },
      { name: "Furniture", description: "Comfortable and stylish furniture.", image: "https://images.unsplash.com/photo-1505693314120-0d4438670918?q=80&w=800&auto=format&fit=crop" },
    ];

    for (let cat of defaultCategories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create({
          name: cat.name,
          slug: generateSlug(cat.name),
          description: cat.description,
          image: cat.image,
        });
      }
    }
    
    res.json({ message: 'Categories seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  seedCategories,
};
