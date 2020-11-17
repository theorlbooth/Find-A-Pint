import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Link, withRouter } from 'react-router-dom'
import ReactMapGL, { Marker, Popup, GeolocateControl, Layer, Source } from 'react-map-gl'
import axios from 'axios'
import Geocoder from 'react-map-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import * as turf from '@turf/turf'


let radius = 5

const DisplayMap = () => {

  const [pubList, getPubList] = useState([])

  const [selectedPub, setSelectedPub] = useState(null)

  const [showPopup, setPopup] = useState(true)

  const [filteredPubList, setFilteredPubList] = useState([])

  const [proxCoords, setProxCoords] = useState([-0.0083677, 51.5721642])

  const [rangeval, setRangeval] = useState(null)

  const [showRadius, shouldShowRadius] = useState(true)

  const [circleState, updateCircle] = useState(true)

  const [isVenn, setVenn] = useState(true)

  const [friendCoords, setFriendCoords] = useState([-0.1347, 51.5186])



  function measure(lat1, lon1, lat2, lon2) {
    var R = 6378.137 // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c
    return d // km float
  }

  const [viewport, setViewport] = useState({
    latitude: 51.5721642,
    longitude: -0.0083677,
    width: '100vw',
    height: '90vh',
    zoom: 10
  })

  const geolocateStyle = {
    float: 'right',
    margin: '50px',
    padding: '10px'

  }

  const geocoderStyle = {
    float: 'center',
    position: 'top-left'
  }


  useEffect(() => {
    axios.get('/api/pub')
      .then(axiosResp => {
        getPubList(axiosResp.data)
        setFilteredPubList(axiosResp.data)
      })
  }, [])

  // useEffect(() => {
  //   setFilteredPubList(pubList)
  //   // console.log('Original', pubList)
  //   // console.log('filt', filteredPubList)
  // }, [pubList])

  useEffect(() => {
    if (showRadius) {
      shouldShowRadius(false)
    } else {
      shouldShowRadius(true)
    }
    updateCircle(false)
  }, [circleState])

  useEffect(() => {

    // console.log('Check')
    // console.log('IN USE EFFECT', proxCoords)
    {
      if (!isVenn) {
        setFilteredPubList(pubList.filter(elem => {
          if (Number(measure(proxCoords[1], proxCoords[0], elem.coordinates.latitude, elem.coordinates.longitude)) < radius) {
            // console.log(elem.name)
            return true
          }
        }))
      } else {
        setFilteredPubList(pubList.filter(elem => {
          if (Number(measure(proxCoords[1], proxCoords[0], elem.coordinates.latitude, elem.coordinates.longitude)) < radius) {
            // console.log(elem.name)
            if (Number(measure(friendCoords[1], friendCoords[0], elem.coordinates.latitude, elem.coordinates.longitude)) < radius) {
              return true
            }
          }

        }))
      }
    }
    // console.log('check', filteredPubList)
  }, [proxCoords[1], proxCoords[0], circleState])


  const mapRef = useRef()

  const handleViewportChange = useCallback(
    (newViewport) => {
      setViewport(newViewport)

    },
    []
  )


  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 }

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
      })
    },
    [handleViewportChange]
  )


  let circ = turf.circle(proxCoords, 5, { steps: 100, units: 'kilometers' })
  let circ2 = turf.circle(proxCoords, 5, { steps: 100, units: 'kilometers' })
  if (radius) {
    circ = turf.circle(proxCoords, radius, { steps: 100, units: 'kilometers' })
    circ2 = turf.circle(friendCoords, radius, { steps: 100, units: 'kilometers' })
  }

  const geocoderContainerRef = useRef()


  return <section>
    <div
      className='FriendList'
      ref={geocoderContainerRef}
    >

      <p style={{ backgroundColor: 'whitesmoke' }}>FRIEND TEST               <button onClick={() => {
        updateCircle(true)
        setVenn(!isVenn)
      }}>Venn Toggle</button></p>
      <h1 style={{ backgroundColor: 'rgba(255, 255, 255, 0.712)', marginTop: '5px' }} onClick={() => { setFriendCoords([-0.16114632548925634, 51.592644530921795]), updateCircle(true) }}>Friend Number 1</h1>
      <h1 style={{ backgroundColor: 'rgba(255, 255, 255, 0.712)', marginTop: '5px' }} onClick={() => { setFriendCoords([-0.10484139384928298, 51.627610411834105]), updateCircle(true) }}>Friend Number 2</h1>
      <h1 style={{ backgroundColor: 'rgba(255, 255, 255, 0.712)', marginTop: '5px' }} onClick={() => { setFriendCoords([-0.0676, 51.4895]), updateCircle(true) }}>Friend Number 3</h1>

    </div>

    <input type='range' className='custom-range' min='1' max='20' defaultValue='5' step='0.25'
      ref={geocoderContainerRef}
      style={{ left: '27%', top: '17%', zIndex: 1, position: 'absolute', width: '545px', height: '25px', appearance: 'none' }}

      onChange={(event) => {
        setRangeval(event.target.value)
        radius = rangeval
        updateCircle(true)
      }} />
    <h1 style={{ position: 'absolute', zIndex: 1, left: '27%', top: '20%' }}>Current Range: {radius} KM</h1>

    {/* <div
        ref={geocoderContainerRef}
        style={{ position: 'absolute', zIndex: 1, height: '450px' }}
      /> */}
    <ReactMapGL
      ref={mapRef}
      {...viewport}
      mapStyle='mapbox://styles/adwam12/ckhewfl88137g19rzckkwjfv0'

      mapboxApiAccessToken='pk.eyJ1IjoiYWR3YW0xMiIsImEiOiJja2hlc3Rvbm8wNTd5MzBtMnh4d3I3ODR3In0.-MLW5F1IEhhA-2jgTww4_w'
      onViewportChange={handleViewportChange}
    >

      <Source id='CircleRadius1' type='geojson' data={circ} />
      <Source id='CircleRadius2' type='geojson' data={circ2} />
      {showRadius ? (
        <Layer
          id='CircleRadius1'
          type='line'
          source='CircleRadius1'
          layout={{
            'line-join': 'round',
            'line-cap': 'round'
          }}
          paint={{
            'line-color': '#94ccdc',
            'line-width': 4
          }}
        />

      ) : null}
      {showRadius && isVenn ? (
        <Layer
          id='CircleRadius2'
          type='line'
          source='CircleRadius2'
          layout={{
            'line-join': 'round',
            'line-cap': 'round'
          }}
          paint={{
            'line-color': '#32a852',
            'line-width': 4
          }}
        />

      ) : null}


      <GeolocateControl
        style={geolocateStyle}
        positionOptions={{ enableHighAccuracy: false }}
        trackUserLocation={true}
        onGeolocate={() => {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
              console.log(position, position.coords.longitude);
              if (position.coords.latitude) {
                setProxCoords([position.coords.longitude, position.coords.latitude])
              }
            });
          } else {
            console.log('err')
          }

        }
        }

      />

      {filteredPubList.map((pub, index) => {
        {/* {console.log(pub)} */ }
        return <Marker latitude={pub.coordinates.latitude} longitude={pub.coordinates.longitude} key={index} offsetLeft={-25} offsetTop={-25}>
          {/* {console.log('pubs: ', pub.coordinates.latitude)} */}
          <div>
            <button className='marker-btn' onClick={(e) => {
              e.preventDefault()
              setPopup(true)
              setSelectedPub(pub)
            }}>
              <img src='https://img.icons8.com/cotton/2x/beer-glass.png' className='BeerIcon' />
            </button>
          </div>
        </Marker>
      })}

      {/* <Source id='dot' type='geojson' data={data} />
            <Layer
        id='dot'
        type='point'
        source='dot'


      /> */}
      {/* <Marker latitude={proxCoords[1]} longitude={proxCoords[0]}>
        <h1 style={{ fontWeight: '900' }}>X</h1>
      </Marker> */}
      {selectedPub && showPopup ? (
        <Popup
          latitude={selectedPub.coordinates.latitude}
          longitude={selectedPub.coordinates.longitude}
          offsetTop={-30}
          onClose={() => setPopup(false)}
          closeOnClick={false} >
          <div>
            <Link to={`${selectedPub._id}`}>
              <h2>{selectedPub.name}</h2>
              <p>{selectedPub.address.address1}</p>
              <p>{measure(proxCoords[1], proxCoords[0], selectedPub.coordinates.latitude, selectedPub.coordinates.longitude).toString().split('.')[0]}km
              {measure(proxCoords[1], proxCoords[0], selectedPub.coordinates.latitude, selectedPub.coordinates.longitude).toString().split('.')[1].substring(0, 3)}m</p>

            </Link>
          </div>

        </Popup>
      ) : null}

      <Geocoder
        {...geocoderStyle}
        mapRef={mapRef}
        // placeholder={'Search'}
        // clearOnBlur={true}
        clearAndBlurOnEsc={true}
        captureDrag={true}
        closeOnClick={true}
        collapsed={true}
        inputValue={''}
        onResult={({ result }) => {


          setProxCoords(result.geometry.coordinates)

        }

        }
        onViewportChange={handleGeocoderViewportChange}
        mapboxApiAccessToken='pk.eyJ1IjoiYWR3YW0xMiIsImEiOiJja2hlc3Rvbm8wNTd5MzBtMnh4d3I3ODR3In0.-MLW5F1IEhhA-2jgTww4_w'
      />


      <button className='clearFilter'
        style={{ position: 'absolute', left: '65%', top: '9.9%', height: '25px' }}
        onClick={() => {
          setFilteredPubList(pubList)

        }}>Clear Filter</button>


    </ReactMapGL>

  </section>
}


const Maps = () => {

  return <section>
    <div id='maps'>

      <DisplayMap></DisplayMap>


    </div>
  </section>
}

export default Maps
