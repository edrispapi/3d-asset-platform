import { Hono } from "hono";
import type { Env } from './core-utils';
import { ModelEntity, UserEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { DEFAULT_VIEWER_CONFIG, Model3D, User } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure seed data is present on first request
  app.use('/api/*', async (c, next) => {
    await ModelEntity.ensureSeed(c.env);
    await UserEntity.ensureSeed(c.env);
    await next();
  });
  // --- AUTH ---
  app.post('/api/auth/login', async (c) => {
    const { username, password } = await c.req.json();
    // MOCK AUTH: In a real app, hash and compare password
    if (username === 'admin' && password === 'admin') {
      const user = await new UserEntity(c.env, 'u1').getState();
      return ok(c, { token: 'mock-token-for-admin', user });
    }
    return bad(c, 'Invalid credentials');
  });
  // --- USER CRUD ---
  app.get('/api/users', async (c) => {
    const { items } = await UserEntity.list(c.env);
    return ok(c, items);
  });
  app.post('/api/users', async (c) => {
    const { name, email } = await c.req.json<{ name?: string; email?: string }>();
    if (!isStr(name) || !isStr(email)) return bad(c, 'Name and email are required');
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      role: 'user',
    };
    const created = await UserEntity.create(c.env, newUser);
    return ok(c, created);
  });
  // --- MODEL CRUD ---
  app.get('/api/models', async (c) => {
    const { items } = await ModelEntity.list(c.env);
    items.sort((a, b) => b.createdAt - a.createdAt);
    return ok(c, { items });
  });
  app.get('/api/models/:id', async (c) => {
    const { id } = c.req.param();
    const model = new ModelEntity(c.env, id);
    if (!(await model.exists())) return notFound(c, 'Model not found');
    return ok(c, await model.getState());
  });
  app.get('/api/viewer/:id', async (c) => {
    const { id } = c.req.param();
    const model = new ModelEntity(c.env, id);
    if (!(await model.exists())) return notFound(c, 'Model not found');
    return ok(c, await model.getState());
  });
  app.post('/api/models', async (c) => {
    const { title, url } = (await c.req.json()) as { title?: string; url?: string };
    if (!isStr(title) || !isStr(url)) return bad(c, 'title and url are required');
    const newModel: Model3D = {
      id: crypto.randomUUID(),
      title: title.trim(),
      url: url.trim(),
      createdAt: Date.now(),
      config: { ...DEFAULT_VIEWER_CONFIG },
      size: 'Pending',
    };
    const created = await ModelEntity.create(c.env, newModel);
    return ok(c, created);
  });
  app.patch('/api/models/:id', async (c) => {
    const { id } = c.req.param();
    const updates = await c.req.json<Partial<Model3D>>();
    const model = new ModelEntity(c.env, id);
    if (!(await model.exists())) return notFound(c, 'Model not found');
    const updatedState = await model.mutate(currentState => ({
      ...currentState,
      ...updates,
      config: { ...currentState.config, ...updates.config },
    }));
    return ok(c, updatedState);
  });
  app.delete('/api/models/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await ModelEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
}