import mongoose from 'mongoose';
import { Cupcake, ICupcake, User, IUser, Order, IOrder, IOrderItem } from './models';
import { ENV } from './_core/env';

// 1. Conexão com o Banco de Dados
export async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    console.log("[Database] Already connected.");
    return;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Cannot connect to MongoDB.");
    return;
  }

  try {
    await mongoose.connect(connectionString);
    console.log("[Database] Connected to MongoDB successfully.");
  } catch (error) {
    console.error("[Database] Failed to connect to MongoDB:", error);
  }
}

// 2. Funções de Acesso a Dados (CRUD)

// Usuários
export async function upsertUser(user: Partial<IUser> & { openId: string }): Promise<IUser | null> {
  await connectDb();
  const { openId, ...updateFields } = user;

  // Define a role if it's the owner
  if (openId === ENV.ownerOpenId) {
    updateFields.role = 'admin';
  }

  const result = await User.findOneAndUpdate(
    { openId },
    {
      $set: {
        ...updateFields,
        lastSignedIn: new Date(),
      },
      $setOnInsert: {
        openId,
        role: updateFields.role || 'user',
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
  return result;
}

export async function getUserByOpenId(openId: string): Promise<IUser | null> {
  await connectDb();
  return User.findOne({ openId });
}

// Cupcakes
export async function getAllCupcakes(): Promise<ICupcake[]> {
  await connectDb();
  return Cupcake.find().sort({ name: 1 });
}

export async function getCupcakeById(id: string): Promise<ICupcake | null> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Cupcake.findById(id);
}

// Pedidos
export async function createOrder(orderData: { userId: string, userName: string, totalAmount: number, items: IOrderItem[] }): Promise<IOrder> {
  await connectDb();
  const order = new Order({
    ...orderData,
    userId: new mongoose.Types.ObjectId(orderData.userId), // Convert string ID to ObjectId
  });
  await order.save();
  return order;
}

export async function getOrderById(id: string): Promise<IOrder | null> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Order.findById(id).populate('items.cupcakeId');
}

export async function getUserOrders(userId: string): Promise<IOrder[]> {
  await connectDb();
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  return Order.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
}

// Funções auxiliares (se necessário, podem ser adicionadas aqui)
// ...
