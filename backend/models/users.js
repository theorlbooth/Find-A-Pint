const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const mongooseHidden = require('mongoose-hidden')
const uniqueValidator = require('mongoose-unique-validator')
const validator = require('validator')

const schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, validate: [ validator.isEmail, 'Invalid email!'] },
  password: { type: String, required: true },
  isLandlord: { type: Boolean },
  isAdmin: { type: Boolean },
  ownedPubs: [{ type: mongoose.Schema.ObjectId, ref: 'pubs' }],
  subscribedPubs: [{ type: mongoose.Schema.ObjectId, ref: 'pubs' }],
  isEmailConfirmed: { type: Boolean },
  locationCoords: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  friends: {
    requests: [String],
    pending: [String],
    friends: [String]
  }
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
    if (this.isModified('password') && this.password !== this._passwordConfirmation) {
      this.invalidate('passwordConfirmation', 'should match password')
    }
    next()
  })


schema
  .pre('save', function hashPassword(next) {
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
    }
    next()
  })

schema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('Users', schema)