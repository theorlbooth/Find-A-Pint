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


  return <div className='container has-text-centered mt-5 mb-5'>
    <h1 className='title has-text-white'>Verification</h1>
    {!error ? <div>
      <h2 className='subtitle is-2 has-text-white'>Verification Confirmed!</h2>
      <Link className='button is-large is-white is-outlined' to={'/'}>Return home</Link>
    </div> : <h2 className='subtitle is-2 has-text-white'>Verification Failed!</h2>}
  </div>
}

export default EmailVer