import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import user from './user'
import role from './role'
import permission from './permission'

export const runtime = 'nodejs'

const app = new Hono().basePath('/api')

const routes = app
  .route("/user", user)
  .route("/role", role)
  .route("/permission", permission)


export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)  
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes