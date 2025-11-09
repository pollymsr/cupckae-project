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

// Use type assertion to simplify the schema type
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
) as Schema<IProduct>;

// Model creation
export const Product: Model<IProduct> = mongoose.models.Product || 
  mongoose.model<IProduct>('Product', ProductSchema);

export default { Product };