import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'mongodb+srv://popollymsr_db_user:hAFQUYBwzB7tq8A9@cluster0.k0obyd5.mongodb.net/?appName=Cluster0'

const PORT = Number(process.env.PORT) || 3000

// tenta carregar o model dinamicamente
let Product: any
try {
  const models = require(path.join(process.cwd(), 'server', 'models'))
  Product = models.Product || models.default?.Product
} catch (e) {
  console.warn('Could not load models:', e)
  Product = null
}

// rotas
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.get('/api/products', async (_req, res) => {
  if (!Product) return res.status(500).json({ error: 'Model Product not available' })
  try {
    const docs = await Product.find().limit(100).lean().exec()
    res.json(docs)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.post('/api/products', async (req, res) => {
  if (!Product) return res.status(500).json({ error: 'Model Product not available' })
  try {
    const payload = req.body
    const created = new Product(payload)
    await created.save()
    res.status(201).json(created)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

// serve frontend
app.use(express.static(path.join(process.cwd(), 'dist')))

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(DATABASE_URL)
    console.log('Connected to MongoDB')
  }
}

if (process.env.VERCEL) {
  // Executando no ambiente Vercel → não chama listen(), apenas exporta
  connectDB()
} else {
  // Local
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
}

export default app
