const {
  default: Axios
} = require('axios')
const Pubs = require('../models/pubs')
const Users = require('../models/users')
const axios = require('axios')

function getPub(req, res) {
  Pubs.find().populate('user').then(pubList => res.send(pubList))
    .catch(error => res.send(error))
}

function addPub(req, res) {
  req.body.user = req.currentUser
  const currentUser = req.currentUser
  Pubs
    .create(req.body)
    .then(pub => {
      Users
        .findById(currentUser._id)
        .then(user => {
          user.ownedPubs.push(pub._id)
          return user.save()
        })
        .then(pub => res.send(pub))
    })

    .catch(error => res.send(error))
}

function singlePub(req, res) {
  const id = req.params.pubId
  console.log(id)
  Pubs
    .findById(id)
    .populate('comments.user')
    .then(pub => res.send(pub))
    .catch(error => res.send(error))
}

function removePub(req, res) {
  const id = req.params.pubId
  const currentUser = req.currentUser
  Pubs
    .findById(id)
    .then(pub => {
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
  const id = req.params.pubId
  const body = req.body
  const currentUser = req.currentUser

  Pubs
    .findById(id)
    .then(pub => {
      console.log(pub)
      if (!pub) return res.send({
        message: 'No Pub Found'
      })
      if (!pub.user.equals(currentUser._id)) {
        return res.status(401).send({
          message: 'Unauthorized'
        })
      }
      pub.set(body)
      console.log('test')
      return pub.save()
    })
    .then(pub => res.send(pub))
    .catch(error => res.send(error))
}

function createComment(req, res) {
  const comment = req.body
  comment.user = req.currentUser
  comment.flagged = false
  Pubs
    .findById(req.params.pubId)
    .populate('comments.user')
    .then(pub => {
      if (!pub) return res.status(404).send({
        message: 'Not found'
      })
      pub.comments.push({
        $each: [comment],
        $position: 0
      })
      return pub.save()
    })
    .then(pub => res.send(pub))
    .catch(err => res.send(err))
}

function findComment(req, res) {
  Pubs
    .findById(req.params.pubId)
    .then(pub => {
      if (!pub) return res.status(404).send({
        message: 'Not found'
      })
      const comment = pub.comments.id(req.params.commentId)
      res.send(comment)
    })
    .catch(err => res.send(err))
}


function updateComment(req, res) {
  Pubs
    .findById(req.params.pubId)
    .populate('comments.user')
    .then(pub => {
      if (!pub) return res.status(404).send({
        message: 'Not found'
      })
      const comment = pub.comments.id(req.params.commentId)
      // ! - Have blanked this out for now, as we don't have an ammend comment (is it really necessary?)
      // if (!req.currentUser.isAdmin && !comment.user.equals(req.currentUser._id)) {
      //   return res.status(401).send({
      //     message: 'Unauthorized'
      //   })
      // }
      comment.set(req.body)
      return pub.save()
    })
    .then(pub => res.send(pub))
    .catch(err => res.send(err))
}


function deleteComment(req, res) {
  Pubs.findById(req.params.pubId)
    .populate('comments.user')
    .then(pub => {
      if (!pub) return res.status(404).send({
        message: 'Not found'
      })
      const comment = pub.comments.id(req.params.commentId)
      if (!req.currentUser.isAdmin && !comment.user.equals(req.currentUser._id)) {
        return res.status(401).send({
          message: 'Unauthorized'
        })
      }
      comment.remove()
      return pub.save()
    })
    .then(pub => res.send(pub))
    .catch(err => res.send(err))
}

module.exports = {
  getPub,
  addPub,
  singlePub,
  removePub,
  updatePub,
  createComment,
  updateComment,
  deleteComment,
  findComment
}