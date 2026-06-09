const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://example.com/dijkstra',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'https://example.com/canonical-string-reduction',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'https://example.com/first-class-tests',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'https://example.com/tdd-harms-architecture',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'https://example.com/type-wars',
    likes: 2,
  },
]

const initialUsers = [
  {
    username: 'root',
    name: 'Root User',
    password: 'secret',
  },
  {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen',
  },
]

const createUser = async ({ username, name, password }) => {
  const passwordHash = await bcrypt.hash(password, 10)
  return new User({ username, name, passwordHash }).save()
}

const initializeUsers = async () => {
  await User.deleteMany({})
  const users = []

  for (const user of initialUsers) {
    users.push(await createUser(user))
  }

  return users
}

const initializeBlogs = async user => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map(blog => new Blog({
    ...blog,
    user: user._id,
  }))

  const savedBlogs = await Promise.all(blogObjects.map(blog => blog.save()))
  user.blogs = savedBlogs.map(blog => blog._id)
  await user.save()

  return savedBlogs
}

const nonExistingId = async () => {
  const user = await User.findOne({})
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'temporary',
    url: 'https://example.com/remove',
    likes: 0,
    user: user._id,
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  createUser,
  initializeUsers,
  initializeBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
