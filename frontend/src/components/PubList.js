import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Toggle from 'react-toggle'

import Loader from './Loader'
import examplePubs from './ExamplePubList'

const PubList = () => {

  const [pubsList, updatePubList] = useState([])

  const [takeAwayTog, updateTakeAwayTog] = useState(false)
  const [outdoorSeatingTog, updateOutdoorSeatingTog] = useState(false)
  const [heatingTog, updateHeatingTog] = useState(false)
  const [liveMusicTog, updateLiveMusicTog] = useState(false)
  const [liveSportTog, updateLiveSportTog] = useState(false)


  function checkForImage(pub) {
    if (pub.imageUrl === '') {
      return 'https://images.unsplash.com/photo-1586993451228-09818021e309?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80'
    }
    return pub.imageUrl
  }

  // ! Function to check when user changes location but not to send until Enter is hit or button is pressed 
  // ! Props will need to be passed through from home page
  // function checkEnter(event) {
  //   const key = event.keyCode
  //   if (key === 13) {
  //     if (event.target.vaue === '') {
  //       props.updateLocation()
  //     } else {
  //       props.updateLocation(event.taget.value)
  //     }
  //   }
  // }
  // ! Add to input:
  // onKeyDown={event => checkEnter(event)}


  function filterPubs(pubsList) {
    let filteredReview
    let filteredPubsA
    let filteredPubsB
    let filteredPubsC
    let filteredPubsD
    let filteredPubsE

    const filters = [takeAwayTog, outdoorSeatingTog, heatingTog, liveMusicTog, liveSportTog]

    filteredReview = pubsList.filter(pub => {
      return pub.reviewed === true
    })

    if (filters[0] === false) {
      filteredPubsA = filteredReview
    } else {
      filteredPubsA = filteredReview.filter(pub => {
        return pub.takeAway === true
      })
    }
    if (filters[1] === false) {
      filteredPubsB = filteredPubsA
    } else {
      filteredPubsB = filteredPubsA.filter(pub => {
        return pub.outdoorSeating === true
      })
    }
    if (filters[2] === false) {
      filteredPubsC = filteredPubsB
    } else {
      filteredPubsC = filteredPubsB.filter(pub => {
        return pub.heating === true
      })
    }
    if (filters[3] === false) {
      filteredPubsD = filteredPubsC
    } else {
      filteredPubsD = filteredPubsC.filter(pub => {
        return pub.liveMusic === true
      })
    }
    if (filters[4] === false) {
      filteredPubsE = filteredPubsD
    } else {
      filteredPubsE = filteredPubsD.filter(pub => {
        return pub.liveSport === true
      })
    }
    return filteredPubsE
  }


  useEffect(() => {
    axios.get('/api/pub')
      .then(resp => {
        updatePubList(resp.data)
        console.log(resp.data)
      })
  }, [])

  if (pubsList === undefined) {
    return <>
      <Loader />
    </>
  }

  return <>
    <div className="pubs-page">
      <div className="filter">
        <div className="search">
          <input placeholder="user-input-coordinates"></input>
          <button>New Location</button>
        </div>
        <div className="toggles">
          <div>
            <Toggle id="take-away-toggle" className="react-toggle" defaultChecked={false} onChange={(event) => updateTakeAwayTog(event.target.checked)} />
            <label htmlFor="take-away-toggle">Take Away</label>
          </div>
          <div>
            <Toggle id="outdoor-seating-toggle" className="react-toggle" defaultChecked={false} onChange={(event) => updateOutdoorSeatingTog(event.target.checked)} />
            <label htmlFor="outdoor-seating-toggle">Outdoor Seating</label>
          </div>
          <div>
            <Toggle id="heating-toggle" className="react-toggle" defaultChecked={false} onChange={(event) => updateHeatingTog(event.target.checked)} />
            <label htmlFor="heating-toggle">Heating</label>
          </div>
          <div>
            <Toggle id="live-music-toggle" className="react-toggle" defaultChecked={false} onChange={(event) => updateLiveMusicTog(event.target.checked)} />
            <label htmlFor="live-music-toggle">Live Music</label>
          </div>
          <div>
            <Toggle id="live-sport-toggle" className="react-toggle" defaultChecked={false} onChange={(event) => updateLiveSportTog(event.target.checked)} />
            <label htmlFor="live-sport-toggle">Live Sport</label>
          </div>
        </div>
      </div>
      <div className="search-results">
        <div className="columns is-multiline is-mobile">
          {filterPubs(pubsList).map((pub, index) => {
            return <div className="column is-2-desktop is-6-tablet is-12-mobile" key={index}>
              <Link to={`pubs/${pub._id}`}>
                <div className="card">
                  <div className="card-image">
                    <figure className="image is-square">
                      <img src={checkForImage(pub)} alt={pub.name} />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="media-content">
                      <h2 className="title is-5">{pub.name}</h2>
                      <p className="subtitle is-6">{pub.address.address1}, {pub.address.zip_code}</p>
                      <p className="subtitle is-6">Distance from:</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          })}
        </div>
      </div>
    </div>
  </>

}

export default PubList