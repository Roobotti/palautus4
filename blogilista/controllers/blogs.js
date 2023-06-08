const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
    const { title, author, url, likes=0 } = request.body

    if (!title || !url) {
      return response.status(400).json({ error: 'Title and URL are required' })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes
    })

    const result = await blog.save()
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
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