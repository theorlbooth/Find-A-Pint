import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Loader from 'react-spinners/CircleLoader'

const EmailSend = (props) => {
  const [singlePub, updateSinglePub] = useState([])
  const [subscribers, updateSubscribers] = useState([])
  const id = props.match.params.id

  useEffect(() => {
    axios.get(`/api/pub/${id}`)
      .then(resp => {
        updateSinglePub(resp.data)
      }, [])

    axios.get(`/api/pub/${id}/subscribers`)
      .then(resp => {
        updateSubscribers(resp.data)
      })
  }, [])

  const [message, updateMessage] = useState({
    from: `FindaPint - ${singlePub.name} <lee@leejburgess.co.uk>`,
    to: `${singlePub.subscribers}`,
    subject: '',
    html: ''
  })

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value

    const data = {
      ...message,
      [name]: value
    }
    updateMessage(data)
  }

  function sendEmail(event) {
    event.preventDefault()
    const token = localStorage.getItem('token')
    subscribers.map((user) => {
      const msg = {
        from: `FindaPint - ${singlePub.name} <lee@leejburgess.co.uk>`,
        to: `${user.email}`,
        subject: message.subject,
        html: message.subject
      }

      console.log(msg)
      axios.post('/api/email/note/send', msg, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(resp => {
          console.log(resp)

        })

    })
    return
  }

  if (!subscribers[0]) {
    return <h1>You have no subscribers</h1>
  }

  return <div>
    <h1>New note from {singlePub.name} </h1>


    <form onSubmit={sendEmail}>
      <div>
        <label>Subject</label>
        <input
          type='text'
          onChange={handleChange}
          value={message.subject}
          name='subject'
        />
      </div>
      <div>
        <label>Message</label>
        <div>
          <textarea
            type='textarea'
            onChange={handleChange}
            value={message.html}
            name='html'
          />
        </div>
      </div>
      <button>Send</button>
    </form>

    <div>
      {subscribers.map((user, index) => {
        return <div key={index}>
          <h1>{user.username}</h1>
        </div>
      })}
    </div>
  </div>
}

export default EmailSend