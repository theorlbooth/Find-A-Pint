const mongoose = require('mongoose')
const pubs = require('./models/pubs')
const users = require('./models/users')
const axios = require('axios')


mongoose.connect(
  'mongodb://localhost/pubsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  (err) => {
    if (err) return console.log(err)
    console.log('Mongoose connected!')
    mongoose.connection.db.dropDatabase()
      .then(() => {
        return users.create([{
          username: 'theo',
          email: 'theorlbooth@googlemail.com',
          name: 'Theo Booth',
          password: 'password',
          passwordConfirmation: 'password',
          isLandlord: false,
          isAdmin: true,
          // ownedPubs: [],
          // subscribedPubs: [],
          isEmailConfirmed: true,
          locationCoords: ''
        },
        {
          username: 'lee',
          email: 'lee.j.burgess@gmail.com',
          name: 'Lee Burgess',
          password: 'password',
          passwordConfirmation: 'password',
          isLandlord: false,
          isAdmin: true,
          // ownedPubs: [],
          // subscribedPubs: [],
          isEmailConfirmed: true,
          locationCoords: ''
        },
        {
          username: 'adam',
          email: 'adam@adam.com',
          name: 'Adam Osgood',
          password: 'password',
          passwordConfirmation: 'password',
          isLandlord: false,
          isAdmin: true,
          // ownedPubs: [],
          // subscribedPubs: [],
          isEmailConfirmed: true,
          locationCoords: ''
        }
        ])
      })
      .then(users => {
        console.log(`${users.length} users have been created!`)
        return users
      })
      .then((users) => {
        const promises = []
        const originalPubIDs = ['XroPH96BT4X2zmCX8bvSmg', 'Oo4Hcw5ReDHZ3C40l8AYlA', 'ELAlTCTL7Q6vMkmtn3w0SA', 'V1LvEwooJkj7ml7D25HKeg', 'i3dITn98pvwx1LILKlfeNg', 'ALrFfRFJOmPMqAKkCsDryQ', 'vCpDm3FJ2CH-CJCbrkWaug', 'Y0CzqNjUyfqfiF44c_dQhQ', 'PQSwt7wMh8D1e-MBPtKCgw', 'Xp13yTaOt73FyDcB6MYe4w']

        for (let i = 0; i < originalPubIDs.length; i++) {
          const timeoutInterval = 500 * i
          promises.push(new Promise((resolve) => {
            setTimeout(() => {
              axios.get(`https://api.yelp.com/v3/businesses/${originalPubIDs[i]}`, {
                headers: {
                  Authorization: 'Bearer qBGO6ikkjFcn7jHOP3Ok8gp3sILXemkrbarX-ILin_ONdCcbXPo9JTsNwpehRgo-bDUNxj1aEuuZGMU472wSoFb2SYSeh4tKmPB0JuT5uk0pBxWRX1HMiHX9D7yrX3Yx'
                }
              })
                .then(({ data }) => {
                  const pub = {
                    alias: data.alias,
                    name: data.name,
                    imageUrl: data.image_url,
                    phoneNumber: data.phone,
                    address: data.location,
                    coordinates: data.coordinates,
                    photos: data.photos,
                    price: data.price,
                    reviewed: true,
                    // openingHours: data.hours.open,
                    transaction: data.transaction,
                    owners: users[0]
                  }
                  resolve(pub)
                })
            }, timeoutInterval)
          }))
        }
        return Promise.all(promises)
      })
      .then((pubData) => {
        return pubs.create(pubData)
      })
      .then(pubs => {
        console.log(`${pubs.length} pubs have been created!`)
      })
      .then(err => {
        console.log(err)
      })
      .finally(() => {
        mongoose.connection.close()
      })
  }
)