import type { Role } from '@/utils/types';
import { Hono } from 'hono';
import { prisma } from '@/lib/db';

const app = new Hono()
  .get("/", async (c) => {
    const roles = await prisma.role.findMany({
      include: { permissions: true }
    });
    return c.json(roles);
  })
  .post("/", async (c) => {
    const data = await c.req.json();
    const role = await prisma.role.create({
      data: {
        name: data.name,
        permissions: {
          connect: data.permissions?.map((id: string) => ({ id })) || []
        }
      },
      include: { permissions: true }
    });
    return c.json(role);
  })
  .put("/:id", async (c) => {
    try {
      const id = c.req.param('id');
      const data = await c.req.json();

      if (!data.name) {
        return c.json({ error: "Name is required" }, 400);
      }

      const role = await prisma.role.update({
        where: { id },
        data: {
          name: data.name,
          permissions: {
            set: [], 
            connect: data.permissions?.map((id: string) => ({ id })) || []
          }
        },
        include: { 
          permissions: true
        }
      });

      return c.json(role);
    } catch (error: any) {
      console.error('Error updating role:', error.message);
      return c.json({ 
        error: "Failed to update role",
        details: error.message 
      }, 500);
    }
  })
  .delete("/:id", async (c) => {
    const id = c.req.param('id');
    await prisma.role.delete({ where: { id } });
    return c.json({ message: "Role deleted" });
  });

export default app;