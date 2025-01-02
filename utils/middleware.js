const errorHandler = (error, req, res, next) => {
    console.error(error)
    res.status(500).send({ error: 'Something not working' })
  }
  
  module.exports = { errorHandler }