import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Modal from 'react-modal'
import Loader from './Loader'

const Signup = (props) => {

  const [loading, updateLoading] = useState(false)
  const [formData, updateFromData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    isLandlord: false,
    address: '',
    postcode: ''
  })

  const [errors, updateErrors] = useState({
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

    const newErrors = {
      ...errors,
      [name]: ''
    }

    updateFromData(data)
    updateErrors(newErrors)
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
            if (message.errors) {
              updateErrors(resp.data.errors)
              console.log(resp.data.errors)
              return
            }
            const logIn = {
              email: finaldata.email,
              password: finaldata.password
            }
            updateLoading(true)
            axios.post('api/login', logIn)
              .then(resp => {
                const token = resp.data.token
                console.log(name)
                localStorage.setItem('token', token)
                updateFromData('')
              })
            const id = message._id
            axios.get(`api/email/ver/${id}`)
              .then(resp => {
                const data = resp.data
                console.log(data)
                updateLoading(false)
                openVerModal()
              })
          })
      })
  }

  // ! Modal ------------
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    },
    overlay: {
      zIndex: 1000
    }
  }

  Modal.setAppElement('#root')

  const [verModalIsOpen, setVerIsOpen] = useState(false)


  function openVerModal() {
    setVerIsOpen(true)
  }



  return <div>

    <Modal isOpen={verModalIsOpen} style={customStyles} contentLabel="Ver Modal">
      <p>Email verification: please check your email to confirm </p>
      <div className="modal-buttons">
        <Link to={'/'}><button>ok</button></Link>
      </div>
    </Modal>


    {loading ? <div><Loader /></div> : <form onSubmit={handleSubmit}>
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
          {errors[field] && <p style={{ color: 'red' }}>
            {`Incorrect ${errors[field].path}`}</p>}
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
    </form>}


  </div>
}

export default Signup