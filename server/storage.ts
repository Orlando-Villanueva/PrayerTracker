import { PrayerEntry, InsertPrayerEntry, User, InsertUser } from "@shared/schema";
import { users, prayerEntries } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Prayer entries
  getPrayerEntries(userId: number): Promise<PrayerEntry[]>;
  createPrayerEntry(userId: number, entry: InsertPrayerEntry): Promise<PrayerEntry>;
  updatePrayerEntry(id: number, isResolved: boolean): Promise<PrayerEntry | undefined>;
  deletePrayerEntry(id: number): Promise<void>;

  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getPrayerEntries(userId: number): Promise<PrayerEntry[]> {
    return db.select().from(prayerEntries).where(eq(prayerEntries.userId, userId));
  }

  async createPrayerEntry(userId: number, entry: InsertPrayerEntry): Promise<PrayerEntry> {
    const [prayerEntry] = await db
      .insert(prayerEntries)
      .values({ ...entry, userId })
      .returning();
    return prayerEntry;
  }

  async updatePrayerEntry(id: number, isResolved: boolean): Promise<PrayerEntry | undefined> {
    const [entry] = await db
      .update(prayerEntries)
      .set({ isResolved })
      .where(eq(prayerEntries.id, id))
      .returning();
    return entry;
  }

  async deletePrayerEntry(id: number): Promise<void> {
    await db.delete(prayerEntries).where(eq(prayerEntries.id, id));
  }
}

export const storage = new DatabaseStorage();