const express = require('express')
const router = express.Router()
const pubController = require('./controllers/pub')
const secureRoute = require('./middleware/secureRoute')

router.route('/pub')
  .get(pubController.getPub)
  .post(secureRoute, pubController.addPub)


router.route('/pub/:name')
  .get(pubController.singPub)


router.route('/register')


router.route('/login')