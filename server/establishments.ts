import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createEstablishment,
  getEstablishmentByUserId,
  getEstablishmentByAccessToken,
  createProduct,
  getProductsByEstablishment,
  createOrder,
  getOrdersByEstablishment,
  getOrderByAccessToken,
  updateOrderStatus,
  addOrderItem,
  getOrderItems,
} from "./db";

export const establishmentRouter = router({
  // Establishment management
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const accessToken = await createEstablishment(
        ctx.user.id,
        input.name,
        input.description
      );
      return { accessToken };
    }),

  getMe: protectedProcedure.query(async ({ ctx }) => {
    return await getEstablishmentByUserId(ctx.user.id);
  }),

  // Product management
  products: router({
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const establishment = await getEstablishmentByUserId(ctx.user.id);
        if (!establishment) {
          throw new Error("Establishment not found");
        }

        await createProduct(
          establishment.id,
          input.name,
          input.description
        );
        return { success: true };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const establishment = await getEstablishmentByUserId(ctx.user.id);
      if (!establishment) {
        return [];
      }

      return await getProductsByEstablishment(establishment.id);
    }),
  }),

  // Order management
  orders: router({
    create: protectedProcedure
      .input(
        z.object({
          ticketNumber: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const establishment = await getEstablishmentByUserId(ctx.user.id);
        if (!establishment) {
          throw new Error("Establishment not found");
        }

        const accessToken = await createOrder(
          establishment.id,
          input.ticketNumber
        );
        return { accessToken };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const establishment = await getEstablishmentByUserId(ctx.user.id);
      if (!establishment) {
        return [];
      }

      return await getOrdersByEstablishment(establishment.id);
    }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          orderId: z.number(),
          status: z.enum(["preparing", "ready"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const establishment = await getEstablishmentByUserId(ctx.user.id);
        if (!establishment) {
          throw new Error("Establishment not found");
        }

        await updateOrderStatus(input.orderId, input.status);
        return { success: true };
      }),

    addItem: protectedProcedure
      .input(
        z.object({
          orderId: z.number(),
          productId: z.number(),
          quantity: z.number().default(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const establishment = await getEstablishmentByUserId(ctx.user.id);
        if (!establishment) {
          throw new Error("Establishment not found");
        }

        await addOrderItem(input.orderId, input.productId, input.quantity);
        return { success: true };
      }),

    getItems: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        return await getOrderItems(input.orderId);
      }),
  }),

  // Public routes (for customers)
  public: router({
    getOrder: publicProcedure
      .input(z.object({ accessToken: z.string() }))
      .query(async ({ input }) => {
        return await getOrderByAccessToken(input.accessToken);
      }),

    getOrderItems: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        return await getOrderItems(input.orderId);
      }),
  }),
});
