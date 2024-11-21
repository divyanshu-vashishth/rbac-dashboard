import type { User } from '@/utils/types';
import { Hono } from 'hono';

const app = new Hono()
  .get("/", async (c) => {
    const users: User[] = []; // Replace with actual DB query
    return c.json(users);
  })
  .post("/", async (c) => {
    const data = await c.req.json();
    // Validate and create user
    return c.json({ message: "User created", user: data });
  })
  .put("/:id", async (c) => {
    const id = c.req.param('id');
    const data = await c.req.json();
    // Update user
    return c.json({ message: "User updated", user: { id, ...data } });
  })
  .delete("/:id", async (c) => {
    const id = c.req.param('id');
    // Delete user
    return c.json({ message: "User deleted" });
  });

export default app;