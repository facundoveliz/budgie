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
        expect(res.body.msg).toMatch("User created");
      })
      .catch((err) => {
        throw err
      })
  })

  it('should throw error because the email already exists', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'johnDoePassword',
      }).expect(400)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false);
        expect(res.body.msg).toMatch("Invalid email or password");
      })
      .catch((err) => {
        throw err
      })

  });

  it('should throw error because the email format is invalid', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoegmail.com',
        password: 'johnDoePassword',
      }).expect(400)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false);
        expect(res.body.msg).toMatch("Validation error");
      })
      .catch((err) => {
        throw err
      })
  });

  it('should throw error because the name is empty', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        name: '',
        email: 'johndoe@gmail.com',
        password: 'johnDoePassword',
      }).expect(400)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false);
        expect(res.body.msg).toMatch("Validation error");
      })
      .catch((err) => {
        throw err
      })
  });

  it('should throw error because the password is too short', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'johnDoe',
      }).expect(400)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false);
        expect(res.body.msg).toMatch("Validation error");
      })
      .catch((err) => {
        throw err
      })
  });
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
        expect(res.body.msg).toMatch("User logged");
        token = res.body.result
      })
      .catch((err) => {
        throw err
      })
  })

  it('should throw error because the email is invalid', async () => {
    await request(app)
      .post('/api/users/login')
      .send({
        email: 'johndoewrong@gmail.com',
        password: 'johnDoePassword',
      })
      .expect(400)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
        expect(res.body.msg).toMatch("Invalid email or password");
      })
      .catch((err) => {
        throw err
      })
  })

  it('should throw error because the password is incorrect', async () => {
    await request(app)
      .post('/api/users/login')
      .send({
        email: 'johndoe@gmail.com',
        password: 'johnDoeWrongPassword',
      })
      .expect(400)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
        expect(res.body.msg).toMatch("Invalid email or password");
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
      .set({ Authorization: `Bearer ${token}` })
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
        expect(res.body.msg).toMatch("User founded");
      })
      .catch((err) => {
        throw err
      })
  })

  it('should throw error because the jwt token is invalid', async () => {
    await request(app)
      .get('/api/users')
      .expect(401)
      .set({ Authorization: `Bearer ${token}+1` })
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
        expect(res.body.msg).toMatch("Invalid token");
      })
      .catch((err) => {
        throw err
      })
  })

  it('should throw error because the jwt token doesn\'t exist', async () => {
    await request(app)
      .get('/api/users')
      .expect(401)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
        expect(res.body.msg).toMatch("No token");
      })
      .catch((err) => {
        throw err
      })
  })
})

describe('PUT /api/users/', () => {
  it('should update the user name', async () => {
    await request(app)
      .put('/api/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: 'Jane Doe',
      })
      .expect(200)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
        expect(res.body.msg).toMatch("User updated");
      })
      .catch((err) => {
        throw err
      })
  })

  it('should update the email', async () => {
    await request(app)
      .put('/api/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        email: 'janedoe@gmail.com',
      })
      .expect(200)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
        expect(res.body.msg).toMatch("User updated");
      })
      .catch((err) => {
        throw err
      })
  })

  it('should update the pasword', async () => {
    await request(app)
      .put('/api/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        password: 'janeDoePassword',
      })
      .expect(200)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
        expect(res.body.msg).toMatch("User updated");
      })
      .catch((err) => {
        throw err
      })
  })

  // create user for email checking
  it('should register a new user', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'Jane Doe',
        email: 'janedoe@mail.com',
        password: 'janeDoePassword',
      })
      .expect(200)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
        expect(res.body.msg).toMatch("User created");
      })
      .catch((err) => {
        throw err
      })
  })

  it('should throw error because the email already exists', async () => {
    await request(app)
      .put('/api/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        email: 'janedoe@mail.com',
      })
      .expect(400)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
        expect(res.body.msg).toMatch("Invalid email or password");
        token = res.body.result
      })
      .catch((err) => {
        throw err
      })
  })
})

describe('DELETE /api/users/', () => {
  // login so it will load the token again
  it('should login the user', async () => {
    await request(app)
      .post('/api/users/login')
      .send({
        email: 'janedoe@gmail.com',
        password: 'janeDoePassword',
      })
      .expect(200)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
        expect(res.body.msg).toMatch("User logged");
        token = res.body.result
      })
      .catch((err) => {
        throw err
      })
  })

  it('should delete the user', async () => {
    await request(app)
      .delete('/api/users')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', true)
        expect(res.body.msg).toMatch("User deleted");
      })
      .catch((err) => {
        throw err
      })
  })

  it('should throw error because the jwt token doesn\'t exist', async () => {
    await request(app)
      .delete('/api/users')
      .expect(401)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
        expect(res.body.msg).toMatch("No token");
      })
      .catch((err) => {
        throw err
      })
  })

  it('should throw error because the jwt token is invalid', async () => {
    await request(app)
      .delete('/api/users')
      .set({ Authorization: `Bearer ${token}+1` })
      .expect(401)
      .then(async (res) => {
        expect(res.body).toHaveProperty('ok', false)
        expect(res.body.msg).toMatch("Invalid token");
      })
      .catch((err) => {
        throw err
      })
  })
})
