import { Hono } from "hono";
import type { Env } from './core-utils';
import { ModelEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { DEFAULT_VIEWER_CONFIG, Model3D } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure seed data is present on first request
  app.use('/api/*', async (c, next) => {
    await ModelEntity.ensureSeed(c.env);
    await next();
  });
  // --- MODEL CRUD ---
  // List all models
  app.get('/api/models', async (c) => {
    const { items } = await ModelEntity.list(c.env);
    // Sort by creation date, newest first
    items.sort((a, b) => b.createdAt - a.createdAt);
    return ok(c, items);
  });
  // Get a single model by ID
  app.get('/api/models/:id', async (c) => {
    const { id } = c.req.param();
    const model = new ModelEntity(c.env, id);
    if (!await model.exists()) return notFound(c, 'Model not found');
    return ok(c, await model.getState());
  });
  // Public viewer endpoint (read-only)
  app.get('/api/viewer/:id', async (c) => {
    const { id } = c.req.param();
    const model = new ModelEntity(c.env, id);
    if (!await model.exists()) return notFound(c, 'Model not found');
    return ok(c, await model.getState());
  });
  // Create a new model
  app.post('/api/models', async (c) => {
    const { title, url } = (await c.req.json()) as { title?: string; url?: string };
    if (!isStr(title) || !isStr(url)) return bad(c, 'title and url are required');
    const newModel: Model3D = {
      id: crypto.randomUUID(),
      title: title.trim(),
      url: url.trim(),
      createdAt: Date.now(),
      config: { ...DEFAULT_VIEWER_CONFIG },
      size: 'Pending', // Size can be calculated later
    };
    const created = await ModelEntity.create(c.env, newModel);
    return ok(c, created);
  });
  // Delete a model
  app.delete('/api/models/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await ModelEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
}