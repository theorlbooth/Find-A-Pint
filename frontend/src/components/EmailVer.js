import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Loader from 'react-spinners/CircleLoader'


const EmailVer = (props) => {
  const id = props.match.params.id
  const [resp, updateResp] = useState({})
  const [error, updateError] = useState(false)
  console.log(props)

  useEffect(() => {
    axios.get(`/api/email/conf/${id}`)
      .then(resp => {
        console.log(resp)
        updateResp(resp)
      }
      ).catch(error => {
        console.log(error)
        updateError(true)
      })
  }, [])

  if (!resp) return <Loader />


  return <div>
    <h1>Verification</h1>
    {!error ? <div>
      <h2>Verification Confirmed!</h2>
      <Link to={'/'}>Return home</Link>
    </div> : <h2>Verification Failed!</h2>}
  </div>
}

export default EmailVer