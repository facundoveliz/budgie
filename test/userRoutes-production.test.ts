import request from 'supertest'
import express from 'express'
import dotenv from 'dotenv'
import * as db from './db'

import userRoutes from '../routes/userRoutes'

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api/users/', userRoutes)

beforeAll(async () => {
  await db.connect()
})

afterAll(async () => {
  await db.clearDatabase()
  await db.closeDatabase()
})

let token: string

describe('POST /api/users/register', () => {
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

  it('should throw invalid email error because is already registered', async () => {
    await request('https://budgie-backend.onrender.com')
      .post('/api/users/register')
      .send({
        name: 'Jane Doe',
        email: 'janedoe@gmail.com',
        password: 'janeDoePassword',
      })
      .expect(400)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
      })
      .catch((err) => {
        throw err
      })
  }, 30000)

  it('should throw validation error', async () => {
    await request('https://budgie-backend.onrender.com')
      .post('/api/users/register')
      .send({
        name: 'Jane Doe',
        email: '',
        password: 'janeDoePassword',
      })
      .expect(400)
      .then(async (res) => expect(res.body).toHaveProperty('ok', false))
      .catch((err) => {
        throw err
      })
  }, 30000)
})

describe('POST /api/users/login', () => {
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

  it('should throw bad credentials error', async () => {
    await request('https://budgie-backend.onrender.com')
      .post('/api/users/login')
      .send({
        email: 'janedoe@gmail.com',
        password: 'janeDoeWrongPassword',
      })
      .expect(400)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
      })
      .catch((err) => {
        throw err
      })
  }, 30000)
})

describe('GET /api/user', () => {
  it('should get current user info', async () => {
    await request('https://budgie-backend.onrender.com')
      .get('/api/users')
      .expect(200)
      .set({ Authorization: `Bearer ${token}` })
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
      })
      .catch((err) => {
        throw err
      })
  }, 30000)

  it('should throw error if the jwt token is wrong', async () => {
    await request('https://budgie-backend.onrender.com')
      .get('/api/users')
      .expect(401)
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
