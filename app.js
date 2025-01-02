const express = require('express')
const cors = require('cors')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const mongoose = require("mongoose");
const app = express()
const config = require('./utils/config')
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter);

module.exports = app