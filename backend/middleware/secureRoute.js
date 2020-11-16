const User = require('../models/users')
const jwt = require('jsonwebtoken')
const {
  secret
} = require('../config/environment')

function secureRoute(req, res, next) {
  const authToken = req.headers.authorization
  if (!authToken || !authToken.startsWith('Bearer')) {
    return res.status(401).send({
      message: 'Unauthorized no token'
    })
  }
  const token = authToken.replace('Bearer ', '')

  jwt.verify(token, secret, (err, payload) => {

    if (err) return res.status(401).send({
      message: 'Unauthorized Outdated'
    })

    const userId = payload.sub

    User
      .findById(userId)
      .then(user => {
        if (!user) return res.status(401).send({
          message: 'Unauthorized'
        })

        req.currentUser = user

        next()
      })
      .catch(() => res.status(401).send({
        message: 'Unauthorized'
      }))

  })
}

module.exports = secureRoute