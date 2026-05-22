const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const uploadRoutes = require('./routes/upload');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');
const path = require('path');

dotenv.config();

// Connect to database
// Note: You must provide a valid MONGO_URI in your .env file
connectDB().then(async () => {
  // Seed Categories if empty
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      console.log('Seeding default categories...');
      const defaultCategories = [
        { name: "Women's Fashion", description: "Latest trends in women's clothing and accessories.", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop" },
        { name: "Kids", description: "Toys, clothes, and essentials for kids.", image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=800&auto=format&fit=crop" },
        { name: "Home Decoration", description: "Beautify your space with modern decor.", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop" },
        { name: "Grocery", description: "Fresh groceries delivered to your door.", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop" },
        { name: "Electronics", description: "Premium tech and gadgets.", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop" },
        { name: "Beauty", description: "Top-rated skincare and cosmetics.", image: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=800&auto=format&fit=crop" },
        { name: "Footwear", description: "Shoes for every occasion.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop" },
        { name: "Furniture", description: "Comfortable and stylish furniture.", image: "https://images.unsplash.com/photo-1505693314120-0d4438670918?q=80&w=800&auto=format&fit=crop" },
      ];
      for (let cat of defaultCategories) {
        await Category.create({
          name: cat.name,
          slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          description: cat.description,
          image: cat.image,
        });
      }
      console.log('Categories seeded successfully');
    }
  } catch (err) {
    console.error('Error seeding categories:', err);
  }
});

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Razorpay config
app.get('/api/config/razorpay', (req, res) =>
  res.send(process.env.RAZORPAY_KEY_ID || 'test_key')
);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Root health-check route
app.get('/', (req, res) => {
  res.json({ message: 'E-Shop API is running ✅', status: 'OK' });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
