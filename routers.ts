import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getAllCupcakes, getCupcakeById, createOrder, getOrderById, getUserOrders } from "./db";
import { Cupcake, OrderItem } from "../shared/types";
import mongoose from "mongoose";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  cupcakes: router({
    list: publicProcedure.query(async () => {
      // Mongoose retorna documentos com _id, que se encaixa no tipo Cupcake
      const cupcakes = await getAllCupcakes();
      return cupcakes.map(c => ({
        ...c.toObject(),
        _id: c._id.toString(),
        imageUrl: c.imageUrl || 'default-cupcake.png' // Garantir que imageUrl existe
      })) as Cupcake[];
    }),
    get: publicProcedure
      .input((input: any) => input.id as string) // ID agora é string (ObjectId)
      .query(async ({ input }) => {
        const cupcake = await getCupcakeById(input);
        if (!cupcake) return null;
        return {
          ...cupcake.toObject(),
          _id: cupcake._id.toString(),
          imageUrl: cupcake.imageUrl || 'default-cupcake.png'
        } as Cupcake;
      }),
  }),

  orders: router({
    create: protectedProcedure
      .input((input: any) => input as {
        items: { id: string, quantity: number, price: number, name: string }[],
        total: number,
        paymentMethod: string,
        customerName: string,
        customerEmail: string,
        customerAddress: string,
        customerCity: string,
        customerZip: string,
      })
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || !ctx.user._id) {
          throw new Error("User not authenticated");
        }

        const orderItems: OrderItem[] = input.items.map(item => ({
          cupcakeId: item.id,
          cupcakeName: item.name,
          quantity: item.quantity,
          price: item.price,
        }));

        const orderResult = await createOrder({
          userId: ctx.user._id, // Usar o _id do usuário do MongoDB
          userName: input.customerName,
          totalAmount: input.total,
          items: orderItems,
          // Outros campos de pedido podem ser adicionados ao modelo Order se necessário
        });

        return { orderId: orderResult._id.toString(), status: orderResult.status };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user || !ctx.user._id) return [];
      const orders = await getUserOrders(ctx.user._id);
      return orders.map(o => ({
        ...o.toObject(),
        _id: o._id.toString(),
        userId: o.userId.toString(),
        createdAt: o.createdAt.toISOString(),
        items: o.items.map(item => ({
          ...item,
          cupcakeId: item.cupcakeId.toString(),
        }))
      }));
    }),

    get: protectedProcedure
      .input((input: any) => input.id as string) // ID agora é string (ObjectId)
      .query(async ({ input, ctx }) => {
        if (!ctx.user || !ctx.user._id) {
          throw new Error("User not authenticated");
        }

        const order = await getOrderById(input);

        if (!order || order.userId.toString() !== ctx.user._id) {
          throw new Error("Order not found or unauthorized");
        }

        return {
          ...order.toObject(),
          _id: order._id.toString(),
          userId: order.userId.toString(),
          createdAt: order.createdAt.toISOString(),
          items: order.items.map(item => ({
            ...item,
            cupcakeId: item.cupcakeId.toString(),
          }))
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
