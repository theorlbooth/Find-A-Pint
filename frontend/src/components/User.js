import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { getUserId } from '../lib/auth'
import Loader from './Loader'



const User = (props) => {

  const [edit, updateEdit] = useState(false)
  const [accept, updateAccept] = useState([])
  const [user, updateUser] = useState([])
  const [thisUser, updateThisUser] = useState(false)
  const [isFriends, updateIsFriends] = useState(false)
  const [requested, updateRequested] = useState(false)
  const [friends, updateFriends] = useState(false)
  const [distFriends, updateDistFriends] = useState([])
  const [formData, updateFromData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    isLandlord: false,
    locationCoords: ''
  })
  const id = props.match.params.id

  useEffect(() => {
    axios.get(`/api/users/${id}`)
      .then(resp => {
        const userData = resp.data
        updateUser(userData)
        updateFromData(userData)
        if (userData._id === getUserId()) {
          updateThisUser(true)
        }


        axios.get(`/api/users/${id}/requests`)
          .then(resp => {
            const Frienddata = resp.data
            updateFriends(Frienddata)
            Frienddata.friends.map((friends) => {
              if (friends._id === getUserId()) {
                updateIsFriends(true)
              }
              if (Frienddata.requests.includes(getUserId())) {
                updateRequested(true)
              }
            })
            const promises = []
            for (let i = 0; i < Frienddata.friends.length; i++) {
              const timeoutInterval = 0 * i
              promises.push(new Promise((resolve) => {
                setTimeout(() => {
                  const userLat = userData.locationCoords.latitude
                  const userLong = userData.locationCoords.longitude
                  const friendLat = Frienddata.friends[i].locationCoords.latitude
                  const friendLong = Frienddata.friends[i].locationCoords.longitude
                  const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${userLong},${userLat};${friendLong},${friendLat}?access_token=pk.eyJ1IjoibGVlYjc3IiwiYSI6ImNraGtxamJqejE5ajYycnA2OGRudTU4dDYifQ.cAbyHCrLprcFj7T0TK4V8g`

                  axios.get(url)
                    .then(resp => {
                      const data = resp.data.routes[0].duration
                      const time = Math.ceil(data / 60)
                      const newFriend = {
                        ...Frienddata.friends[i],
                        distance: time
                      }
                      resolve(newFriend)
                    })
                }, timeoutInterval)

              }))
              Promise.all(promises)
                .then(finishedFriends => {
                  const data = {
                    ...distFriends,
                    finishedFriends
                  }
                  updateDistFriends(data.finishedFriends)
                })

            }

          })

      })
  }, [accept])

 



  console.log(distFriends)

  //! Check for Image

  function checkForImage(pub) {
    if (pub.imageUrl === '') {
      return 'https://images.unsplash.com/photo-1586993451228-09818021e309?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80'
    }
    return pub.imageUrl
  }

  //! Calculate Distance

  async function calcDistance(data, friend) {
    const userLat = data.locationCoords.latitude
    const userLong = data.locationCoords.longitude
    const friendLat = friend.locationCoords.latitude
    const friendLong = friend.locationCoords.longitude
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${userLong},${userLat};${friendLong},${friendLat}?access_token=pk.eyJ1IjoibGVlYjc3IiwiYSI6ImNraGtxamJqejE5ajYycnA2OGRudTU4dDYifQ.cAbyHCrLprcFj7T0TK4V8g`
    try {
      const promise = await axios.get(url)
      const data = promise.data
      const distance = data.routes[0].duration
      const time = Math.ceil(distance / 60)
      return time
    } catch (error) {
      console.error(error)
    }
  }


  //! Friend Request & Add

  function addFriend(event) {
    event.preventDefault()
    const token = localStorage.getItem('token')
    axios.post(`/api/users/${id}`, '', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        updateRequested(true)
      })
  }

  function acceptRequest(requestId) {
    const token = localStorage.getItem('token')
    axios.post(`/api/users/${id}/requests/${requestId}`, '', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {

        updateAccept(true)
      })
  }

  //! Edit Page: 

  function editTrue() {
    updateEdit(true)
  }

  const inputFields = ['username', 'email']

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const data = {
      ...formData,
      [name]: value
    }
    updateFromData(data)
  }

  function handleLandlord(event) {
    const value = event.target.value
    const data = {
      ...formData,
      isLandlord: value
    }
    updateFromData(data)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const token = localStorage.getItem('token')
    axios.put(`/api/users/${user._id}`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        const message = resp.data
        if (!message.errors) {
          console.log(resp.data)
        }
        updateUser(resp.data)
        updateEdit(false)

      })
  }


  if (!user.username || !friends.friends) {
    return <Loader />
  }


  return <div>
    <div>
      <h1>{user.username}</h1>
      <h2>{user.email}</h2>
      {thisUser ? <button onClick={editTrue}>Edit</button> : null}
      {!thisUser && !isFriends && !requested ? <button onClick={addFriend}>Add Friend</button> : null}
      {requested ? <button disabled>Requested</button> : null}
      <div>
        <div>
          <h2 className="title is-2 has-text-centered">Friends</h2>

          <div className="users-page">
            <div className="filter">
            </div>
            <div className="search-results">
              <div className="columns is-multiline is-mobile">
                {distFriends.map((user, index) => {


                  return <div className="column is-2-desktop is-6-tablet is-12-mobile" key={index}>
                    <Link to={`/users/${user._id}`}>
                      <div className="card">
                        <div className="card-content">
                          <div className="media-content">
                            <h2 className="title is-5">{user.username}</h2>
                            <p className="subtitle is-6">{user.email}</p>
                            <p className="subtitle is-6">{user.distance} Minutes Away From You</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                })}
              </div>
            </div>
          </div>

          {thisUser ? <div>
            <h1>Requests</h1>
            {friends.requests.map((requests, index) => {
              return <div key={index}>
                <h3>Name: {requests.username}</h3>
                <button onClick={() => acceptRequest(requests._id)}>Accept</button>
              </div>

            })}
          </div> : null}

        </div>
        <h2>Owned Pubs</h2>
        <div className="pubs-page">
          <div className="columns is-multiline is-mobile">
            {user.ownedPubs.map((pub, index) => {
              return <div className="column is-2-desktop is-6-tablet is-12-mobile" key={index}>
                <Link to={`pub/${pub._id}`}>
                  <div className="card">
                    <div className="card-image">
                      <figure className="image is-square">
                        <img src={checkForImage(pub)} alt={pub.name} />
                      </figure>
                    </div>
                    <div className="card-content">
                      <div className="media-content">
                        <h2 className="title is-5">{pub.name}</h2>
                        <p className="subtitle is-6">{pub.address.address1}, {pub.address.zip_code}</p>
                        <p className="subtitle is-6">Distance from:</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
    {edit ? <div>
      <form onSubmit={handleSubmit}>
        <h1>Create account</h1>
        {inputFields.map((field, index) => {
          return <div key={index}>
            <label>{field}</label>
            <input
              type='text'
              onChange={handleChange}
              value={formData[field]}
              name={field}
            />
          </div>
        })}
        <label>
          Are you a Landlord?
        </label>

        <select name="isLandlord" onChange={handleLandlord} defaultValue={false}>
          <option value={false}>false</option>
          <option value={true}>true</option>
        </select>
        <button>submit</button>
      </form>
    </div>
      : null}

  </div>



}

export default User