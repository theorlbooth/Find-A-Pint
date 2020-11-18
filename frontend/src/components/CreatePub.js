import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'

// https://api.opencagedata.com/geocode/v1/json?key=9c8531b6642b43319982489fb18739ab&q=37natalroad&pretty=1


export default function CreatePub(props) {
  const { register, handleSubmit, errors, control, getValues, setValue } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'photos'
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

    if (data.photos) {
      data.photos.map((photo) => {
        newdata.photos.push(photo.value)
      })
    }

    const toURI = encodeURI(newdata.address.lineone + ' ' + newdata.address.zip_code + '' + 'uk')
    const url = `https://api.opencagedata.com/geocode/v1/json?key=${process.env.geo_key}&q=${toURI}&pretty=1`


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
            console.log(resp.data)
            props.history.push(`/pubs/${resp.data._id}`)
          })

      })
  }

  function picInput() {
    append([{ value: getValues('photos-input') }])
    setValue('photos-input', '')
  }

  return (<div>
    <h1>Create a pub</h1>

    {/* BulmaStart */}
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginLeft: "30%", marginRight: "30%" }}>
      <div className="field">
        <label className="label">Alias:</label>
        <div className="control">
          <input className="input is-small" type="text" placeholder="alias" name="alias" ref={register({ required: true })} />
        </div>
      </div>

      <div className="field">
        <label className="label">Name:</label>
        <div className="control">
          <input className="input is-small" type="text" placeholder="name" name="name" ref={register({ required: true })} />
        </div>
      </div>

      <div className="field">
        <label className="label">imageUrl:</label>
        <div className="control">
          <input className="input is-small" placeholder="imageUrl" name="imageUrl" ref={register({ required: true })} />
        </div>
      </div>

      <div className="field">
        <label className="label">Address:</label>
        <div className="control">
          <input className="input is-small" placeholder="address" name="address" ref={register({ required: true })} />
        </div>
      </div>

      <div className="field">
        <label className="label">City:</label>
        <div className="control">
          <input className="input is-small" placeholder="city" name="city" ref={register({ required: true })} />
        </div>
      </div>

      <div className="field">
        <label className="label">Postcode:</label>
        <div className="control">
          <input className="input is-small" placeholder="postcode" name="postcode" ref={register({ required: true })} />
        </div>
      </div>
      <div className="field">
        <label className="label">Opening Hours:</label>
        <div className="control">
          <input className="input is-small" placeholder="openinghours" name="openingHours" ref={register({ required: true })} />
        </div>
      </div>
      <div className="field">
        <label className="label">Phone Number:</label>
        <div className="control">
          <input className="input is-small" placeholder="phoneNumber" name="phoneNumber" ref={register} />
        </div>
      </div>

      <section className="Toggles" style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", height: "90px" }}>
        <div className="field">
          <div className="control">
            <label className="checkbox" style={{ padding: "3px", border: "2px solid black", width: "180px" }}>
              <input type="checkbox" placeholder="takeaway" name="takeAway" ref={register} style={{ marginRight: "15px" }} />
            Take away?

       </label>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label className="checkbox" style={{ padding: "3px", border: "2px solid black", width: "180px" }}>
              <input type="checkbox" placeholder="outdoorSeating" name="outdoorSeating" ref={register} style={{ marginRight: "15px" }} />
            Outdoor Seating?

       </label>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label className="checkbox" style={{ padding: "3px", border: "2px solid black", width: "180px" }}>
              <input type="checkbox" placeholder="heating" name="heating" ref={register} style={{ marginRight: "15px" }} />
           Heating?

       </label>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label className="checkbox" style={{ padding: "3px", border: "2px solid black", width: "180px" }}>
              <input type="checkbox" placeholder="liveMusic" name="liveMusic" ref={register} style={{ marginRight: "15px" }} />
           Live Music?

       </label>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label className="checkbox" style={{ padding: "3px", border: "2px solid black", width: "180px" }}>
              <input type="checkbox" placeholder="liveSport" name="liveSport" ref={register} style={{ marginRight: "15px" }} />
            Live Sports?

       </label>
          </div>
        </div>
      </section>
      <p>Photos</p>
      {fields.map((photos, index) => {
        return (<div key={photos.id}>
          <input className="input" type="text" placeholder="Photo URL"

            name={`photos[${index}].value`}
            ref={register}
            defaultValue={photos.value}
          />
          <a onClick={() => remove(index)}>Delete</a>
        </div>

        )
      })}
      <p>Add photos</p>
      <input className="input" type="text" name="photos-input" ref={register} />
      <p>
        <a onClick={() => picInput()} >
          Add photos
        </a>
      </p>

      <input type="submit" />
    </form>

    {/* BulmaEnd */}
    {/* <form onSubmit={handleSubmit(onSubmit)}>

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
      
      <p>Photos</p>
      {fields.map((photos, index) => {
        return (<div key={photos.id}>
          <input
            name={`photos[${index}].value`}
            ref={register}
            defaultValue={photos.value}
          />
          <a onClick={() => remove(index)}>Delete</a>
        </div>

        )
      })}
      <p>Add photos</p>
      <input name="photos-input" ref={register} />
      <p>
        <a onClick={() => picInput()} >
          Add photos
        </a>
      </p>

      <input type="submit" /> */}
    {/* </form> */}
  </div >

  )
}

