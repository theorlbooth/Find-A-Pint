import React from 'react'
import RingLoader from 'react-spinners/RingLoader'

const Loader = () => {
  return <div className="sweet-loading">
    <RingLoader
      css={`display: block;
    margin: auto;
    border-color: red;`}
      size={150}
      color={'#FF0000'}
      loading={true}
    />
  </div>

}

export default Loader