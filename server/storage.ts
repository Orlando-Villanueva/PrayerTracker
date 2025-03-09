import { User, InsertUser, PrayerEntry, InsertPrayerEntry } from "@shared/schema";
import Database from "@replit/database";
import { randomUUID } from "crypto";
import session from "express-session";
import MemoryStore from "memorystore";

const MemorySession = MemoryStore(session);

const db = new Database();

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Prayer entries
  getPrayerEntries(userId: string): Promise<PrayerEntry[]>;
  createPrayerEntry(userId: string, entry: InsertPrayerEntry): Promise<PrayerEntry>;
  updatePrayerEntry(id: string, isResolved: boolean): Promise<PrayerEntry | undefined>;
  deletePrayerEntry(id: string): Promise<void>;

  sessionStore: session.Store;
}

export class ReplitStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemorySession({
      checkPeriod: 86400000, // prune expired entries every 24h
      stale: false
    });
    // Initialize collections if they don't exist
    this.initializeCollections();
  }

  private async initializeCollections() {
    try {
      const users = await db.get("users");
      if (!users) {
        await db.set("users", {});
      }
      const entries = await db.get("prayer_entries");
      if (!entries) {
        await db.set("prayer_entries", {});
      }
    } catch (error) {
      console.error("Failed to initialize collections:", error);
    }
  }

  private async getAllUsers(): Promise<Record<string, User>> {
    try {
      const users = await db.get("users");
      return users ? (users as Record<string, User>) : {};
    } catch (error) {
      console.error("Failed to get users:", error);
      return {};
    }
  }

  private async getAllPrayerEntries(): Promise<Record<string, PrayerEntry>> {
    try {
      const entries = await db.get("prayer_entries");
      return entries ? (entries as Record<string, PrayerEntry>) : {};
    } catch (error) {
      console.error("Failed to get prayer entries:", error);
      return {};
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      const users = await this.getAllUsers();
      return users[id];
    } catch (error) {
      console.error("Failed to get user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const users = await this.getAllUsers();
      if (!users) return undefined;
      return Object.values(users).find(user => user && user.username === username);
    } catch (error) {
      console.error("Failed to get user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const users = await this.getAllUsers();
      const id = randomUUID();
      const user: User = {
        id,
        ...insertUser
      };
      await db.set("users", { ...users, [id]: user });
      return user;
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  }

  async getPrayerEntries(userId: string): Promise<PrayerEntry[]> {
    try {
      const entries = await this.getAllPrayerEntries();
      return Object.values(entries).filter(entry => entry && entry.userId === userId);
    } catch (error) {
      console.error("Failed to get prayer entries:", error);
      return [];
    }
  }

  async createPrayerEntry(userId: string, entry: InsertPrayerEntry): Promise<PrayerEntry> {
    try {
      const entries = await this.getAllPrayerEntries();
      const id = randomUUID();
      const prayerEntry: PrayerEntry = {
        id,
        userId,
        ...entry,
        isResolved: false,
        createdAt: new Date().toISOString()
      };
      await db.set("prayer_entries", { ...entries, [id]: prayerEntry });
      return prayerEntry;
    } catch (error) {
      console.error("Failed to create prayer entry:", error);
      throw error;
    }
  }

  async updatePrayerEntry(id: string, isResolved: boolean): Promise<PrayerEntry | undefined> {
    try {
      const entries = await this.getAllPrayerEntries();
      const entry = entries[id];
      if (!entry) return undefined;

      const updatedEntry: PrayerEntry = {
        ...entry,
        isResolved
      };
      await db.set("prayer_entries", { ...entries, [id]: updatedEntry });
      return updatedEntry;
    } catch (error) {
      console.error("Failed to update prayer entry:", error);
      return undefined;
    }
  }

  async deletePrayerEntry(id: string): Promise<void> {
    try {
      const entries = await this.getAllPrayerEntries();
      const { [id]: _, ...remainingEntries } = entries;
      await db.set("prayer_entries", remainingEntries);
    } catch (error) {
      console.error("Failed to delete prayer entry:", error);
      throw error;
    }
  }
}

export const storage = new ReplitStorage();