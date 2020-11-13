import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import Modal from 'react-modal'
import Icon from '@mdi/react'
import { mdiFlagVariant } from '@mdi/js'


import Loader from './Loader'
import { getUserId, isCreator } from '../lib/auth'
import WeatherIcons from './WeatherIcons'
import Flag from './Flag'

const singlePub = (props) => {

  const [singlePub, updateSinglePub] = useState([])
  const [text, setText] = useState('')
  const [user, updateUser] = useState({})

  const [latLong, updateLatLong] = useState([])
  const [weatherInfo, updateWeatherInfo] = useState({})

  const id = props.match.params.id
  const token = localStorage.getItem('token')


  useEffect(() => {
    axios.get(`/api/pub/${id}`)
      .then(resp => {
        updateSinglePub(resp.data)
        console.log(resp.data)
      })
  }, [])

  useEffect(() => {
    axios.get(`/api/users/${getUserId()}`)
      .then(resp => {
        updateUser(resp.data)
        console.log(resp.data)
      })
  }, [])

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${singlePub.address.zip_code}&key=52535ae64e3048c58091a5065a58f57e`)
      updateLatLong([data.results[0].geometry.lat, data.results[0].geometry.lng])

      const { data: weatherData } = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.results[0].geometry.lat}&lon=${data.results[0].geometry.lng}&exclude=minutely,alerts&units=metric&appid=73250291b5074399963b723e7870fafa`)
      updateWeatherInfo(weatherData)
      console.log(weatherData)
    }

    fetchData()
  }, [singlePub])


  function findInfo(array) {
    const pubInfo = []

    if (array.takeAway === true) {
      pubInfo.push('Take Away')
    }
    if (array.outdoorSeating === true) {
      pubInfo.push('Outdoor Seating')
    }
    if (array.heating === true) {
      pubInfo.push('Heating')
    }
    if (array.liveMusic === true) {
      pubInfo.push('Live Music')
    }
    if (array.liveSport === true) {
      pubInfo.push('Live Sport')
    }
    return pubInfo
  }

  function handleComment() {
    if (text === '') {
      return
    } else {
      axios.post(`/api/pub/${id}/comments`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(resp => {
          setText('')
          updateSinglePub(resp.data)
        })
    }
  }

  function handleCommentDelete(commentId) {
    axios.delete(`/api/pub/${id}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        updateSinglePub(resp.data)
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
    }
  }

  const [editModalIsOpen, setEditIsOpen] = useState(false)
  const [deleteModalIsOpen, setDeleteIsOpen] = useState(false)

  function openEditModal() {
    setEditIsOpen(true)
  }

  function closeEditModal() {
    setEditIsOpen(false)
  }

  function openDeleteModal() {
    setDeleteIsOpen(true)
  }

  function closeDeleteModal() {
    setDeleteIsOpen(false)
  }

  // ! ------------



  if (singlePub.address === undefined || weatherInfo.daily === undefined) {
    return <>
      <Loader />
    </>
  }

  return <>
    <div className="single-page">
      <div className="single-left-side">
        <h1 className="name">{singlePub.name}</h1>
        <div className="address-info-times">
          <div className="address">
            <h3>{singlePub.address.address1}</h3>
            <h3>{singlePub.address.city}</h3>
            <h3>{singlePub.address.zip_code}</h3>
            <br></br>
            <h3>{singlePub.display_phone}</h3>
          </div>
          <div className="info">
            <ul>
              {findInfo(singlePub).map((item, index) => {
                return <li key={index}>{item}</li>
              })}
            </ul>
          </div>
          <div className="opening-times">
            Opening Times
          </div>
        </div>
        <div className="description">
          <p>{singlePub.description}</p>
        </div>
        <div className="weather">
          {weatherInfo.daily.map((day, index) => {
            return <section className="future-weather-day" key={index}>
              <h3>{moment.unix(day.dt).format('dddd Do MMM')}</h3>
              <img src={WeatherIcons[day.weather[0].description][0]} />
              <section>
                <p>{Math.round(day.temp.min * 10) / 10}°C - {Math.round(day.temp.max * 10) / 10}°C</p>
                <p>Wind Speed: {Math.round(day.wind_speed * 22.3694) / 10} mph</p>
              </section>
            </section>
          })}
        </div>
        <div className="edit-delete-buttons">
          {isCreator(singlePub.user, user) && <button className="edit-pub" onClick={openEditModal}>Edit Pub</button>}
          <Modal isOpen={editModalIsOpen} onRequestClose={closeEditModal} style={customStyles} contentLabel="Edit Modal">
            <p>Are you sure you want to make changes to this pub?</p>
            <div className="modal-buttons">
              <button onClick={closeEditModal}>cancel</button>
              <button>confirm</button>
            </div>
          </Modal>
          {isCreator(singlePub.user, user) && <button className="delete-pub" onClick={openDeleteModal}>Delete Pub</button>}
          <Modal isOpen={deleteModalIsOpen} onRequestClose={closeDeleteModal} style={customStyles} contentLabel="Delete Modal">
            <p>Are you sure you want to delete this pub?</p>
            <div className="modal-buttons">
              <button onClick={closeDeleteModal}>cancel</button>
              <button>confirm</button>
            </div>
          </Modal>
        </div>
      </div>
      <div className="single-right-side">
        <div className="sub-button">
          <button>Subscribe</button>
        </div>
        <div className="single-map">Map</div>

        <div className="comments-section">
          <article className="media">
            {token && <div className="media-content">
              <div className="field">
                <p className="control">
                  <textarea className="textarea" placeholder="Post a comment..." onChange={event => setText(event.target.value)} value={text}>{text}</textarea>
                </p>
              </div>
              <div className="field">
                <p className="control">
                  <button className="button is-info" onClick={handleComment}>Post</button>
                </p>
              </div>
            </div>}
          </article>

          {singlePub.comments && singlePub.comments.map((comment, index) => {
            

            return <article key={comment._id} className="media">
              <div className="media-content">
                <div className="content">
                  <div className="user-time">
                    <p className="username">
                      {comment.user.username}
                    </p>
                    <p>
                      ({moment(comment.createdAt).fromNow()})
                    </p>
                  </div>
                  <p>{comment.text}</p>
                </div>
              </div>
              <div className="media-right">
                {!isCreator(comment.user._id, user) && <Flag />}
                {isCreator(comment.user._id, user) && <button className="delete" onClick={() => handleCommentDelete(comment._id)}>
                </button>}
              </div>
            </article>
          })}
        </div>
      </div>
    </div>


  </>
}
export default singlePub