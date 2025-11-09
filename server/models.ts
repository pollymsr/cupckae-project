import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema sem generic para evitar o erro TypeScript
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,
    category: { type: String, default: 'Uncategorized' },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Model export direto
export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;