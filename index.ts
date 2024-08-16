import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'

interface Post {
    id?: number
    title: string
    path: string
    content: string
}

// Create a new Prisma Client instance
const prisma = new PrismaClient({
    log: ['query', 'warn', 'error']
})

// Create a new Elysia instance and pass DB as context
const app = new Elysia().decorate('db',prisma)

// Fetch all Posts
app.get('/posts', ({db}) => {
    return db.post.findMany()
})

// Fetch a single post by ID
app.get('/posts/:id', ({db, params}) => {
    return db.post.findUnique({where: {id: Number(params.id)}})
})

// Fetch a single post by slug
app.get('/posts/slug/:slug', ({db, params}) => {
    return db.post.findUnique({where: {path: String(params.slug)}})
})

// Create a post
app.post('/posts', ({db, body}) => {
    return db.post.create({
        data: body as Post
    })
})

// Update a post
app.put('/posts/:id', ({db, params, body}) => {
    return db.post.update({
        where: {id: Number(params.id)},
        data: body as Post
    })
})

// Delete an existing post
app.delete('/posts/:id', ({db, params}) => {
    return db.post.delete({where: {id: Number(params.id)}})
})

// App Listening on specified port
app.listen(process.env.API_PORT || 3000, () => {
    console.log(`Server is running on port ${app.server?.port}`)
})