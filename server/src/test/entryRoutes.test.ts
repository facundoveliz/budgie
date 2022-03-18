import request from 'supertest'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import * as db from './db'

import entryRoutes from '../routes/entryRoutes'
import userRoutes from '../routes/userRoutes'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())
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
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'johnDoePassword',
      })
      .expect(200)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
        expect(res.body.result.name).toBe('John Doe')
        expect(res.body.result.email).toBe('johndoe@gmail.com')
      })
      .catch((err) => {
        throw err
      })
  })

  it('should login the user', async () => {
    await request(app)
      .post('/api/users/login')
      .send({
        email: 'johndoe@gmail.com',
        password: 'johnDoePassword',
      })
      .expect(200)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
        token = res.body.result.token
      })
      .catch((err) => {
        throw err
      })
  })
})

describe('POST /api/entries', () => {
  it('should post a new entry', async () => {
    await request(app)
      .post('/api/entries')
      .send({
        category: 'Savings',
        income: true,
        amount: 420,
      })
      .expect(200)
      .set('Cookie', `jwtToken=${token}`)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
        expect(res.body.result.category).toBe('Savings')
        expect(res.body.result.amount).toBe(420)
        id = res.body.result._id
      })
      .catch((err) => {
        throw err
      })
  })

  it('should throw validation error', async () => {
    await request(app)
      .post('/api/entries')
      .send({
        category: '',
        income: true,
        amount: 420,
      })
      .expect(400)
      .set('Cookie', `jwtToken=${token}`)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
      })
      .catch((err) => {
        throw err
      })
  })
})

describe('PUT /api/entries/:id', () => {
  it('should edit an entry', async () => {
    await request(app)
      .put(`/api/entries/${id}`)
      .send({
        category: 'Shopping',
        income: false,
        amount: 420,
      })
      .expect(200)
      .set('Cookie', `jwtToken=${token}`)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
        expect(res.body.result.category).toBe('Shopping')
        expect(res.body.result.amount).toBe(-420)
      })
      .catch((err) => {
        throw err
      })
  })

  it('should throw validation error', async () => {
    await request(app)
      .put(`/api/entries/${id}`)
      .send({
        category: '',
        income: true,
        amount: 420,
      })
      .expect(400)
      .set('Cookie', `jwtToken=${token}`)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
      })
      .catch((err) => {
        throw err
      })
  })
})

describe('DELETE /api/entries/:id', () => {
  it('should delete an entry', async () => {
    await request(app)
      .delete(`/api/entries/${id}`)
      .expect(200)
      .set('Cookie', `jwtToken=${token}`)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
      })
      .catch((err) => {
        throw err
      })
  })

  it('should throw bad request error', async () => {
    await request(app)
      .delete('/api/entries/wrongId')
      .expect(400)
      .set('Cookie', `jwtToken=${token}`)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
      })
      .catch((err) => {
        throw err
      })
  })
})
