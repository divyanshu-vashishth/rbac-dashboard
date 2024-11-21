import { Hono } from 'hono';
import { prisma } from '@/lib/db';

const app = new Hono()
  .get("/", async (c) => {
    const permissions = await prisma.permission.findMany();
    return c.json(permissions);
  })
  .post("/", async (c) => {
    const data = await c.req.json();
    const permission = await prisma.permission.create({
      data
    });
    return c.json({ message: "Permission created", permission });
  })
  .delete("/:id", async (c) => {
    const id = c.req.param('id');
    await prisma.permission.delete({ where: { id } });
    return c.json({ message: "Permission deleted" });
  });

export default app;