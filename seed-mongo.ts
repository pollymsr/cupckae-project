import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://popollymsr_db_user:hAFQUYBwzB7tq8A9@cluster0.k0obyd5.mongodb.net/?appName=Cluster0';

async function run() {
  await mongoose.connect(DATABASE_URL);
  const Product = (await import('./server/models')).Product;
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log('Seeding sample products...');
    await Product.create([
      { name: 'Cupcake de Baunilha', description: 'Macio e leve', price: 9.9, image: '/images/vanilla.jpg', category: 'Tradicional', available: true },
      { name: 'Cupcake de Chocolate', description: 'Intenso e cremoso', price: 11.5, image: '/images/chocolate.jpg', category: 'Tradicional', available: true },
      { name: 'Cupcake Red Velvet', description: 'Clássico red velvet', price: 12.0, image: '/images/redvelvet.jpg', category: 'Especial', available: true }
    ], { ordered: true });
    console.log('Seeding finished.');
  } else {
    console.log('Products already present, skipping seed.');
  }
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
