import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, gymLocations, qrScans, emailSignups } from "../drizzle/schema";
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

export async function seedGymLocations() {
  const db = await getDb();
  if (!db) return;
  
  const locations = [
    { name: "Rigan Fitness", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Fame Fitness", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Pears body building centre", address: "Uttara, Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Cherry Drops", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Fitness Plus", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "South Pacific Health Club", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Xtreme Fitness", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Muscle and Fitness Arena", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Fitlife Gym", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Riverview Gym", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Hammer Gym", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Being Strong Gym", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Fitness Factory", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Esporta Gym", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Radical Fit Gym", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Golden Gym", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Fit Revolution", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Gifairy Fitness", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Metro Fitness", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "My Gym", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "CrossFit Gym", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
    { name: "Fitness Science", address: "Dhaka", redirectUrl: "https://morphfit.shop" },
  ];
  
  try {
    for (const location of locations) {
      await db.insert(gymLocations).values(location);
    }
    console.log("[Database] Seeded 22 gym locations");
  } catch (error) {
    console.error("[Database] Error seeding locations:", error);
  }
}

export async function getGymLocations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gymLocations);
}

export async function getGymLocationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(gymLocations).where(eq(gymLocations.id, id)).limit(1);
  return result[0];
}

export async function logQrScan(locationId: number, redirectDestination?: string, userAgent?: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(qrScans).values({
    locationId,
    redirectDestination,
    userAgent,
  });
  return result;
}

export async function getQrScansByLocation(locationId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(qrScans).where(eq(qrScans.locationId, locationId));
}

export async function getAllQrScans() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(qrScans);
}

export async function addEmailSignup(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  try {
    const result = await db.insert(emailSignups).values({ email });
    return result;
  } catch (error) {
    console.error("[Database] Email already exists or error:", error);
    return undefined;
  }
}
