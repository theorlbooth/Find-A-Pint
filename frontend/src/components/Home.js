import React, { useEffect, useState, useRef, useCallback } from 'react'
import ReactMapGL, { Marker, Popup, GeolocateControl, Layer, Source } from 'react-map-gl'
import axios from 'axios'

const Home = () => {

  const [pubList, getPubList] = useState([])

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


  return <div
    style={{ display: "flex", marginLeft: "25%", marginTop: '5%' }}
  >

    <div class="tile is-ancestor">
      <div class="tile is-vertical is-8">
        <div class="tile">
          <div class="tile is-parent is-vertical">
            <article class="tile is-child notification is-dark">
              <p class="title">Search...</p>
              <p class="subtitle">Top tile</p>
            </article>
            <article class="tile is-child notification is-dark">
              <p class="title">Hello gal</p>
              <p class="subtitle">Bottom tile</p>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child notification is-dark">
              <p class="title">Map</p>
              <p class="subtitle">Static Map</p>
              <ReactMapGL
                ref={mapRef}
                {...viewport}
                mapStyle='mapbox://styles/adwam12/ckhewfl88137g19rzckkwjfv0'
                mapboxApiAccessToken='pk.eyJ1IjoiYWR3YW0xMiIsImEiOiJja2hlc3Rvbm8wNTd5MzBtMnh4d3I3ODR3In0.-MLW5F1IEhhA-2jgTww4_w'
                onViewportChange={handleViewportChange}
              >

              </ReactMapGL>
            </article>
          </div>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child notification is-danger">
            <p class="title">Wide tile</p>
            <p class="subtitle">Aligned with the right tile</p>
            <div class="content">

            </div>
          </article>
        </div>
      </div>

    </div>

  </div>
}

export default Home