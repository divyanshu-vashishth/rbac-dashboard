
import type { Permission } from '@/utils/types';
import { Hono } from 'hono';

const app = new Hono()
  .get("/", async (c) => {
    const permissions: Permission[] = []; // Replace with actual DB query
    return c.json(permissions);
  })
  .post("/", async (c) => {
    const data = await c.req.json();
    // Create permission
    return c.json({ message: "Permission created", permission: data });
  })
  .put("/:id", async (c) => {
    const id = c.req.param('id');
    const data = await c.req.json();
    // Update permission
    return c.json({ message: "Permission updated", permission: { id, ...data } });
  })
  .delete("/:id", async (c) => {
    const id = c.req.param('id');
    // Delete permission
    return c.json({ message: "Permission deleted" });
  });

export default app;