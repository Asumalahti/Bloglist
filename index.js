const mongoose = require('mongoose')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
require('dotenv').config();

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB')
    })

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})