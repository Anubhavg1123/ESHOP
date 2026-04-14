const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/ecommerce-app')
  .then(() => {
    console.log('MongoDB connected successfully');
    seedInitialData();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const attendanceRoutes = require('./routes/attendance');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong!' });
});

// ---------- Helper function to generate 1000+ products ----------
function getRandomSuffix(category) {
  const suffixes = {
    'Grocery': ['Rice', 'Wheat', 'Sugar', 'Salt', 'Oil', 'Spices', 'Dal', 'Atta', 'Biscuit', 'Tea', 'Coffee', 'Juice', 'Pickle', 'Honey', 'Nuts'],
    'Stationery': ['Pen', 'Pencil', 'Notebook', 'Eraser', 'Sharpener', 'Ruler', 'Marker', 'Highlighter', 'Glue', 'Tape', 'Stapler', 'Clip', 'Envelope'],
    'Books': ['Novel', 'Guide', 'Comic', 'Biography', 'Self-Help', 'Science', 'Math', 'History', 'Fiction', 'Dictionary', 'Magazine', 'Journal'],
    'Cosmetics': ['Lipstick', 'Foundation', 'Mascara', 'Eyeliner', 'Nail Polish', 'Moisturizer', 'Sunscreen', 'Serum', 'Compact', 'Kajal', 'Blush', 'Concealer'],
    'Electronics': ['Phone', 'Charger', 'Cable', 'Adapter', 'Speaker', 'Headphone', 'Mouse', 'Keyboard', 'Monitor', 'Laptop', 'Tablet', 'Smartwatch'],
    'Home & Kitchen': ['Plate', 'Bowl', 'Cup', 'Spoon', 'Knife', 'Pan', 'Pot', 'Mixer', 'Toaster', 'Kettle', 'Blender', 'Cooker'],
    'Sports': ['Ball', 'Bat', 'Racket', 'Gloves', 'Shoes', 'Shorts', 'T-shirt', 'Water Bottle', 'Bag', 'Mat', 'Dumbbell', 'Skipping Rope'],
    'Toys & Games': ['Car', 'Doll', 'Puzzle', 'Blocks', 'Board Game', 'Action Figure', 'Stuffed Toy', 'Drone', 'Remote Car', 'Lego', 'Train Set'],
    'Fashion': ['T-shirt', 'Jeans', 'Shirt', 'Saree', 'Kurta', 'Jacket', 'Shoes', 'Watch', 'Belt', 'Cap', 'Scarf', 'Sunglasses'],
    'Automotive': ['Oil Filter', 'Air Filter', 'Spark Plug', 'Bulb', 'Wiper', 'Cleaner', 'Polish', 'Seat Cover', 'Mud Flap', 'Sticker', 'Battery']
  };
  const list = suffixes[category] || ['Item'];
  return list[Math.floor(Math.random() * list.length)];
}

function generateProductList() {
  const products = [];
  
  const categories = [
    { name: 'Grocery', count: 150, prefix: 'Grocery' },
    { name: 'Stationery', count: 100, prefix: 'Stationery' },
    { name: 'Books', count: 150, prefix: 'Book' },
    { name: 'Cosmetics', count: 100, prefix: 'Cosmetic' },
    { name: 'Electronics', count: 120, prefix: 'Electronic' },
    { name: 'Home & Kitchen', count: 100, prefix: 'Home' },
    { name: 'Sports', count: 80, prefix: 'Sports' },
    { name: 'Toys & Games', count: 70, prefix: 'Toy' },
    { name: 'Fashion', count: 80, prefix: 'Fashion' },
    { name: 'Automotive', count: 50, prefix: 'Auto' }
  ];

  const priceRanges = {
    'Grocery': [2, 50],
    'Stationery': [1, 30],
    'Books': [5, 40],
    'Cosmetics': [4, 60],
    'Electronics': [20, 800],
    'Home & Kitchen': [10, 150],
    'Sports': [15, 200],
    'Toys & Games': [5, 80],
    'Fashion': [10, 120],
    'Automotive': [8, 100]
  };

  let imageCounter = 10;

  for (const cat of categories) {
    for (let i = 1; i <= cat.count; i++) {
      const priceMin = priceRanges[cat.name][0];
      const priceMax = priceRanges[cat.name][1];
      const price = Math.floor(Math.random() * (priceMax - priceMin + 1) + priceMin);
      const stock = Math.floor(Math.random() * 200) + 10;
      const name = `${cat.prefix} ${i} - ${getRandomSuffix(cat.name)}`;
      const description = `High quality ${cat.name.toLowerCase()} product. Perfect for your needs.`;
      const imageUrl = `https://picsum.photos/id/${imageCounter % 100}/300/200`;
      imageCounter++;
      
      products.push({
        name,
        price,
        description,
        category: cat.name,
        imageUrl,
        stock
      });
    }
  }
  
  return products; // Total = 150+100+150+100+120+100+80+70+80+50 = 1000
}

// ---------- Seed initial data (manager + 1000 products) ----------
async function seedInitialData() {
  const User = require('./models/User');
  const Product = require('./models/Product');
  
  // Create default manager if none exists
  const managerExists = await User.findOne({ role: 'manager' });
  if (!managerExists) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('manager123', 10);
    await User.create({
      name: 'Manager User',
      email: 'manager@example.com',
      password: hashedPassword,
      role: 'manager',
      addresses: []
    });
    console.log('Default manager created: manager@example.com / manager123');
  }

  // Seed 1000 products only if collection is empty
 const productCount = await Product.countDocuments();
if (productCount !== 1000) {
  // Delete existing products first (optional)
  await Product.deleteMany({});
  const allProducts = generateProductList();
  await Product.insertMany(allProducts);
  console.log(`✅ ${allProducts.length} products seeded (replaced old ones)`);
} else {
  console.log(`Already have 1000 products.`);
}
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});