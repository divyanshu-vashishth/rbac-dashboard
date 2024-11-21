import type { User } from '@/utils/types';
import { Hono } from 'hono';
import { prisma } from '@/lib/db';

const app = new Hono()
  .get("/", async (c) => {
    const users = await prisma.user.findMany({
      include: { role: { include: { permissions: true } } }
    });
    return c.json(users);
  })
  .post("/", async (c) => {
    try {
      const data = await c.req.json();
      
      if (!data || !data.email || !data.name || !data.role) {
        return c.json({ 
          error: "Missing required fields: email, name, and role are required" 
        }, 400);
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        return c.json({ error: "User with this email already exists" }, 400);
      }

      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          roleId: data.role,
          status: data.status || 'active'
        },
        include: { 
          role: {
            include: { permissions: true }
          }
        }
      });
      
      return c.json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      return c.json({ error: "Failed to create user" }, 500);
    }
  })
  .put("/:id", async (c) => {
    try {
      const id = c.req.param('id');
      const data = await c.req.json();

      if (!data.email || !data.name || !data.role) {
        return c.json({ 
          error: "Missing required fields: email, name, and role are required" 
        }, 400);
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          email: data.email,
          name: data.name,
          roleId: data.role,
          status: data.status || 'active'
        },
        include: { 
          role: {
            include: { permissions: true }
          }
        }
      });

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      return c.json({ error: "Failed to update user" }, 500);
    }
  })
  .delete("/:id", async (c) => {
    const id = c.req.param('id');
    await prisma.user.delete({ where: { id } });
    return c.json({ message: "User deleted" });
  });

export default app;