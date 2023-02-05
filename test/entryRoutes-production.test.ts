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

describe('POST /api/users/register and /api/users/login to get a jwtToken', () => {
  it('should register a new user', async () => {
    await request('https://budgie-backend.onrender.com')
      .post('/api/users/register')
      .send({
        name: 'Jane Doe',
        email: 'janedoe@gmail.com',
        password: 'janeDoePassword',
      })
      .expect(200)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
      })
      .catch((err) => {
        throw err
      })
  }, 30000)

  it('should login the user', async () => {
    await request('https://budgie-backend.onrender.com')
      .post('/api/users/login')
      .send({
        email: 'janedoe@gmail.com',
        password: 'janeDoePassword',
      })
      .expect(200)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
        token = res.body.result
      })
      .catch((err) => {
        throw err
      })
  }, 30000)
})

describe('POST /api/entries', () => {
  it('should post a new entry', async () => {
    await request('https://budgie-backend.onrender.com')
      .post('/api/entries')
      .send({
        category: 'Savings',
        type: true,
        amount: 420,
      })
      .expect(200)
      .set({ Authorization: `Bearer ${token}` })
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
        id = res.body.result._id
      })
      .catch((err) => {
        throw err
      })
  }, 30000)

  it('should throw validation error', async () => {
    await request('https://budgie-backend.onrender.com')
      .post('/api/entries')
      .send({
        category: '',
        type: true,
        amount: 420,
      })
      .expect(400)
      .set({ Authorization: `Bearer ${token}` })
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
      })
      .catch((err) => {
        throw err
      })
  }, 30000)
})

describe('PUT /api/entries/:id', () => {
  it('should edit an entry', async () => {
    await request('https://budgie-backend.onrender.com')
      .put(`/api/entries/${id}`)
      .send({
        category: 'Salary',
        type: true,
        amount: 5000,
        oldAmount: 420,
      })
      .expect(200)
      .set({ Authorization: `Bearer ${token}` })
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
      })
      .catch((err) => {
        throw err
      })
  }, 30000)

  it('should throw validation error', async () => {
    await request('https://budgie-backend.onrender.com')
      .put(`/api/entries/${id}`)
      .send({
        category: '',
        type: true,
        amount: 420,
      })
      .expect(400)
      .set({ Authorization: `Bearer ${token}` })
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
      })
      .catch((err) => {
        throw err
      })
  }, 30000)
})

describe('DELETE /api/entries/:id', () => {
  it('should delete an entry', async () => {
    await request('https://budgie-backend.onrender.com')
      .delete(`/api/entries/${id}`)
      .expect(200)
      .set({ Authorization: `Bearer ${token}` })
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
      })
      .catch((err) => {
        throw err
      })
  }, 30000)

  it('should throw bad request error', async () => {
    await request('https://budgie-backend.onrender.com')
      .delete('/api/entries/62478cd6f33256ab42165e1z')
      .expect(400)
      .set({ Authorization: `Bearer ${token}` })
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
      })
      .catch((err) => {
        throw err
      })
  }, 30000)
})

describe('DELETE /api/users/', () => {
  it('should delete the current user', async () => {
    await request('https://budgie-backend.onrender.com')
      .delete('/api/users/')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
      })
      .catch((err) => {
        throw err
      })
  }, 30000)
})
