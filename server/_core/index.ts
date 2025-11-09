import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const DATABASE_URL = process.env.DATABASE_URL || "mongodb+srv://popollymsr_db_user:hAFQUYBwzB7tq8A9@cluster0.k0obyd5.mongodb.net/?appName=Cluster0";
const PORT = Number(process.env.PORT) || 3000;

let Product: any;
try {
  const models = require(path.join(process.cwd(), 'server', 'models'));
  Product = models.Product || models.default?.Product;
} catch (e) {
  console.warn('Could not load models:', e);
  Product = null;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/products', async (_req, res) => {
  if (!Product) return res.status(500).json({ error: 'Model Product not available' });
  try {
    const docs = await Product.find().limit(100).lean().exec();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/products', async (req, res) => {
  if (!Product) return res.status(500).json({ error: 'Model Product not available' });
  try {
    const payload = req.body;
    const created = new Product(payload);
    await created.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.use(express.static(path.join(process.cwd(), 'dist')));

async function start() {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('Connected to MongoDB');
    try {
      // Auto-seed sample products if collection is empty
      const Product = require(path.join(process.cwd(),'server','models')).Product;
      const cnt = await Product.countDocuments();
      if(cnt === 0) {
        console.log('Auto-seeding sample products...');
        await Product.create([
          { name: 'Cupcake de Baunilha', description: 'Macio e leve', price: 9.9, image: '/images/vanilla.jpg', category: 'Tradicional', available: true },
          { name: 'Cupcake de Chocolate', description: 'Intenso e cremoso', price: 11.5, image: '/images/chocolate.jpg', category: 'Tradicional', available: true },
          { name: 'Cupcake Red Velvet', description: 'Clássico red velvet', price: 12.0, image: '/images/redvelvet.jpg', category: 'Especial', available: true }
        ]);
        console.log('Auto-seed finished.');
      }
    } catch(e) { console.warn('Auto-seed failed:', e); }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

export default app;
