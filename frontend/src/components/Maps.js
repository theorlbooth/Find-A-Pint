import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Link, withRouter } from 'react-router-dom'
import ReactMapGL, { Marker, Popup, GeolocateControl, Layer, SVGOverlay, Source } from 'react-map-gl'
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

  // console.log(proxCoords)

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
  // var center = [-75.343, 39.984];
  // var radius = 5;
  // var options = {steps: 10, units: 'kilometers', properties: {foo: 'bar'}};
  // var circle = turf.circle(center, radius, options);

  // var addToMap = [turf.point(center), circle]
  // // // console.log(circle([-0.10484139384928298, 51.627610411834105],5))

  // feature < import('@turf/turf').Polygon >
  // turf.circle([-0.10484139384928298, 51.627610411834105],5, {steps: 10, units: 'kilometers', properties: {foo: 'bar'}})



  // mapRef = React.createRef()


  useEffect(() => {
    axios.get('/api/pub')
      .then(axiosResp => {
        getPubList(axiosResp.data)
        setFilteredPubList(axiosResp.data)
      })
  }, [])

  // useEffect(() => {
  //   setFilteredPubList(pubList)
  //   // console.log("Original", pubList)
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

    // console.log("Check")
    // console.log("IN USE EFFECT", proxCoords)
    setFilteredPubList(pubList.filter(elem => {
      if (Number(measure(proxCoords[1], proxCoords[0], elem.coordinates.latitude, elem.coordinates.longitude).toString().split('.')[0]) < radius) {
        console.log(elem.name)
        return true
      }
    }))
    // console.log("check", filteredPubList)
  }, [proxCoords[1], proxCoords[0], circleState])


  const mapRef = useRef()

  const handleViewportChange = useCallback(
    (newViewport) => {
      setViewport(newViewport)

    },
    []
  )


  // const layer = new GeoJsonLayer({

  //   id: "jjj",// an unique identified generated inside react-map-gl-draw library
  //   geometry: {
  //     coordinates: [[-0.10484139384928298, 51.627610411834105], [-0.16114632548925634, 51.627610411834105], [-0.16114632548925634, 51.592644530921795], [-0.10484139384928298, 51.592644530921795], [-0.10484139384928298, 51.627610411834105]], // latitude longitude pairs of the geometry points
  //     type: "Polygon" // geojson type, one of `Point`, `LineString`, or `Polygon`
  //   },
  //   properties: {
  //     renderType: "Polygon" // Mainly used for styling, one of `Point`, `LineString`, `Polygon`, or `Rectangle`. Different from `geometry.type`. i.e. a rectangle's renderType is `Rectangle`, and `geometry.type` is `Polygon`. An incomplete (not closed) Polygon's renderType is `Polygon`, `geometry.type` is `LineString` // other properties user passed in
  //   }

  // })
  // console.log(layer)
  // console.log(mapStyle)

  // function redraw({ project }) {
  //   const [cx, cy] = project([-0.10484139384928298, 51.627610411834105]);
  //   return <circle cx={cx} cy={cy} r={25} fill="blue" />;
  // }

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 }

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
      })
    },
    []
  )

  const data = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        proxCoords
      ]
    }
  };

  const circ = turf.circle(proxCoords, radius, { steps: 100, units: 'kilometers' })

  // const circleCenter = turf.circle(proxCoords, 0.05)

  return <section>


    <ReactMapGL
      ref={mapRef}
      {...viewport}
      mapStyle='mapbox://styles/adwam12/ckhewfl88137g19rzckkwjfv0'

      mapboxApiAccessToken="pk.eyJ1IjoiYWR3YW0xMiIsImEiOiJja2hlc3Rvbm8wNTd5MzBtMnh4d3I3ODR3In0.-MLW5F1IEhhA-2jgTww4_w"
      onViewportChange={handleViewportChange}
    >

      <Source id='route' type='geojson' data={circ} />
      {showRadius ? (
        <Layer
          id='route'
          type='line'
          source='route'
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

      {/* <DeckGL
      
      layers={[layer]}
        viewState={viewport}

        
      /> */}
      {/* <Editor
        // to make the lines/vertices easier to interact with
        clickRadius={12}

        mode={new CirclRadius()}
        featureStyle={({ CirclRadius, state }) => {
          console.log(CirclRadius)
          return {
            stroke: 'rgb(38, 181, 242)',
            fill: 'rgb(189,189,189, 0.5)'
          }


        }}
      />; */}
      <input type="range" className="custom-range" min="1" max="50" defaultValue="5"
        onChange={(event) => {
          setRangeval(event.target.value)
          radius = rangeval
        }} />

      <GeolocateControl
        style={geolocateStyle}
        positionOptions={{ enableHighAccuracy: false }}
        trackUserLocation={true}
      />

      {filteredPubList.map((pub, index) => {
        {/* {console.log(pub)} */ }
        return <Marker latitude={pub.coordinates.latitude} longitude={pub.coordinates.longitude} key={index}>
          {/* {console.log('pubs: ', pub.coordinates.latitude)} */}
          <button className="marker-btn" onClick={(e) => {
            e.preventDefault()
            setPopup(true)
            setSelectedPub(pub)
          }}>
            <img src="https://img.icons8.com/cotton/2x/beer-glass.png" className="BeerIcon" />
          </button>
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
              <p>{measure(proxCoords[1], proxCoords[0], selectedPub.coordinates.latitude, selectedPub.coordinates.longitude).toString().split('.')[0]}km {measure(proxCoords[1], proxCoords[0], selectedPub.coordinates.latitude, selectedPub.coordinates.longitude).toString().split('.')[1].substring(0, 3)}m</p>

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
        onResult={({ result }) => {
          setProxCoords(result.geometry.coordinates)
        }
        }
        onViewportChange={handleGeocoderViewportChange}
        mapboxApiAccessToken='pk.eyJ1IjoiYWR3YW0xMiIsImEiOiJja2hlc3Rvbm8wNTd5MzBtMnh4d3I3ODR3In0.-MLW5F1IEhhA-2jgTww4_w'
      />
      <button
        onClick={() => { setFilteredPubList(pubList) }}>Clear Filter</button>
      <h1>Current Range: {radius} KM</h1>

      <button onClick={() => {
        if (radius > 1) {
          radius -= 1
          updateCircle(true)
        }
      }}>Radius -1</button>
      <button onClick={() => {
        radius += 1
        console.log(viewport.latitude)
        updateCircle(true)
        console.log(data)

      }}>Radius +1</button>
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



