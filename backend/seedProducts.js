const mongoose = require('mongoose');
const Product = require('./models/Product');

// Copy the generateProductList and getRandomSuffix functions here (same as above)

async function seed() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce-app');
    console.log('Connected to MongoDB');
    
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log(`Products already exist (${count}). Delete first or use a different method.`);
      process.exit(0);
    }
    
    const products = generateProductList();
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();