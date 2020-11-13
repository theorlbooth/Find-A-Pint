import React, { useState } from 'react'
import Icon from '@mdi/react'
import { mdiFlagVariant } from '@mdi/js'

// const [clicked, updateClicked] = useState(false)

let clicked = false 

const Flag = () => {
  return <>
    <Icon
      onClick={() => clicked = !clicked}
      path={mdiFlagVariant}
      size={1}
      color={clicked === true ? 'red' : 'grey'}
    />
  </>
}

export default Flag 