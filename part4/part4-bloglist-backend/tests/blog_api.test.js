const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)
let token
let otherToken
let rootUser
let otherUser

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const users = await helper.initializeUsers()
  rootUser = users[0]
  otherUser = users[1]

  await helper.initializeBlogs(rootUser)

  token = (await api
    .post('/api/login')
    .send({ username: 'root', password: 'secret' })).body.token

  otherToken = (await api
    .post('/api/login')
    .send({ username: 'mluukkai', password: 'salainen' })).body.token
})

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    assert(titles.includes('React patterns'))
  })

  test('the unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body[0].id)
    assert.strictEqual(response.body[0]._id, undefined)
  })

  test('blogs contain information about their creator', async () => {
    const response = await api.get('/api/blogs')

    assert(response.body[0].user)
    assert.strictEqual(response.body[0].user.username, rootUser.username)
    assert.strictEqual(response.body[0].user.passwordHash, undefined)
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data and token', async () => {
    const newBlog = {
      title: 'Async/await simplifies making async calls',
      author: 'Nikola Srbinoski',
      url: 'https://example.com/async-await',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes('Async/await simplifies making async calls'))
  })

  test('sets the authenticated user as creator', async () => {
    const newBlog = {
      title: 'User from token owns this blog',
      author: 'Nikola Srbinoski',
      url: 'https://example.com/user-from-token',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${otherToken}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.user.username, otherUser.username)

    const usersAtEnd = await User.find({}).populate('blogs', { title: 1 })
    const updatedOtherUser = usersAtEnd.find(user => user.username === otherUser.username)
    assert(updatedOtherUser.blogs.map(blog => blog.title).includes(newBlog.title))
  })

  test('defaults likes to zero if likes property is missing', async () => {
    const newBlog = {
      title: 'A blog with default likes',
      author: 'Nikola Srbinoski',
      url: 'https://example.com/default-likes',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('accepts likes value zero explicitly', async () => {
    const newBlog = {
      title: 'A blog with explicit zero likes',
      author: 'Nikola Srbinoski',
      url: 'https://example.com/explicit-zero',
      likes: 0,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('fails with status 400 if title is missing', async () => {
    const newBlog = {
      author: 'Nikola Srbinoski',
      url: 'https://example.com/missing-title',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status 400 if url is missing', async () => {
    const newBlog = {
      title: 'Missing url',
      author: 'Nikola Srbinoski',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status 401 if token is not provided', async () => {
    const newBlog = {
      title: 'No token blog',
      author: 'Nikola Srbinoski',
      url: 'https://example.com/no-token',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status 401 if token is invalid', async () => {
    const newBlog = {
      title: 'Bad token blog',
      author: 'Nikola Srbinoski',
      url: 'https://example.com/bad-token',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer definitely.invalid.token')
      .send(newBlog)
      .expect(401)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status 204 if the blog belongs to the authenticated user', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('also removes the deleted blog from the creator user blogs list', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const userAfterDelete = await User.findById(rootUser._id)
    assert(!userAfterDelete.blogs.map(id => id.toString()).includes(blogToDelete.id))
  })

  test('fails with status 401 if token is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status 403 if the blog belongs to another user', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status 400 if id is malformatted', async () => {
    await api
      .delete('/api/blogs/not-a-valid-id')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })

  test('fails with status 404 if blog does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${validNonExistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })
})

describe('updating a blog', () => {
  test('succeeds with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
    assert(response.body.user.username)
  })

  test('fails with status 400 if id is malformatted', async () => {
    await api
      .put('/api/blogs/not-a-valid-id')
      .send({ title: 'x', url: 'https://example.com', likes: 1 })
      .expect(400)
  })

  test('fails with status 404 if blog does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()

    await api
      .put(`/api/blogs/${validNonExistingId}`)
      .send({ title: 'x', url: 'https://example.com', likes: 1 })
      .expect(404)
  })
})

after(async () => {
  await mongoose.connection.close()
})
