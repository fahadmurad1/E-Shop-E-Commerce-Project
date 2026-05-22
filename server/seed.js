const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const connectDB = require('./config/db');

dotenv.config();

const seedCategories = async () => {
  await connectDB();
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
    const exists = await Category.findOne({ name: cat.name });
    if (!exists) {
      await Category.create({
        name: cat.name,
        slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: cat.description,
        image: cat.image,
      });
    }
  }
  console.log('Categories seeded successfully');
  process.exit();
};

seedCategories();
