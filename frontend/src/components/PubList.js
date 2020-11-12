import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import Loader from './Loader'

const PubList = () => {

  const [pubsList, updatePubList] = useState([])


  useEffect(() => {
    axios.get('/api/pub')
      .then(resp => {
        updatePubList(resp.data)
      })
  }, [])

  if (pubsList === undefined) {
    return <>
      <Loader />
    </>
  }

  return <>
    {pubsList.map((pub, index) => {
      return <div key={index}>
        <Link to={`pub/${pub._id}`}>
          <img src={pub.imageUrl} />
          <h2>{pub.name}</h2>
          <p>{pub.address.address1}, {pub.address.zip_code}</p>
          <p>Distance from:</p>
        </Link>
      </div>
    })}

  </>

}

export default PubList