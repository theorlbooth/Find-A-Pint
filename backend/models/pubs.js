const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
})

const schema = new mongoose.Schema({

  alias: { type: String, required: true, unique: true },
  name: { type: String },
  imageUrl: { type: String },
  phoneNumber: { type: String },
  address: { type: Object },
  coordinates: { type: Object },
  photos: { type: [String] },
  price: { type: String },
  openingHours: { type: String },
  transaction: { type: [String] },
  takeAway: { type: Boolean },
  outdoorSeating: { type: Boolean },
  heating: { type: Boolean },
  liveMusic: { type: Boolean },
  owner: { type: mongoose.Schema.ObjectId, ref: 'user' },
  reviewed: { type: Boolean },
  comments: [ commentSchema ],
  subscribers: { type: mongoose.Schema.ObjectId, ref: 'user' }
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('pubs', schema)