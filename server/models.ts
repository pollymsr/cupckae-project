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

const Product = (mongoose.models.Product as Model<IProduct>) || 
  mongoose.model<IProduct>('Product', ProductSchema);

export { Product };
export default { Product };
