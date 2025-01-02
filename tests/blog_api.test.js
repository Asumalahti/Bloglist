const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert');
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        "_id": "677646232fefaeaca84a6bea",
        "title": "First Blog",
        "author": "John Doe",
        "url": "http://example.com",
        "likes": 5,
        "__v": 0
      },
      {
        "_id": "6776647671e7488b064c6fc0",
        "title": "Testi Blog",
        "author": "Matti Virtanen",
        "url": "http://example.com",
        "likes": 7,
        "__v": 0
      }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})


test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, initialBlogs.length)
  })
  