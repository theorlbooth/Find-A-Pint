const Users = require('../models/users')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/environment')
const users = require('../models/users')

function createUser(req, res) {
  const body = req.body
  Users
    .create(body)
    .then(user => {
      res.send(user)
    })
    .catch(error => res.send(error))
}

function loginUser(req, res) {
  Users
    .findOne({ email: req.body.email })
    .then(user => {
      console.log(req.body.password)
      if (!user) return res.status(404).send({ message: 'Not found' })
      if (!user.validatePassword(req.body.password)) {
        return res.status(401).send({ message: 'Unauthorized1' })
      }

      const token = jwt.sign(
        { sub: user.id },
        secret,
        { expiresIn: '12h' }
      )
      const username = user.username
      res.status(202).send({ token, username, message: 'login successful' })
    })
    .catch(error => res.send(error))
}

function findUsers(req, res) {
  users.find()
    .populate('ownedPubs')
    .then(users => res.send(users))
    .catch(error => res.send(error))
}


function findUser(req, res) {
  Users
    .findById(req.params.userId)
    .populate('ownedPubs')
    .then(user => res.send(user))
    .catch(error => res.send(error))
}

function editUser(req, res) {
  const id = req.params.userId
  const body = req.body
  const currentUser = req.currentUser

  Users
    .findById(id)
    .then(user => {
      if (!user) return res.send({
        message: 'No user Found'
      })
      if (!user._id.equals(currentUser._id)) {
        return res.status(401).send({
          message: 'Unauthorized'
        })
      }
      user.set(body)
      return user.save()
    })
    .then(user => res.send(user))
    .catch(error => res.send(error))
}


function deleteUser(req, res) {
  const currentUser = req.currentUser
  Users
    .findById(req.params.userId)
    .then(user => {
      if (!req.currentUser.isAdmin && !user._id.equals(currentUser._id)) {
        return res.status(401).send({
          message: 'Unauthorized'
        })
      }
      user.deleteOne()
      res.send(user)
    })
    .catch(error => res.send(error))
}

function sendRequest(req, res) {
  const currentUser = req.currentUser
  Users
    .findById(req.params.userId)
    .then(recipient => {
      Users
        .findById(currentUser._id)
        .then(user => {
          if (recipient.friends.requests.indexOf(user._id) !== -1 && 
          recipient.friends.requests.indexOf(user._id) !== -1) {
            return res.status(401).send({
              message: 'Friend request already sent'
            })
          }
          recipient.friends.requests.push(user._id)
          user.friends.pending.push(recipient._id)
          return user.save(), recipient.save()
        })
        .then(user => res.send(user))
    })
}

function getRequest(req, res) {
  Users
    .findById(req.params.userId)
    .populate('friends.friends')
    .populate('friends.requests')
    .then(user => res.send(user.friends))
    .catch(error => res.send(error))
}

function acceptRequest(req, res) {
  Users
    .findById(req.params.userId)
    .then(user => {
      const index = user.friends.requests.indexOf(`${req.params.requestId}`)
      if (index === -1) {
        return res.status(404).send({
          message: 'Not found'
        })
      }
      user.friends.requests.splice(index, 1)
      user.friends.friends.push(req.params.requestId)
      Users
        .findById(req.params.requestId)
        .then(sender => {
          const indexR = sender.friends.pending.indexOf(`${req.params.userId}`)
          sender.friends.pending.splice(indexR, 1)
          sender.friends.friends.push(req.params.userId)
          return user.save(), sender.save()
        })
        .then(res.send(user.friends))
    })

}

module.exports = {
  createUser,
  loginUser,
  findUser,
  findUsers,
  deleteUser,
  editUser,
  sendRequest,
  getRequest,
  acceptRequest
}