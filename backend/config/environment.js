const secret = 'This is our secret to be moved to another folder'

const port = process.env.PORT || 8000
const env = process.env.NODE_ENV || 'development'

const dbURI = env === 'production'
  ? process.env.MONGODB_URI
  : `mongodb://localhost/pubsdb-${env}`

module.exports = {
  port,
  secret,
  dbURI
}
