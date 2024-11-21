
import type { Role } from '@/utils/types';
import { Hono } from 'hono';

const app = new Hono()
  .get("/", async (c) => {
    const roles: Role[] = []; // Replace with actual DB query
    return c.json(roles);
  })
  .post("/", async (c) => {
    const data = await c.req.json();
    // Create role
    return c.json({ message: "Role created", role: data });
  })
  .put("/:id", async (c) => {
    const id = c.req.param('id');
    const data = await c.req.json();
    // Update role
    return c.json({ message: "Role updated", role: { id, ...data } });
  })
  .delete("/:id", async (c) => {
    const id = c.req.param('id');
    // Delete role
    return c.json({ message: "Role deleted" });
  });

export default app;