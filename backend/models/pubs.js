const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  flagged: { type: Boolean },
  user: { type: mongoose.Schema.ObjectId, ref: 'Users', required: true }
}, {
  timestamps: true
})

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  flagged: { type: Boolean },
  user: { type: mongoose.Schema.ObjectId, ref: 'Users', required: true },
  replies: [ replySchema ]
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
  landlordName: { type: String },
  photos: { type: [String] },
  price: { type: String },
  openingHours: { type: String },
  transaction: { type: [String] },
  takeAway: { type: Boolean },
  outdoorSeating: { type: Boolean },
  heating: { type: Boolean },
  liveMusic: { type: Boolean },
  liveSport: { type: Boolean },
  description: { type: String },
  reviewed: { type: Boolean },
  comments: [ commentSchema ],
  subscribers: { type: mongoose.Schema.ObjectId, ref: 'Users' },
  user: { type: mongoose.Schema.ObjectId, ref: 'Users', required: true }  
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('pubs', schema)