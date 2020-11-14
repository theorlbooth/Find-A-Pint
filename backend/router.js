const express = require('express')
const router = express.Router()
const pubController = require('./controllers/pubs')
const { sendRequest } = require('./controllers/user')
const userController = require('./controllers/user')
const secureRoute = require('./middleware/secureRoute')

router.route('/pub')
  .get(pubController.getPub)
  .post(secureRoute, pubController.addPub)


router.route('/pub/:pubId')
  .get(pubController.singlePub)
  .delete(secureRoute, pubController.removePub)
  .put(secureRoute, pubController.updatePub)


router.route('/register')
  .post(userController.createUser)

router.route('/login')
  .post(userController.loginUser)

router.route('/users')
  .get(userController.findUsers)

router.route('/users/:userId')
  .get(userController.findUser)
  .delete(secureRoute, userController.deleteUser)
  .put(secureRoute, userController.editUser)
  .post(secureRoute, userController.sendRequest)

router.route('/users/:userId/requests')
  .get(userController.getRequest)

router.route('/users/:userId/requests/:requestId')
  .post(secureRoute, userController.acceptRequest)

router.route('/pub/:pubId/comments')
  .post(secureRoute, pubController.createComment)

router.route('/pub/:pubId/comments/:commentId')
  .put(secureRoute, pubController.updateComment)
  .delete(secureRoute, pubController.deleteComment)
  .get(pubController.findComment)

module.exports = router