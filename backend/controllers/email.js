const Users = require('../models/users')
const mailgun = require('mailgun-js')
const DOMAIN = 'leejburgess.co.uk'



function sendVer(req, res) {
  const id = req.params.userId

  Users
    .findById(id)
    .then(user => {
      if (!user) return res.send({
        message: 'No user found'
      })

      const data = {
        from: 'FindaPint <lee@leejburgess.co.uk>',
        to: `${user.email}`,
        subject: 'Verify Email',
        html: `To verify email please follow this link 
        <a href="http://localhost:8001/email/ver/${user._id}'>
        Click here to add your email address to a mailing list</a>'`
      }
      mg.messages().send(data, function (error, body) {
        return res.send(body)
      })
    })

}


function confirmVer(req, res) {
  const id = req.params.userId

  Users
    .findById(id)
    .then(user => {
      if (!user) return res.send({
        message: 'No user found'
      })

      if (user.isEmailConfirmed === true) return res.status(401).send({
        message: 'Email already confirmed'
      })

      user.isEmailConfirmed = true

      user.save()
    })
    .then(user => res.send(user))
}

module.exports = {
  sendVer,
  confirmVer
}