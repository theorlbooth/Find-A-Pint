import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Loader from './Loader'

const User = (props) => {

  const [edit, updateEdit] = useState(false)
  const [user, updateUser] = useState([])
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
        updateUser(resp.data)
        updateFromData(resp.data)
      })
  }, [])

  function editTrue() {
    updateEdit(true)
  }


  const inputFields = ['username', 'email', 'locationCoords', 'password', 'passwordConfirmation']

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
    console.log('hell')
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


  if (!user.username) {
    return <Loader />
  }

  return <div>
    <div>
      <h1>{user.username}</h1>
      <h2>{user.email}</h2>
      <h3>{user.locationCoords}</h3>
      <button onClick={editTrue}>Edit</button>
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