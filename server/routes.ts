import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPrayerEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/prayers", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const entries = await storage.getPrayerEntries(req.user.id);
    res.json(entries);
  });

  app.post("/api/prayers", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const validatedData = insertPrayerEntrySchema.parse(req.body);
    const entry = await storage.createPrayerEntry(req.user.id, validatedData);
    res.status(201).json(entry);
  });

  app.patch("/api/prayers/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const { isResolved } = req.body;
    if (typeof isResolved !== "boolean") {
      return res.status(400).send("isResolved must be a boolean");
    }

    // Get the prayer entry first to verify ownership
    const prayerEntries = await storage.getPrayerEntries(req.user.id);
    const prayerEntry = prayerEntries.find(entry => entry.id === parseInt(req.params.id));

    if (!prayerEntry) {
      return res.status(404).send("Prayer entry not found or access denied");
    }

    const entry = await storage.updatePrayerEntry(
      parseInt(req.params.id),
      isResolved,
    );

    if (!entry) return res.sendStatus(404);
    res.json(entry);
  });

  app.delete("/api/prayers/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    // Verify ownership before deletion
    const prayerEntries = await storage.getPrayerEntries(req.user.id);
    const prayerEntry = prayerEntries.find(entry => entry.id === parseInt(req.params.id));

    if (!prayerEntry) {
      return res.status(404).send("Prayer entry not found or access denied");
    }

    await storage.deletePrayerEntry(parseInt(req.params.id));
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}