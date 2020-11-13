import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Loader from './Loader'

const singlePub = (props) => {

  const [singlePub, updateSinglePub] = useState([])
  const id = props.match.params.id


  useEffect(() => {
    axios.get(`/api/pub/${id}`)
      .then(resp => {
        updateSinglePub(resp.data)
        console.log(resp.data)
      })
  }, [])


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

  if (singlePub.address === undefined) {
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
        <div>
          <p className="description">Description</p>
        </div>
        <div>
          <div className="weather">Weather</div>
        </div>
      </div>
      <div className="single-right-side">
        <div className="subscribe-button">
          <button>Subscribe</button>
        </div>
        <div className="single-map">Map</div>
        <div className="comments">
          <textarea placeholder="Comments written here"></textarea>
          <div>Display Comments</div>
        </div>
      </div>
    </div>


  </>
}
export default singlePub