import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Prayer entry schema
export const prayerEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.enum(["unbelievers", "brethren"]),
  isResolved: z.boolean().default(false),
  createdAt: z.string(),
});

export const insertUserSchema = userSchema.omit({ id: true });
export const insertPrayerEntrySchema = prayerEntrySchema
  .omit({ id: true, userId: true, createdAt: true, isResolved: true });

export type User = z.infer<typeof userSchema>;
export type PrayerEntry = z.infer<typeof prayerEntrySchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPrayerEntry = z.infer<typeof insertPrayerEntrySchema>;