const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')


describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(helper.listWithBlogs)
    })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.listWithBlogs.length)
  })

  test('returned blogs have id field', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.filter(blog => blog.id !== undefined))
      .toHaveLength(helper.listWithBlogs.length)
  })

  describe('addition of a new note', () => {

    test('a valid note can be added ', async () => {
      const newBlog = helper.listWithOneBlog[0]

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.listWithBlogs.length + 1)
    })

    test('if likes field is not provided, it is set to 0', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://example.com/blog'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      const addedBlog = response.body.find(blog => blog.title === 'Test Blog')

      expect(addedBlog.likes).toBeDefined()
      expect(addedBlog.likes).toBe(0)
    })

    test('if title and url are missing, respond with status 400', async () => {
      const newBlog = {
        author: 'Test Author',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })
  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.listWithBlogs.length - 1
      )

      const titles = blogsAtEnd.map(r => r.title)

      expect(titles).not.toContain(blogToDelete.title)
    })
  })
  describe('updating a blog', () => {
    test('updating likes of a blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedLikes = blogToUpdate.likes + 1

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: updatedLikes })
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

      expect(updatedBlog.likes).toBe(updatedLikes)
    })

    test('updating likes of a non-existing blog', async () => {
      const nonExistingId = await helper.nonExistingId()

      await api
        .put(`/api/blogs/${nonExistingId}`)
        .send({ likes: 10 })
        .expect(404)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})

//npm test -- tests/blog_api.test.js