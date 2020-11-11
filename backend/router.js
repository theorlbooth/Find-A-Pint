const express = require('express')
const router = express.Router()
const pubController = require('./controllers/pub')
const userController = require('./controllers/user')
const secureRoute = require('./middleware/secureRoute')

router.route('/pub')
  .get(pubController.getPub)
  .post(secureRoute, pubController.addPub)


router.route('/pub/:name')
  .get(pubController.singlePub)
  .delete(secureRoute, pubController.removePub)
  .put(secureRoute, pubController.updatePub)


router.route('/register')
  .post(userController.createUser)

router.route('/login')
  .post(userController.loginUser)

router.route('/pubs/:pubId/comments')
  .post(secureRoute, pubController.createComment)

router.route('/pubs/:pubId/comments/:commentId')
  .put(secureRoute, pubController.updateComment)
  .delete(secureRoute, pubController.deleteComment)

module.exports = router