import { PrayerEntry, InsertPrayerEntry, User, InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private prayerEntries: Map<number, PrayerEntry>;
  private currentUserId: number;
  private currentPrayerId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.prayerEntries = new Map();
    this.currentUserId = 1;
    this.currentPrayerId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPrayerEntries(userId: number): Promise<PrayerEntry[]> {
    return Array.from(this.prayerEntries.values()).filter(
      (entry) => entry.userId === userId,
    );
  }

  async createPrayerEntry(userId: number, entry: InsertPrayerEntry): Promise<PrayerEntry> {
    const id = this.currentPrayerId++;
    const prayerEntry: PrayerEntry = {
      ...entry,
      id,
      userId,
      isResolved: false,
      createdAt: new Date(),
    };
    this.prayerEntries.set(id, prayerEntry);
    return prayerEntry;
  }

  async updatePrayerEntry(id: number, isResolved: boolean): Promise<PrayerEntry | undefined> {
    const entry = this.prayerEntries.get(id);
    if (!entry) return undefined;
    
    const updatedEntry = { ...entry, isResolved };
    this.prayerEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deletePrayerEntry(id: number): Promise<void> {
    this.prayerEntries.delete(id);
  }
}

export const storage = new MemStorage();
