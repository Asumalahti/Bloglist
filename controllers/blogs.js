const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
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

  blogsRouter.post('/', async (request, response) => {
    const { title, url } = request.body;

    if (!title || !url) {
      return response.status(400).json({ error: 'Title or URL is missing' });
    }
  
    const blog = new Blog(request.body);

    try {
      const savedBlog = await blog.save();
      response.status(201).json(savedBlog);
    } catch (error) {
      response.status(500).json({ error: 'Failed to save the blog post' });
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