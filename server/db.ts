import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Establishment queries
export async function createEstablishment(
  userId: number,
  name: string,
  description?: string,
  accessToken?: string
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const { establishments } = await import("../drizzle/schema");
  const token = accessToken || Math.random().toString(36).substring(2, 15);

  const result = await db.insert(establishments).values({
    userId,
    name,
    description,
    accessToken: token,
  });

  return token;
}

export async function getEstablishmentByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const { establishments } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(establishments)
    .where(eq(establishments.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getEstablishmentByAccessToken(accessToken: string) {
  const db = await getDb();
  if (!db) return undefined;

  const { establishments } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(establishments)
    .where(eq(establishments.accessToken, accessToken))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function createProduct(
  establishmentId: number,
  name: string,
  description?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { products } = await import("../drizzle/schema");
  const result = await db.insert(products).values({
    establishmentId,
    name,
    description,
  });

  return result;
}

export async function getProductsByEstablishment(establishmentId: number) {
  const db = await getDb();
  if (!db) return [];

  const { products } = await import("../drizzle/schema");
  return await db
    .select()
    .from(products)
    .where(eq(products.establishmentId, establishmentId));
}

// Order queries
export async function createOrder(
  establishmentId: number,
  ticketNumber: string,
  accessToken?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { orders } = await import("../drizzle/schema");
  const token = accessToken || Math.random().toString(36).substring(2, 15);

  const result = await db.insert(orders).values({
    establishmentId,
    ticketNumber,
    accessToken: token,
    status: "preparing",
  });

  return token;
}

export async function getOrdersByEstablishment(establishmentId: number) {
  const db = await getDb();
  if (!db) return [];

  const { orders } = await import("../drizzle/schema");
  return await db
    .select()
    .from(orders)
    .where(eq(orders.establishmentId, establishmentId))
    .orderBy((t) => t.createdAt);
}

export async function getOrderByAccessToken(accessToken: string) {
  const db = await getDb();
  if (!db) return undefined;

  const { orders } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.accessToken, accessToken))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateOrderStatus(
  orderId: number,
  status: "preparing" | "ready"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { orders } = await import("../drizzle/schema");
  await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, orderId));
}

// OrderItem queries
export async function addOrderItem(
  orderId: number,
  productId: number,
  quantity: number = 1
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { orderItems } = await import("../drizzle/schema");
  await db.insert(orderItems).values({
    orderId,
    productId,
    quantity,
  });
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];

  const { orderItems } = await import("../drizzle/schema");
  return await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));
}
