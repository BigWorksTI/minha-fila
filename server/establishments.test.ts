import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  createEstablishment,
  getEstablishmentByUserId,
  createProduct,
  getProductsByEstablishment,
  createOrder,
  getOrdersByEstablishment,
  getOrderByAccessToken,
  updateOrderStatus,
  addOrderItem,
  getOrderItems,
} from "./db";

// Mock user ID for testing
const TEST_USER_ID = 1;
let testEstablishmentId: number;
let testProductId: number;
let testOrderId: number;
let testOrderAccessToken: string;

describe("Establishment Database Functions", () => {
  describe("Establishment Management", () => {
    it("should create an establishment", async () => {
      const token = await createEstablishment(
        TEST_USER_ID,
        "Test Restaurant",
        "A test restaurant"
      );
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should get establishment by user ID", async () => {
      const establishment = await getEstablishmentByUserId(TEST_USER_ID);
      expect(establishment).toBeDefined();
      if (establishment) {
        testEstablishmentId = establishment.id;
        expect(establishment.name).toBe("Test Restaurant");
        expect(establishment.userId).toBe(TEST_USER_ID);
      }
    });
  });

  describe("Product Management", () => {
    it("should create a product", async () => {
      if (!testEstablishmentId) {
        throw new Error("Test establishment not created");
      }

      const result = await createProduct(
        testEstablishmentId,
        "Burger",
        "Delicious burger"
      );
      expect(result).toBeDefined();
    });

    it("should get products by establishment", async () => {
      if (!testEstablishmentId) {
        throw new Error("Test establishment not created");
      }

      const products = await getProductsByEstablishment(testEstablishmentId);
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      if (products.length > 0) {
        testProductId = products[0].id;
        expect(products[0].name).toBe("Burger");
      }
    });
  });

  describe("Order Management", () => {
    it("should create an order", async () => {
      if (!testEstablishmentId) {
        throw new Error("Test establishment not created");
      }

      testOrderAccessToken = await createOrder(
        testEstablishmentId,
        "001"
      );
      expect(testOrderAccessToken).toBeDefined();
      expect(typeof testOrderAccessToken).toBe("string");
    });

    it("should get orders by establishment", async () => {
      if (!testEstablishmentId) {
        throw new Error("Test establishment not created");
      }

      const orders = await getOrdersByEstablishment(testEstablishmentId);
      expect(Array.isArray(orders)).toBe(true);
      expect(orders.length).toBeGreaterThan(0);
      if (orders.length > 0) {
        testOrderId = orders[0].id;
        expect(orders[0].ticketNumber).toBe("001");
        expect(orders[0].status).toBe("preparing");
      }
    });

    it("should get order by access token", async () => {
      const order = await getOrderByAccessToken(testOrderAccessToken);
      expect(order).toBeDefined();
      if (order) {
        expect(order.ticketNumber).toBe("001");
        expect(order.status).toBe("preparing");
      }
    });

    it("should update order status", async () => {
      if (!testOrderId) {
        throw new Error("Test order not created");
      }

      await updateOrderStatus(testOrderId, "ready");

      const order = await getOrderByAccessToken(testOrderAccessToken);
      expect(order).toBeDefined();
      if (order) {
        expect(order.status).toBe("ready");
      }
    });
  });

  describe("Order Items Management", () => {
    it("should add an order item", async () => {
      if (!testOrderId || !testProductId) {
        throw new Error("Test order or product not created");
      }

      await addOrderItem(testOrderId, testProductId, 2);

      const items = await getOrderItems(testOrderId);
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });

    it("should get order items", async () => {
      if (!testOrderId) {
        throw new Error("Test order not created");
      }

      const items = await getOrderItems(testOrderId);
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
      if (items.length > 0) {
        expect(items[0].quantity).toBe(2);
      }
    });
  });
});
