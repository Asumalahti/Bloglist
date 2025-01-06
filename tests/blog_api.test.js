
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert');
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const { test, after, beforeEach } = require('node:test')
const helper = require("../utils/testHelper");


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('verify unique id property', async () => {
  const response = await helper.blogsInDb()
  response.forEach(blog => {
    assert.ok(blog.id, 'id should be defined')
    assert.strictEqual(blog._id, undefined, '_id should be undefined')
  });
    
  })

  test('a blog can be added', async () => {
    const newBlog = {
        "title": "Uusi blogi",
        "author": "Kikkare",
        "url": "http://example.com",
        "likes": 9,
        "__v": 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await helper.blogsInDb()
    assert.strictEqual(response.length, helper.initialBlogs.length + 1)
    })


test('verify likes defaulta value is 0', async () => {
  const newBlog = {
    "title": "Uusi blogi",
    "author": "Kikkare",
    "url": "http://example.com",
    "__v": 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await helper.blogsInDb()
    assert.strictEqual(response[2].likes, 0)
    })

        
test('there are two blogs', async () => {
    const response = await helper.blogsInDb()
  
    assert.strictEqual(response.length, helper.initialBlogs.length)
  })

  after(async () => {
    await mongoose.connection.close()
  })

  test('title or url missing, response 400', async () => {
    const newBlog = {
        "author": "Kikkare",
        "likes": 9,
        "url": "www.hilipatihippa.com",
        "__v": 0
    }
    await api
    .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      newBlog.title = 'tilititappi';
      delete newBlog.url;
      response = await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/);
          const blogsAtEnd = await helper.blogsInDb()
          assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
          
  });
  


    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const contents = blogsAtEnd.map(r => r.id)
      assert(!contents.includes(blogToDelete.id))
    })


    test('updates a blog succesfully', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
  
      const updatedData = {
        title: 'Testi päivitys',
        author: 'Päivi Päivitetty',
        url: 'http://päivitetty.com',
        likes: 69,
      };
  
      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/);
  
      assert.strictEqual(response.body.title, updatedData.title);
      assert.strictEqual(response.body.author, updatedData.author);
      assert.strictEqual(response.body.url, updatedData.url);
      assert.strictEqual(response.body.likes, updatedData.likes);
    })