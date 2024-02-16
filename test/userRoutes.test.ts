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

describe('User Registration', () => {
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

  it('should throw error because the email already exists', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'johnDoePassword',
      })

    expect(400)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('Invalid email or password')
  })

  it('should throw error because the email format is invalid', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoegmail.com',
        password: 'johnDoePassword',
      })
    expect(400)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('Validation error')
  })

  it('should throw error because the name is empty', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: '',
        email: 'johndoe@gmail.com',
        password: 'johnDoePassword',
      })
    expect(400)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('Validation error')
  })

  it('should throw error because the password is too short', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'johnDoe',
      })
    expect(400)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('Validation error')
  })
})

describe('User Login', () => {
  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'johndoe@gmail.com',
        password: 'johnDoePassword',
      })

    expect(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.msg).toEqual('User logged')
    token = res.body.result
  })

  it('should throw error because the email is invalid', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'johndoewrong@gmail.com',
        password: 'johnDoePassword',
      })

    expect(400)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('Invalid email or password')
  })

  it('should throw error because the password is incorrect', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'johndoe@gmail.com',
        password: 'johnDoeWrongPassword',
      })

    expect(400)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('Invalid email or password')
  })
})

describe('Get Current User', () => {
  it('should retrieve current user info', async () => {
    const res = await request(app)
      .get('/api/users')
      .set({ Authorization: `Bearer ${token}` })

    expect(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.msg).toEqual('User founded')
  })

  it('should throw error because the jwt token is invalid', async () => {
    const res = await request(app)
      .get('/api/users')
      .set({ Authorization: `Bearer ${token}+1` })

    expect(401)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('Invalid token')
  })

  it('should throw error because the jwt token doesn\'t exist', async () => {
    const res = await request(app)
      .get('/api/users')

    expect(401)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('No token')
  })
})

describe('Update User', () => {
  it('should update the user name', async () => {
    const res = await request(app)
      .put('/api/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: 'Jane Doe',
      })

    expect(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.msg).toEqual('User updated')
  })

  it('should update the email', async () => {
    const res = await request(app)
      .put('/api/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        email: 'janedoe@gmail.com',
      })

    expect(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.msg).toEqual('User updated')
  })

  it('should update the pasword', async () => {
    const res = await request(app)
      .put('/api/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        password: 'janeDoePassword',
      })

    expect(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.msg).toEqual('User updated')
  })

  // create user for email checking
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Jane Doe',
        email: 'janedoe@mail.com',
        password: 'janeDoePassword',
      })

    expect(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.msg).toEqual('User created')
  })

  it('should throw error because the email already exists', async () => {
    const res = await request(app)
      .put('/api/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        email: 'janedoe@mail.com',
      })

    expect(400)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('Invalid email or password')
    token = res.body.result
  })
})

describe('Delete User Account', () => {
  // login so it will load the token again
  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'janedoe@gmail.com',
        password: 'janeDoePassword',
      })

    expect(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.msg).toEqual('User logged')
    token = res.body.result
  })

  it('should delete the user', async () => {
    const res = await request(app)
      .delete('/api/users')
      .set({ Authorization: `Bearer ${token}` })

    expect(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.msg).toEqual('User deleted')
  })

  it('should throw error because the jwt token doesn\'t exist', async () => {
    const res = await request(app)
      .delete('/api/users')

    expect(401)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('No token')
  })

  it('should throw error because the jwt token is invalid', async () => {
    const res = await request(app)
      .delete('/api/users')
      .set({ Authorization: `Bearer ${token}+1` })

    expect(401)
    expect(res.body.ok).toBe(false)
    expect(res.body.msg).toEqual('Invalid token')
  })
})
