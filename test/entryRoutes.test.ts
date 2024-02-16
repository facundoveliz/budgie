import request from 'supertest'
import express from 'express'
import dotenv from 'dotenv'
import * as db from './db'

import entryRoutes from '../routes/entryRoutes'
import userRoutes from '../routes/userRoutes'

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api/entries/', entryRoutes)
app.use('/api/users/', userRoutes)

beforeAll(async () => {
  await db.connect()
})

afterAll(async () => {
  await db.clearDatabase()
  await db.closeDatabase()
})

let token: string
let id: string

describe('User Registration and Authentication', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'johnDoePassword',
      })

    expect(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.msg).toEqual('User created')
  })

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'johndoe@gmail.com',
        password: 'johnDoePassword',
      })

    expect(200)
    expect(res.body.ok).toBe(true)
    token = res.body.result
  })
})

describe('Entry Creation', () => {
  it('should create a new entry', async () => {
    const res = await request(app)
      .post('/api/entries')
      .send({
        category: 'Savings',
        type: true,
        amount: 420,
      })
      .set({ Authorization: `Bearer ${token}` })

    expect(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.msg).toEqual('Entry created')
    id = res.body.result._id
  })

  it('should throw validation error due to missing data', async () => {
    const res = await request(app)
      .post('/api/entries')
      .send({
        category: '',
        type: true,
        amount: 420,
      })
      .set({ Authorization: `Bearer ${token}` })

    expect(400)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('Validation error')
  })

  it('should throw error because the jwt token is invalid', async () => {
    const res = await request(app)
      .post('/api/entries')
      .send({
        category: '',
        type: true,
        amount: 420,
      })
      .set({ Authorization: `Bearer ${token}+1` })

    expect(401)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('Invalid token')
  })

  it('should throw error because the jwt token doesn\'t exist', async () => {
    const res = await request(app)
      .post('/api/entries')
      .send({
        category: '',
        type: true,
        amount: 420,
      })

    expect(401)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('No token')
  })
})

describe('Entry Get', () => {
  it('should get created entry', async () => {
    const res = await request(app)
      .get('/api/entries')
      .expect(200)
      .set({ Authorization: `Bearer ${token}` })

    expect(res.body).toHaveProperty('ok', true)
    expect(res.body.msg).toMatch('Entries founded')
  })

  it('should throw error because the jwt token is invalid', async () => {
    const res = await request(app)
      .get('/api/entries')
      .expect(401)
      .set({ Authorization: `Bearer ${token}+1` })

    expect(res.body).toHaveProperty('ok', false)
    expect(res.body.msg).toMatch('Invalid token')
  })

  it('should throw error because the jwt token doesn\'t exist', async () => {
    const res = await request(app)
      .get('/api/entries')
      .expect(401)

    expect(res.body).toHaveProperty('ok', false)
    expect(res.body.msg).toMatch('No token')
  })
})

describe('Entry Editing', () => {
  it('should edit an existing entry', async () => {
    const res = await request(app)
      .put(`/api/entries/${id}`)
      .send({
        category: 'Salary',
        type: true,
        amount: 5000,
        oldAmount: 420,
      })
      .set({ Authorization: `Bearer ${token}` })

    expect(200)
    expect(res.body.ok).toBe(true)
  })

  it('should throw validation error due to missing data', async () => {
    const res = await request(app)
      .put(`/api/entries/${id}`)
      .send({
        category: '',
        type: true,
        amount: 420,
      })
      .set({ Authorization: `Bearer ${token}` })

    expect(400)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('Validation error')
  })

  it('should throw error because the jwt token is invalid', async () => {
    const res = await request(app)
      .put(`/api/entries/${id}`)
      .send({
        category: '',
        type: true,
        amount: 420,
      })
      .set({ Authorization: `Bearer ${token}+1` })

    expect(401)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('Invalid token')
  })

  it('should throw error because the jwt token doesn\'t exist', async () => {
    const res = await request(app)
      .put(`/api/entries/${id}`)
      .send({
        category: '',
        type: true,
        amount: 420,
      })

    expect(401)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('No token')
  })
})

describe('Entry Deletion', () => {
  it('should delete an existing entry', async () => {
    const res = await request(app)
      .delete(`/api/entries/${id}`)
      .set({ Authorization: `Bearer ${token}` })

    expect(200)
    expect(res.body.ok).toBe(true)
  })

  it('should throw error due to an invalid entry ID', async () => {
    const res = await request(app)
      .delete('/api/entries/62478cd6f33256ab42165e1z')
      .set({ Authorization: `Bearer ${token}` })

    expect(400)
    expect(res.body.ok).toBe(false)
  })
})
