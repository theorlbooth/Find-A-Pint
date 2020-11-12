import React, { useState } from 'react'
import axios from 'axios'

const Login = (props) => {


  const [formData, updateFromData] = useState({
    email: '',
    password: ''
  })


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

  function handleSubmit(event) {

    event.preventDefault()

    axios.post('api/login', formData)
      .then(resp => {
        const token = resp.data.token
        console.log(name)
        localStorage.setItem('token', token)
        if (token) {
          props.history.push('/')
        }
      })

  }


  return <div id='login'>
    <h1>Login</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label>email</label>
        <input
          type='text'
          onChange={handleChange}
          value={formData.email}
          name='email'
        />
      </div>

      <div>
        <label>password</label>
        <input
          type='password'
          onChange={handleChange}
          value={formData.password}
          name='password'
        />
      </div>
      <button>Login</button>
    </form>
  </div>
}

export default Login