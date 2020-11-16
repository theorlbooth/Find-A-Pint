import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'

// https://api.opencagedata.com/geocode/v1/json?key=9c8531b6642b43319982489fb18739ab&q=37natalroad&pretty=1


export default function CreatePub() {
  const { register, handleSubmit, errors, control, getValues } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images'
  })





  const onSubmit = data => {
    console.log(data)
    const newdata = {
      ...data,
      reviewed: false,
      address: {
        address1: data.address,
        city: data.city,
        zip_code: data.postcode
      },
      photos: []
    }

    if (data.images) {
      data.images.map((images) => {
        newdata.photos.push(images.value)
      })
    }

    const toURI = encodeURI(newdata.address.lineone + ' ' + newdata.address.zip_code + '' + 'uk')
    const url = `https://api.opencagedata.com/geocode/v1/json?key=9c8531b6642b43319982489fb18739ab&q=${toURI}&pretty=1`


    axios.get(url)
      .then(resp => {
        const geo = resp.data.results[0].geometry
        const finaldata = {
          ...newdata,
          coordinates: {
            latitude: geo.lat,
            longitude: geo.lng
          }
        }
        console.log(finaldata)
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
        <input type="text" placeholder="city" name="city" ref={register({ required: true })} />
      </div>
      <div>
        <input type="text" placeholder="postcode" name="postcode" ref={register({ required: true })} />
      </div>
      <div>
        <input type="text" placeholder="openinghours" name="openingHours" ref={register({ required: true })} />
      </div>
      <div>
        <input type="text" placeholder="phoneNumber" name="phoneNumber" ref={register} />
      </div>
      <div>
        <label>Take away?</label>
      </div>
      <div>
        <input type="checkbox" placeholder="takeaway" name="takeAway" ref={register} />
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
      {fields.map((images, index) => {
        return (<div key={images.id}>
          <input
            name={`images[${index}].value`}
            ref={register}
            defaultValue={images.value}
          />
          <button type="button" onClick={() => remove(index)}>Delete</button>
        </div>

        )
      })}
      <p>Add images</p>
      <input name="images-input" ref={register} />
      <p>
        <a onClick={() => append({ value: getValues('images-input') })} >
          Add images
        </a>
      </p>

      <input type="submit" />
    </form>
  </div >

  )
}

