import React, { useEffect, useState, useRef, useCallback } from 'react'
import ReactMapGL, { Marker, Popup, GeolocateControl, Layer, Source } from 'react-map-gl'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { getUserId, isVerified } from '../lib/auth'

const Home = () => {

  const [pubList, getPubList] = useState([])
  const [users, updateUsers] = useState([])
  const [user, updateUser] = useState([])
  const [filterText, updateFilterText] = useState('')

  const id = getUserId()

  const [viewport, setViewport] = useState({
    latitude: 51.5721642,
    longitude: -0.0083677,
    width: '350px',
    height: '250px',
    zoom: 10
  })
  const mapRef = useRef()

  useEffect(() => {
    axios.get('/api/pub')
      .then(axiosResp => {
        getPubList(axiosResp.data)

      })
    axios.get('/api/users')
      .then(resp => {
        updateUsers(resp.data)
      })

    axios.get(`/api/users/${id}`)
      .then(resp => {
        updateUser(resp.data)
      })
  }, [])



  // useEffect(() => {
  //   setViewport({
  //     latitude: latLong[0],
  //     longitude: latLong[1],
  //     width: '350px',
  //     height: '250px',
  //     zoom: 10
  //   })

  // }, [latLong])


  const handleViewportChange = useCallback(
    (newViewport) => {
      setViewport(newViewport)

    },
    []
  )

  function filterUsers() {
    const filteredUSers = users.filter(user => {
      const userName = user.username.toLowerCase()
      const filteredText = filterText.toLowerCase()
      return userName.includes(filteredText)
    })
    return filteredUSers
  }


  return <div
    style={{ display: "flex", marginLeft: "25%", marginTop: '5%' }}
  >

    <div className="tile is-ancestor">
      <div className="tile is-vertical is-8">
        <div className="tile">
          <div className="tile is-parent is-vertical">
            <article className="tile is-child notification" style={{ display: 'flex', justifyContent: "center", alignitems: "center", border: '10px solid white', backgroundColor: "rgba(0,0,0,0.5)" }}>
              <h2 style={{ display: "flex", alignSelf: 'center', fontSize: '50px', fontWeight: '900', color: 'white' }}>PUB LIST</h2>
            </article>
            <article className="tile is-child notification is-dark" style={{ display: 'flex', justifyContent: "center", alignitems: "center", border: '10px solid white', backgroundColor: "rgba(0,0,0,0.5)" }}>
              <p style={{ display: "flex", alignSelf: 'center', fontSize: '50px', fontWeight: '900', color: 'white' }}>Login</p>
              {/* <p className="subtitle">Bottom tile</p> */}
            </article>
          </div>
          <div className="tile is-parent">
            <article className="tile is-child notification" style={{ border: '10px solid white', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <p style={{ display: "flex", alignSelf: 'center', fontSize: '50px', fontWeight: '900', color: 'white' }}>Map</p>
              <ReactMapGL
                ref={mapRef}
                {...viewport}
                mapStyle='mapbox://styles/adwam12/ckhewfl88137g19rzckkwjfv0'
                mapboxApiAccessToken={process.env.mapbox_key}
                onViewportChange={handleViewportChange}
              >

              </ReactMapGL>
            </article>
          </div>
        </div>
        {id && isVerified(user) ? <div className="tile is-parent">
          <article className="tile is-child notification" style={{ display: 'flex', justifyContent: "center", alignitems: "center", border: '10px solid white', backgroundColor: "rgba(0,0,0,0.5)", flexDirection:'column' }}>
            <p className="title" style={{ display: "flex", alignSelf: 'center', fontSize: '50px', fontWeight: '900', color: 'white' }}>User Search</p>
            <input
              className="input"
              onChange={(event) => {
                updateFilterText(event.target.value)
              }}
              value={filterText}
            ></input>
            {filterText ? <div>
              {filterUsers().map((user, index) => {
                return <div key={index} className="tile is-child notification is-dark" style={{ display: 'flex', justifyContent: "center", alignitems: "center", border: '5px solid white', backgroundColor: "rgba(0,0,0,0.5)", margin: '5px' }}>
                  <h3>{user.username}</h3>
                  <Link className='is-button' to={`/users/${user._id}`}>View Profile</Link>
                </div>
              })}
            </div> : null}


            <div className="content">

            </div>
          </article>
        </div> : null}
      </div>

    </div>

  </div>
}

export default Home