const express = require('express')
const expressServer = express()
const { port } = require('./config/environment')
require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Router = require('./router')

// For environment variables
console.log(process.env.hello)


mongoose.connect(
  'mongodb://localhost/pubsdb',
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) console.log(err)
    else console.log('Mongoose connected')
  }
)

expressServer.use((req, res, next) => {
  console.log(`Incoming request, ${req.method} to ${req.url}`)
  next()
})

expressServer.use(bodyParser.json())

expressServer.use('/api', Router)

expressServer.listen(port)
