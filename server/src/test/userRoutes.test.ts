import request from 'supertest'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import * as db from './db'

import userRoutes from '../routes/userRoutes'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())
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

  it('should throw invalid email error because is already registered', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'johnDoePassword',
      })
      .expect(400)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
      })
      .catch((err) => {
        throw err
      })
  })

  it('should throw validation error', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: '',
        password: 'johnDoePassword',
      })
      .expect(400)
      .then(async (res) => expect(res.body).toHaveProperty('ok', false))
      .catch((err) => {
        throw err
      })
  })
})

describe('POST /api/users/login', () => {
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

  it('should throw bad credentials error', async () => {
    await request(app)
      .post('/api/users/login')
      .send({
        email: 'johndoe@gmail.com',
        password: 'johnDoeWrongPassword',
      })
      .expect(400)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
      })
      .catch((err) => {
        throw err
      })
  })
})

describe('GET /api/user', () => {
  it('should get current user info', async () => {
    await request(app)
      .get('/api/users')
      .expect(200)
      .set('Cookie', `jwtToken=${token}`)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
      })
      .catch((err) => {
        throw err
      })
  })

  it('should throw error if the jwt token is wrong', async () => {
    await request(app)
      .get('/api/users')
      .expect(401)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
      })
      .catch((err) => {
        throw err
      })
  })
})
