import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Login = (props) => {


  const [formData, updateFromData] = useState({
    email: '',
    password: ''
  })

  const [error, updateError] = useState('')

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value

    const data = {
      ...formData,
      [name]: value
    }
    updateError('')
    updateFromData(data)
  }

  function handleSubmit(event) {

    event.preventDefault()

    axios.post('/api/login', formData)
      .then(resp => {
        const token = resp.data.token
        if (token === undefined) {
          updateError(resp.data.message)
        } else {
          console.log(name)
          localStorage.setItem('token', token)
        }
        if (token) {
          props.history.push('/')
        }
      })

  }


  return <div id='login'>

    <form onSubmit={handleSubmit} style={{ marginLeft: "30%", marginRight: "30%" }}>
      <div className='is-title'>
      </div>
      <div>
        <label>email</label>
        <input
          className="input"
          type='text'
          onChange={handleChange}
          value={formData.email}
          name='email'
          style={{ minWidth: '500px', marginBottom: '10px' }}
        />
      </div>

      <div>
        <label>password</label>
        <input
          className="input"
          type='password'
          onChange={handleChange}
          value={formData.password}
          name='password'
          style={{ minWidth: '500px', marginBottom: '10px' }}
        />
        {error && <p style={{ color: 'red' }}>
          {error}</p>}
      </div>
      <button className="button">Login</button>
    </form>
    <Link className="button is-danger" style={{ marginTop: '30px' }} to={'/signup'}>Create account</Link>
  </div>
}

export default Login