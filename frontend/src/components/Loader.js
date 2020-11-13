import React from 'react'
import CircleLoader from 'react-spinners/CircleLoader'

const Loader = () => {
  return <div className="sweet-loading">
    <CircleLoader
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