const Blog = require("../models/blog");

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

  const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
  };
    

module.exports = { initialBlogs, blogsInDb};