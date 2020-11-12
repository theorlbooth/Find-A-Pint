import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'

// https://api.opencagedata.com/geocode/v1/json?key=9c8531b6642b43319982489fb18739ab&q=37natalroad&pretty=1


export default function CreatePub() {
  const { register, handleSubmit, errors, control, getValues } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'photos'
  })

  



  const onSubmit = data => {
    const newdata = {
      ...data,
      reviewed: false,
      address: {
        lineone: data.address,
        postcode: data.postcode
      }
    }
    delete newdata.postcode

    const toURI = encodeURI(newdata.address.lineone + ' ' + newdata.address.postcode + '' + 'uk')
    const url = `https://api.opencagedata.com/geocode/v1/json?key=9c8531b6642b43319982489fb18739ab&q=${toURI}&pretty=1`


    axios.get(url)
      .then(resp => {
        const geo = resp.data.results[0].geometry
        console.log(geo)
        const finaldata = {
          ...newdata,
          coordinates: (geo)
        }
        const token = localStorage.getItem('token')
        axios.post('/api/pub', finaldata, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(resp => {
            const message = resp.data
            console.log(message)
          })

      })


  
  }
  console.log(errors)

  return (<div>
    <h1>Create a pub</h1>
    <form onSubmit={handleSubmit(onSubmit)}>

      <div>
        <input type="text" placeholder="alias" name="alias" ref={register({ required: true })} />
      </div>
      <div>
        <input type="text" placeholder="name" name="name" ref={register({ required: true })} />
      </div>
      <div>
        <input type="text" placeholder="imageUrl" name="imageUrl" ref={register({ required: true })} />
      </div>
      <div>
        <input type="text" placeholder="address" name="address" ref={register({ required: true })} />
      </div>
      <div>
        <input type="text" placeholder="postcode" name="postcode" ref={register({ required: true })} />
      </div>
      <div>
        <input type="text" placeholder="openinghours" name="openinghours" ref={register({ required: true })} />
      </div>
      <div>
        <input type="text" placeholder="phoneNumber" name="phoneNumber" ref={register} />
      </div>
      <div>
        <label>Take away?</label>
      </div>
      <div>
        <input type="checkbox" placeholder="takeaway" name="takeaway" ref={register} />
      </div>
      <div>
        <label>Outdoor Seating?</label>
      </div>
      <div>
        <input type="checkbox" placeholder="outdoorSeating" name="outdoorSeating" ref={register} />
      </div>
      <div>
        <label>Heating?</label>
      </div>
      <div>
        <input type="checkbox" placeholder="heating" name="heating" ref={register} />
      </div>
      <div>
        <label>LiveMusic?</label>
      </div>
      <div>
        <input type="checkbox" placeholder="liveMusic" name="liveMusic" ref={register} />
      </div>
      <div>
        <label>Livesport?</label>
      </div>
      <div>
        <input type="checkbox" placeholder="liveSport" name="liveSport" ref={register} />
      </div>

      <p>Images</p>
      {fields.map((image, index) => {
        return (<div key={image.id}>
          <input
            name={`image[${index}].value`}
            ref={register}
            defaultValue={image.value}
          />
          <button type="button" onClick={() => remove(index)}>Delete</button>
        </div>

        )
      })}
      <p>Add image</p>
      <input name="image-input" ref={register} />
      <p>
        <button onClick={() => append({ value: getValues('image-input') })} >
          Add image
        </button>
      </p>

      <input type="submit" />
    </form>
  </div >

  )
}

