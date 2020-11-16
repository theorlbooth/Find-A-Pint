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
  const [friends, updateFriends] = useState([])
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
        const data = resp.data
        updateUser(data)
        updateFromData(data)
        if (data._id === getUserId()) {
          updateThisUser(true)
          console.log('true')
        }
      })

  }, [])


  useEffect(() => {
    axios.get(`/api/users/${id}/requests`)
      .then(resp => {
        const data = resp.data
        updateFriends(data)
        console.log(data.friends)
        data.friends.map((friends) => {
          if (friends._id === getUserId()) {
            updateIsFriends(true)
          }
        })

        if (data.requests.includes(getUserId())) {
          updateRequested(true)
        }
      })
  }, [accept])




  //! Friend Request & Add

  function addFriend(event) {
    event.preventDefault()
    const token = localStorage.getItem('token')
    axios.post(`/api/users/${id}`, '', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        console.log(resp.data)
        updateRequested(...accept, true)
      })
  }

  function acceptRequest(requestId) {
    const token = localStorage.getItem('token')
    axios.post(`/api/users/${id}/requests/${requestId}`, '', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        console.log(resp.data)
        updateAccept(true)
      })
  }

  //! Edit Page: 

  function editTrue() {
    updateEdit(true)
  }

  const inputFields = ['username', 'email', 'locationCoords']

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
      <h3>{user.locationCoords}</h3>
      {thisUser ? <button onClick={editTrue}>Edit</button> : null}
      {!thisUser && !isFriends && !requested ? <button onClick={addFriend}>Add Friend</button> : null}
      {requested ? <button disabled>Requested</button> : null}
      <div>
        <div>
          <h1>Friends</h1>
          {friends.friends.map((friend, index) => {
            return <div key={index}>
              <h3>Name: {friend.username}</h3>
            </div>
          })}

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
        {user.ownedPubs.map((pub, index) => {
          return <Link to={`/pubs/${pub._id}`} key={index}>
            <div>
              <h1>{pub.alias}</h1>
              <h1>{pub.name}</h1>
            </div>
          </Link>
        })}
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