const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const flashcardSetsRouter = require('./controllers/flashcardSets')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const path = require("node:path");

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose
    .connect(config.MONGODB_URI, { family: 4 })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((err) => {
        logger.error('error connecting to MongoDB', err.message)
    })

app.use(express.static('dist'))

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/flashcardsets', flashcardSetsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.get('*splat', (req, res) => {
    res.sendFile(path.join(__dirname,'dist', 'index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app