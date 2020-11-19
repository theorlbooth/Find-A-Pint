
require('dotenv').config()
const sgMail = require('@sendgrid/mail')
console.log(process.env.sendgirdapikey)

const msg = {
  to: 'lee.j.burgess77@gmail.com', // Change to your recipient
  from: 'FindaPint <lee@leejburgess.co.uk>', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>'
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })