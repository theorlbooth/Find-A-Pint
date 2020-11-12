import React, { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import axios from 'axios'



const DisplayMap = () => {

  const [pubList, getPubList] = useState([])

  const [selectedPub, setSelectedPub] = useState(null)

  const [viewport, setViewport] = useState({
    latitude: 51.5721642,
    longitude: -0.0083677,
    width: "100vw",
    height: "100vh",
    zoom: 10
  })




  useEffect(() => {
    axios.get('/api/pub')
      .then(axiosResp => {
        getPubList(axiosResp.data)
      })
  }, [])





  return <section>
    <ReactMapGL
      {...viewport}
      mapStyle='mapbox://styles/adwam12/ckhewfl88137g19rzckkwjfv0'
      mapboxApiAccessToken="pk.eyJ1IjoiYWR3YW0xMiIsImEiOiJja2hlc3Rvbm8wNTd5MzBtMnh4d3I3ODR3In0.-MLW5F1IEhhA-2jgTww4_w"
      onViewportChange={viewport => {
        setViewport(viewport)
      }}
    >
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
      {selectedPub ? (
        <Popup latitude={selectedPub.coordinates.latitude} longitude={selectedPub.coordinates.longitude} onClose={() =>{setSelectedPub(null)}}>
          <div>
            <h2>{selectedPub.name}</h2>
            <p>{selectedPub.address.address1}</p>
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