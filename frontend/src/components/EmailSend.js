import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Loader from 'react-spinners/CircleLoader'

const EmailSend = (props) => {
  const [singlePub, updateSinglePub] = useState([])
  const id = props.match.params.id

  useEffect(() => {
    axios.get(`/api/pub/${id}`)
      .then(resp => {
        updateSinglePub(resp.data)
      })
  })

  const [message, updateMessage] = useState({
    from: `FindaPint - ${singlePub.name}`,
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

  return <div>
    <h1>New note from {singlePub.name} </h1>


    <form onSubmit={null}>
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
  </div>
}

export default EmailSend