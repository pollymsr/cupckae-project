import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String, default: 'Uncategorized' },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Cria ou reutiliza o modelo de forma simples
let Product: Model<IProduct>;
if (mongoose.models.Product) {
  Product = mongoose.models.Product as Model<IProduct>;
} else {
  Product = mongoose.model<IProduct>('Product', ProductSchema);
}

export { Product };
export default { Product };
