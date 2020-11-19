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

  return (<div className="create-page">
    <h1>Enter Pub Details</h1>
    {/* BulmaStart */}
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginLeft: '30%', marginRight: '30%' }}>
      
      <div className="field">
        <label className="label">Alias:</label>
        <div className="control">
          <input className="input is-small" type="text" placeholder="alias" name="alias"
            ref={register({
              required: {
                value: true,
                message: 'Please enter an alias'
              }
            })} />
          {errors.alias && (
            <div className="error" style={{ color: 'red' }}>{errors.alias.message}</div>
          )}
        </div>
      </div>

      <div className="field">
        <label className="label">Name:</label>
        <div className="control">
          <input className="input is-small" type="text" placeholder="name" name="name" ref={register({
            required: {
              value: true,
              message: 'Please enter a name for your pub'
            }
          })} />
          {errors.name && (
            <div className="error" style={{ color: 'red' }}>{errors.name.message}</div>
          )}
        </div>
      </div>

      <div className="field">
        <label className="label">imageUrl:</label>
        <div className="control">
          <input className="input is-small" placeholder="imageUrl" name="imageUrl" ref={register({
            required: {
              value: true,
              message: 'Please enter a valid image for your pub'
            }
          })} />
          {errors.imageUrl && (
            <div className="error" style={{ color: 'red' }}>{errors.imageUrl.message}</div>
          )}
        </div>
      </div>

      <div className="field">
        <label className="label">Address:</label>
        <div className="control">
          <input className="input is-small" placeholder="address" name="address" ref={register({
            required: {
              value: true,
              message: 'Please enter a valid address'
            }
          })} />
          {errors.address && (
            <div className="error" style={{ color: 'red' }}>{errors.address.message}</div>
          )}
        </div>
      </div>

      <div className="field">
        <label className="label">City:</label>
        <div className="control">
          <input className="input is-small" placeholder="city" name="city" ref={register({
            required: {
              value: true,
              message: 'Please enter a valid city'
            }
          })} />
          {errors.city && (
            <div className="error" style={{ color: 'red' }}>{errors.city.message}</div>
          )}
        </div>
      </div>

      <div className="field">
        <label className="label">Postcode:</label>
        <div className="control">
          <input className="input is-small" placeholder="postcode" name="postcode" ref={register({
            required: {
              value: true,
              message: 'Please enter a valid postcode'
            }
          })} />
          {errors.postcode && (
            <div className="error" style={{ color: 'red' }}>{errors.postcode.message}</div>
          )}
        </div>
      </div>
      <div className="field">
        <label className="label">Opening Hours:</label>
        <div className="control">
          <input className="input is-small" placeholder="openinghours" name="openingHours" ref={register({
            required: {
              value: true,
              message: 'Please enter opening hours'
            }
          })} />
          {errors.openingHours && (
            <div className="error" style={{ color: 'red' }}>{errors.openingHours.message}</div>
          )}
        </div>
      </div>
      <div className="field">
        <label className="label">Description:</label>
        <div className="control">
          <textarea className="input is-small" placeholder="description" name="description" ref={register({
            required: {
              value: true,
              message: 'Please enter a description'
            }
          })} style={{ height: '80px' }}/>
          {errors.description && (
            <div className="error" style={{ color: 'red' }}>{errors.description.message}</div>
          )}
        </div>
      </div>
      <div className="field">
        <label className="label">Phone Number:</label>
        <div className="control">
          <input className="input is-small" placeholder="phoneNumber" name="phoneNumber" ref={register} />
        </div>
      </div>

      <section className="Toggles" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', height: '90px' }}>
        <div className="field">
          <div className="control">
            <label className="checkbox" style={{ padding: '3px', border: '3px solid white', width: '180px' }}>
              <input type="checkbox" placeholder="takeaway" name="takeAway" ref={register} style={{ marginRight: '15px' }} />
            Take away?

            </label>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label className="checkbox" style={{ padding: '3px', border: '3px solid white', width: '180px' }}>
              <input type="checkbox" placeholder="outdoorSeating" name="outdoorSeating" ref={register} style={{ marginRight: '15px' }} />
            Outdoor Seating?

            </label>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label className="checkbox" style={{ padding: '3px', border: '3px solid white', width: '180px' }}>
              <input type="checkbox" placeholder="heating" name="heating" ref={register} style={{ marginRight: '15px' }} />
           Heating?

            </label>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label className="checkbox" style={{ padding: '3px', border: '3px solid white', width: '180px' }}>
              <input type="checkbox" placeholder="liveMusic" name="liveMusic" ref={register} style={{ marginRight: '15px' }} />
           Live Music?

            </label>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label className="checkbox" style={{ padding: '3px', border: '3px solid white', width: '180px' }}>
              <input type="checkbox" placeholder="liveSport" name="liveSport" ref={register} style={{ marginRight: '15px' }} />
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
      <div className="submit-flex">
        <input className="button is-black is-inverted is-outlined" type="submit" />
      </div>
    </form>
  </div>
  )
}

