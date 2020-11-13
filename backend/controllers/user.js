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
      if (!user) return res.status(404).send({ message: 'Not found' })
      if (!user.validatePassword(req.body.password)) {
        return res.status(401).send({ message: 'Unauthorized' })
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
    .then(users => res.send(users))
    .catch(error => res.send(error))
}


function findUser(req, res) {
  Users
    .findById(req.params.userId)
    .then(user => res.send(user))
    .catch(error => res.send(error))
}

function  editUser(req,res){
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

module.exports = {
  createUser,
  loginUser,
  findUser,
  findUsers,
  deleteUser,
  editUser
}