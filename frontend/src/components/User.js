import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { getUserId, isVerified } from '../lib/auth'
import Loader from './Loader'



const User = (props) => {

  const [edit, updateEdit] = useState(false)
  const [accept, updateAccept] = useState(false)
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
  console.log('hi')
  useEffect(() => {
    axios.get(`/api/users/${id}`)
      .then(resp => {
        const userData = resp.data
        updateUser(userData)
        updateFromData(userData)
        if (userData._id === getUserId()) {
          updateThisUser(true)
        }
        if (userData._id !== getUserId()) {
          updateThisUser(false)
        }

        axios.get(`/api/users/${id}/requests`)
          .then(resp => {
            const Frienddata = resp.data
            updateFriends(Frienddata)
            if (Frienddata.requests.includes(getUserId())) {
              updateRequested(true)
            }
            Frienddata.friends.map((friends) => {
              if (friends._id === getUserId()) {
                updateIsFriends(true)
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
  }, [accept, id])



  //! Check for Image

  function checkForImage(pub) {
    if (pub.imageUrl === '') {
      return 'https://images.unsplash.com/photo-1586993451228-09818021e309?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80'
    }
    return pub.imageUrl
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
        updateAccept(false)
        updateEdit(false)

      })
  }

  console.log(friends.requests)
  if (!user.username || !friends.friends) {
    return <Loader />
  }


  return <div className='container is-widescreen'>
    <div>
      <section className='hero mt-5 mb-2' style={{ border: '5px solid hsl(0, 0%, 96%)', borderRadius: '5px' }}>
        <div className='hero-body'>
          <div className='container'>
            {thisUser ? <h2 className="subtitle is-3 has-text-white has-text-centered">Your Account</h2> : <h2 className="subtitle is-3 has-text-white has-text-centered">{user.username}&apos;s Account</h2>}
            <h1 className='title has-text-white'>{user.username}</h1>
            <h2 className='subtitle has-text-white'>{user.email}</h2>
            {thisUser ? <button className="button is-white is-outlined" onClick={editTrue}>Edit</button> : null}

            {!thisUser && !isFriends && !requested && isVerified(user) ? <button className="button is-black is-inverted is-outlined" onClick={addFriend}>Add Friend</button> : null}
            {requested ? <button className="button is-primary" disabled>Requested</button> : null}
          </div>
        </div>
      </section>
      <div>
        <div>


          <section className='hero is-light p-1 my-5'>
          </section>

          <section>
            <div className='container'>
              <h2 className="subtitle is-3 has-text-white has-text-centered">Friends</h2>
              <div className="columns is-multiline is-mobile">
                {distFriends.map((user, index) => {
                  return <div className="column is-2-desktop is-6-tablet is-12-mobile" key={index}>
                    <Link to={`/users/${user._id}`}>
                      <div className="card">
                        <div className="card-content">
                          <div className="media-content">
                            <h2 className="title is-5 is-1-mobile">{user.username}</h2>
                            <p className="subtitle is-6">{user.email}</p>
                            <p className="subtitle is-6 has-text-link">{user.distance} Minutes Away From You</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                })}
              </div>
            </div>
          </section>

          <section className='hero is-light p-1 my-5'>
          </section>

          <section>
            <div className='container'>
              {thisUser && (friends.requests[0]) ? <div>
                <h2 className="subtitle is-3  has-text-white has-text-centered">Requests</h2>
                {friends.requests.map((requests, index) => {
                  return <div className="column is-2-desktop is-6-tablet is-12-mobile" key={index}>

                    <div className="card">
                      <div className="card-content">
                        <div className="media-content">
                          <Link to={`/users/${requests._id}`}>
                            <h2 className="title is-5 is-1-mobile">{requests.username}</h2>
                          </Link>
                          <button className='button is-primary mt-2' onClick={() => acceptRequest(requests._id)}>Accept</button>
                        </div>
                      </div>
                    </div>

                  </div>
                })}
                <section className='hero is-light p-1 my-5'>
                </section>
              </div> : null}
            </div>
          </section>

        </div>


        {user.isLandlord ? <section className='mb-5'>
          <div className='container'>
            <h2 className="subtitle is-3 has-text-white has-text-centered">Owned Pubs</h2>
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
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                })}
              </div>
            </div>
          </div>
        </section> : null}


      </div>
    </div>
    {
      edit ? <div className='container'>
        <section className='hero is-danger p-1 my-5'>
        </section>
        <section className='p-3 mb-5'>
          <form onSubmit={handleSubmit}>
            <h2 className="subtitle is-3 has-text-white has-text-centered">Edit Profile</h2>
            {inputFields.map((field, index) => {
              return <div className='field' key={index}>
                <label className='label has-text-white'>{field}</label>
                <input
                  className='input is-small'
                  type='text'
                  onChange={handleChange}
                  value={formData[field]}
                  name={field}
                />
              </div>
            })}
            <label className='label has-text-white'>
              Are you a Landlord?
          </label>
            <div className='control'>
              <div className='select is-small'>
                <select name="isLandlord" onChange={handleLandlord} defaultValue={formData.isLandlord}>
                  <option value={false}>false</option>
                  <option value={true}>true</option>
                </select>
              </div>

            </div>
            <div className='control'>
              <button className='button is-danger mt-2'>submit</button>
            </div>
          </form>
        </section>

      </div>
        : null
    }

  </div >



}

export default User