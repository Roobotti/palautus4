const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes=0 } = request.body

  const user = request.user

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  const user = request.user

  const blog = await Blog.findById(id)

  if (user.id.toString() === blog.user.toString()) {
    await Blog.findByIdAndRemove(id)
    response.status(204).end()
  } else response.status(401).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const { title, author, url, likes } = request.body

  const updatedBlog = {
    title,
    author,
    url,
    likes,
  }

  const blog = await Blog.findByIdAndUpdate(id, updatedBlog)
  if (!blog) return response.status(404).json({ error: 'Blog not found' })

  return response.json(blog)
})

module.exports = blogsRouter