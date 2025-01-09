const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { tokenHelper } = require('../utils/tokenHelper');
const { errorHandler } = require('../utils/middleware')
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  .find({})
  .populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs);
  });



  blogsRouter.get('/:id', async (request, response, next) => {
    try {
      const blog = await Blog.findById(request.params.id);
  
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).send({ error: 'Blog not found' });
      }
    } catch (error) {
      next(error);
    }
  });

  blogsRouter.post('/', authenticateToken, async (request, response, next) => {
    const { title, author, url, likes } = request.body;
  
    if (!title || !url) {
      return response.status(400).json({ error: 'Title or URL is missing' });
    }
  
    try {
      const user = await User.findById(request.user.id); // User ID from token
  
      if (!user) {
        return response.status(401).json({ error: 'Invalid user' });
      }
  
      const blog = new Blog({
        title,
        author,
        url,
        likes,
        user: user._id,
      });
  
      const savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();
  
      response.status(201).json(savedBlog);
    } catch (error) {
      next(error);
    }
  });

  blogsRouter.delete('/:id', async (request, response) => {
    const { id } = request.params;
  
      const result = await Blog.findByIdAndDelete(id);
      if (!result) {
        return response.status(404).json({ error: 'Blog not found' });
      }
      response.sendStatus(204);
    })

    blogsRouter.put('/:id', async (request, response, next) => {
      try {
          const { title, author, url, likes } = request.body;
  
          const blog = {
              title,
              author,
              url,
              likes,
          };
  
          const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
          response.json(updatedBlog);
      } catch (error) {
          next(error);
      }
  });
module.exports = blogsRouter;