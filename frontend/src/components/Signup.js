import React, { useState } from 'react'
import axios from 'axios'

const Signup = (props) => {


  const [formData, updateFromData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    isLandlord: false,
    locationCoords: ''
  })

  const inputFields = ['username', 'email', 'password', 'passwordConfirmation', 'locationCoords']

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

    axios.post('api/register', formData)
      .then(resp => {
        const message = resp.data
        if (!message.errors) {
          props.history.push('/login')
          console.log(resp.data)
        }
        console.log(resp.data)
      })
  }

  return <div>
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



}

export default Signup