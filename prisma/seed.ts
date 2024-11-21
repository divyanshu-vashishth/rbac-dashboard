import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create default permissions
  const permissions = await Promise.all([
    // Basic permissions
    prisma.permission.upsert({
      where: { name: 'read:all' },
      update: {},
      create: { name: 'read:all', description: 'Can read all resources' },
    }),
    prisma.permission.upsert({
      where: { name: 'write:all' },
      update: {},
      create: { name: 'write:all', description: 'Can write all resources' },
    }),
    prisma.permission.upsert({
      where: { name: 'delete:all' },
      update: {},
      create: { name: 'delete:all', description: 'Can delete all resources' },
    }),
    prisma.permission.upsert({
      where: { name: 'read:own' },
      update: {},
      create: { name: 'read:own', description: 'Can read own resources' },
    }),
    // Additional permissions
    prisma.permission.upsert({
      where: { name: 'manage:users' },
      update: {},
      create: { name: 'manage:users', description: 'Can manage user accounts' },
    }),
    prisma.permission.upsert({
      where: { name: 'manage:roles' },
      update: {},
      create: { name: 'manage:roles', description: 'Can manage roles' },
    }),
    prisma.permission.upsert({
      where: { name: 'block:users' },
      update: {},
      create: { name: 'block:users', description: 'Can block users' },
    }),
  ])

  // Create default roles with specific permission sets
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {
      permissions: { set: permissions }
    },
    create: {
      name: 'admin',
      permissions: { connect: permissions.map(p => ({ id: p.id })) }
    },
  })

  const moderatorRole = await prisma.role.upsert({
    where: { name: 'moderator' },
    update: {
      permissions: { 
        set: permissions.filter(p => 
          ['read:all', 'write:all', 'block:users', 'manage:users'].includes(p.name)
        )
      }
    },
    create: {
      name: 'moderator',
      permissions: {
        connect: permissions
          .filter(p => ['read:all', 'write:all', 'block:users', 'manage:users'].includes(p.name))
          .map(p => ({ id: p.id }))
      }
    },
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {
      permissions: { 
        set: permissions.filter(p => ['read:own'].includes(p.name))
      }
    },
    create: {
      name: 'user',
      permissions: {
        connect: permissions
          .filter(p => ['read:own'].includes(p.name))
          .map(p => ({ id: p.id }))
      }
    },
  })

  // Create default users
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'System Admin',
      status: 'active',
      roleId: adminRole.id,
    },
  })

  await prisma.user.upsert({
    where: { email: 'moderator@example.com' },
    update: {},
    create: {
      email: 'moderator@example.com',
      name: 'Content Moderator',
      status: 'active',
      roleId: moderatorRole.id,
    },
  })

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      status: 'active',
      roleId: userRole.id,
    },
  })

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })