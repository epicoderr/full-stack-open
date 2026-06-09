const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

const populateUser = { username: 1, name: 1 }

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', populateUser)
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const { title, author, url, likes } = request.body

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
    comments: [],
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', populateUser)
  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(403).json({ error: 'only creator can delete blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  await User.findByIdAndUpdate(request.user._id, { $pull: { blogs: blog._id } })

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.likes = likes

  const updatedBlog = await blog.save()
  const populatedBlog = await updatedBlog.populate('user', populateUser)

  response.json(populatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body

  if (!comment) {
    return response.status(400).json({ error: 'comment missing' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.comments = blog.comments.concat(comment)

  const updatedBlog = await blog.save()
  const populatedBlog = await updatedBlog.populate('user', populateUser)

  response.status(201).json(populatedBlog)
})

module.exports = blogsRouter
