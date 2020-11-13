import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Link, withRouter } from 'react-router-dom'
import ReactMapGL, { Marker, Popup, GeolocateControl } from 'react-map-gl'
import axios from 'axios'
import Geocoder from "react-map-gl-geocoder";



const DisplayMap = () => {

  const [pubList, getPubList] = useState([])

  const [selectedPub, setSelectedPub] = useState(null)

  const [viewport, setViewport] = useState({
    latitude: 51.5721642,
    longitude: -0.0083677,
    width: "100vw",
    height: "90vh",
    zoom: 10
  })


  const geolocateStyle = {
    float: 'right',
    margin: '50px',
    padding: '10px'
  };

  // const [viewportDefault, setviewportDefault] = useState({
  //   latitude: userInput[0],
  //   longitude: userInput[1],
  //   width: "100vw",
  //   height: "100vh",
  //   zoom: 10,
  //   radiusPin: []
  // })

  // mapRef = React.createRef()


  useEffect(() => {
    axios.get('/api/pub')
      .then(axiosResp => {
        getPubList(axiosResp.data)
      })
  }, [])

  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
      });
    },
    []
  );

  return <section>
    <ReactMapGL
      ref={mapRef}
      {...viewport}
      mapStyle='mapbox://styles/adwam12/ckhewfl88137g19rzckkwjfv0'

      mapboxApiAccessToken="pk.eyJ1IjoiYWR3YW0xMiIsImEiOiJja2hlc3Rvbm8wNTd5MzBtMnh4d3I3ODR3In0.-MLW5F1IEhhA-2jgTww4_w"
      onViewportChange={handleViewportChange}
    >
      <Geocoder
        mapRef={mapRef}
        onViewportChange={handleGeocoderViewportChange}
        mapboxApiAccessToken="pk.eyJ1IjoiYWR3YW0xMiIsImEiOiJja2hlc3Rvbm8wNTd5MzBtMnh4d3I3ODR3In0.-MLW5F1IEhhA-2jgTww4_w"
        position="top-left"
      />
      <GeolocateControl
        style={geolocateStyle}
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
      />
      {pubList.map((pub, index) => {
        {/* {console.log(pub)} */ }
        return <Marker latitude={pub.coordinates.latitude} longitude={pub.coordinates.longitude} key={index}>
          <button className="marker-btn" onClick={(e) => {
            e.preventDefault();
            setSelectedPub(pub);
          }}>
            <img src="https://img.icons8.com/cotton/2x/beer-glass.png" />
          </button>
        </Marker>
      })}
      <Marker latitude={0} longitude={0}>
        <h1>HELLO</h1>
      </Marker>
      {selectedPub ? (
        <Popup latitude={selectedPub.coordinates.latitude} longitude={selectedPub.coordinates.longitude} onClose={() => { setSelectedPub(null) }}>
          <div>
            <h2>{selectedPub.name}</h2>
            <p>{selectedPub.address.address1}</p>
            <button onClick={console.log("clicked")}>More...</button>
          </div>
        </Popup>
      ) : null}

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




// import 'mapbox-gl/dist/mapbox-gl.css'
// import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
// import React, { useState, useRef, useCallback } from 'react'
// import MapGL from 'react-map-gl'
// import Geocoder from 'react-map-gl-geocoder'


// const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWR3YW0xMiIsImEiOiJja2hlc3Rvbm8wNTd5MzBtMnh4d3I3ODR3In0.-MLW5F1IEhhA-2jgTww4_w'

// const Example = () => {
//   const [viewport, setViewport] = useState({
//     latitude: 37.7577,
//     longitude: -122.4376,
//     zoom: 8
//   });
  // const mapRef = useRef();
  // const handleViewportChange = useCallback(
  //   (newViewport) => setViewport(newViewport),
  //   []
  // );


  // const handleGeocoderViewportChange = useCallback(
  //   (newViewport) => {
  //     const geocoderDefaultOverrides = { transitionDuration: 1000 };

  //     return handleViewportChange({
  //       ...newViewport,
  //       ...geocoderDefaultOverrides
  //     });
  //   },
  //   []
  // );

//   return (
//     <div style={{ height: "100vh" }}>
//       <MapGL
        // ref={mapRef}
//         {...viewport}
//         width="100%"
//         height="100%"
        // onViewportChange={handleViewportChange}
//         mapboxApiAccessToken={MAPBOX_TOKEN}
//       >
        // <Geocoder
        //   mapRef={mapRef}
        //   onViewportChange={handleGeocoderViewportChange}
        //   mapboxApiAccessToken={MAPBOX_TOKEN}
        //   position="top-left"
        // />
//       </MapGL>
//     </div>
//   );
// };

// export default Example