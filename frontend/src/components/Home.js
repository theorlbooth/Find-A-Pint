import React, { useEffect, useState, useRef, useCallback } from 'react'
import ReactMapGL, { Marker, Popup, GeolocateControl, Layer, Source } from 'react-map-gl'
import axios from 'axios'

const Home = () => {

  const [pubList, getPubList] = useState([])
  const [users, updateUsers] = useState([])
  const [filterText, updateFilterText] = useState('')

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
            <article className="tile is-child notification is-dark">
              <p className="title">Search...</p>
              <p className="subtitle">Top tile</p>
            </article>
            <article className="tile is-child notification is-dark">
              <p className="title">Hello gal</p>
              <p className="subtitle">Bottom tile</p>
            </article>
          </div>
          <div className="tile is-parent">
            <article className="tile is-child notification is-dark">
              <p className="title">Map</p>
              <p className="subtitle">Static Map</p>
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
        <div className="tile is-parent">
          <article className="tile is-child notification is-danger">
            <p className="title">User Search</p>
            <input
              className="subtitle"
              onChange={(event) => updateFilterText(event.target.value)}
              value={filterText}
            />
            {filterUsers().map((user, index) => {

              return <div key={index} className="tile is-child notification is-dark">
                <h3>{user.username}</h3>

              </div>
            })}


            <div className="content">

            </div>
          </article>
        </div>
      </div>

    </div>

  </div>
}

export default Home