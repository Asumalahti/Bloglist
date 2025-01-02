const dummy = (blogs) => {
    return 1
  }
  
 
  const favoriteBlog = (blogs) => {
        return blogs.reduce((mostLikes, blog) => {
          return blog.likes > mostLikes.likes ? blog : mostLikes;
        }, blogs[0]);
      }

  const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
      }
    
      return blogs.reduce(reducer, 0)
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }