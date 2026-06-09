const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)
let rootUser

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const users = await helper.initializeUsers()
  rootUser = users[0]
  await helper.initializeBlogs(rootUser)
})

describe('viewing users', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('users contain blogs they have created', async () => {
    const response = await api.get('/api/users')
    const root = response.body.find(user => user.username === 'root')

    assert(root)
    assert.strictEqual(root.blogs.length, helper.initialBlogs.length)
    assert(root.blogs[0].title)
  })

  test('password hashes are not returned', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body[0].passwordHash, undefined)
  })
})

describe('creation of a new user', () => {
  test('succeeds with a fresh username and valid password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'nikola',
      name: 'Nikola Srbinoski',
      password: 'password123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('created user response does not contain passwordHash', async () => {
    const newUser = {
      username: 'nopasshash',
      name: 'No Password Hash',
      password: 'password123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    assert.strictEqual(response.body.passwordHash, undefined)
  })

  test('fails with status 400 if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Missing Username',
      password: 'password123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('username'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with status 400 if username is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ni',
      name: 'Too Short Username',
      password: 'password123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('username'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with status 400 if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'nopassword',
      name: 'No Password',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('password'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with status 400 if password is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'shortpassword',
      name: 'Short Password',
      password: 'pw',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('password'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with status 400 if username is not unique', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Duplicate Root',
      password: 'password123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('login', () => {
  test('succeeds with correct credentials', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(response.body.token)
    assert.strictEqual(response.body.username, 'root')
    assert.strictEqual(response.body.name, 'Root User')
    assert(response.body.id)
  })

  test('fails with status 401 if password is incorrect', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'wrong' })
      .expect(401)

    assert(response.body.error.includes('invalid'))
  })

  test('fails with status 401 if user does not exist', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'missing', password: 'secret' })
      .expect(401)

    assert(response.body.error.includes('invalid'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
