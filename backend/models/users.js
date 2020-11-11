const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const mongooseHidden = require('mongoose-hidden')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true  },
  name: { type: String, required: true },
  password: { type: String, required: true },
  isLandlord: { type: Boolean },
  isAdmin: { type: Boolean },
  ownedPubs: { type: mongoose.Schema.ObjectId, ref: 'pubs' },
  subscribedPubs: { type: mongoose.Schema.ObjectId, ref: 'pubs' },
  isEmailConfirmed: { type: Boolean, required: true },
  locationCoords: { type: true }
})

schema.plugin(mongooseHidden({ defaultHidden: { password: true } }))

schema.plugin(uniqueValidator)


schema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })

schema
  .pre('validate', function checkPassword(next) {
    if (this.password !== this._passwordConfirmation) {
      this.invalidate('passwordConfirmation', 'should match password')
    }
    next()
  })


schema
  .pre('save', function hashPassword(next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
    next()
  })

schema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('user', schema)