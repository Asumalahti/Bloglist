const express = require('express')
require('express-async-errors')
const cors = require('cors')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const mongoose = require("mongoose");
const app = express()
const config = require('./utils/config')
const loginRouter = require('./controllers/login')

const usersRouter = require('./controllers/users')
const { errorHandler, tokenExtractor,authenticateToken } = require('./utils/middleware')
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
app.use(cors())
app.use(express.json())
app.use(tokenExtractor);
app.use(errorHandler)

app.use('/api/blogs', blogsRouter, authenticateToken);
app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)
module.exports = app