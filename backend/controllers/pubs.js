const {
  default: Axios
} = require('axios')
const Pubs = require('../models/pubs')
const axios = require('axios')

function getPub(req, res) {
  Pubs.find().populate('user').then(pubList => res.send(pubList))
    .catch(error => res.send(error))
}

function addPub(req, res) {
  req.body.user = req.currentUser
  Pubs.create(req.body).then(pub => res.send(pub))
    .catch(error => res.send(error))
}

function singlePub(req, res) {
  const name = req.params.name
  Pubs
    .findOne({
      name: {
        $regex: name,
        $options: 'i'
      }
    })
    .populate('comments.user').then(pubs => res.send(pubs))
    .catch(error => res.send(error))
}

function removePub(req, res) {
  const name = req.params.name
  const currentUser = req.currentUser
  Pubs
    .findOne({
      name: {
        $regex: name,
        $options: 'i'
      }
    }).then(pub => {
      if (!req.currentUser.isAdmin && !pub.user.equals(currentUser._id)) {
        return res.status(401).send({
          message: 'Unauthorized'
        })
      }
      pub.deleteOne()
      res.send(pub)
    })
    .catch(error => res.send(error))
}

function updatePub(req, res) {
  const name = req.params.name
  const body = req.body
  const currentUser = req.currentUser

  Pubs
    .findOne({
      name: {
        $regex: name,
        $options: 'i'
      }
    })
    .then(pub => {
      if (!pub) return res.send({
        message: 'No Pub Found'
      })
      if (!pub.user.equals(currentUser._id)) {
        return res.status(401).send({
          message: 'Unauthorized'
        })
      }
      pub.set(body)
      pub.save()
      res.send(pub)
    })
    .catch(error => res.send(error))
}

function createComment(req, res){
  const comment = req.body
  comment.user = req.currentUser
  Pubs.findById(req.params.pubId).populate('comment.user')
  .then(pub => {
    if (!pub)
  })
}

module.exports = {
  getPub,
  addPub,
  singlePub,
  removePub,
  updatePub
}