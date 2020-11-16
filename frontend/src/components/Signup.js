import React, { useState } from 'react'
import axios from 'axios'

const Signup = (props) => {


  const [formData, updateFromData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    isLandlord: false,
    address: '',
    postcode: ''
  })

  const inputFields = ['username', 'email', 'password', 'passwordConfirmation', 'address', 'postcode']

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value

    const data = {
      ...formData,
      [name]: value
    }
    console.log(data)
    updateFromData(data)
  }

  function handleLandlord(event) {
    const value = event.target.value
    const data = {
      ...formData,
      isLandlord: value
    }
    console.log(data)
    updateFromData(data)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const toURI = encodeURI(formData.address + ' ' + formData.postcode + '' + 'uk')
    const url = `https://api.opencagedata.com/geocode/v1/json?key=9c8531b6642b43319982489fb18739ab&q=${toURI}&pretty=1`

    axios.get(url)
      .then(resp => {
        const geo = resp.data.results[0].geometry
        const finaldata = {
          ...formData,
          locationCoords: {
            latitude: geo.lat,
            longitude: geo.lng
          }
        }

        axios.post('api/register', finaldata)
          .then(resp => {
            const message = resp.data
            if (!message.errors) {
              props.history.push('/login')
              console.log(resp.data)
            }
            console.log(resp.data)
          })
      })
  }

  return <div>
    <form onSubmit={handleSubmit}>
      <h1>Create account</h1>
      {inputFields.map((field, index) => {
        return <div key={index}>
          <label>{field}</label>
          <input
            type={field === 'password' || field === 'passwordConfirmation' ? 'password' : 'text'}
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