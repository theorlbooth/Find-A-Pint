import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'

const EditPub = (props) => {

  const id = props.match.params.id
  const { register, handleSubmit, control, errors, getValues, setValue } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'photos'
  })



  const [pub, updatePub] = useState({
    alias: '',
    name: '',
    imageUrl: '',
    address: '',
    city: '',
    postcode: '',
    openingHours: '',
    description: '',
    phoneNumber: '',
    takeAway: false,
    outdoorSeating: false,
    heating: false,
    liveMusic: false,
    liveSport: false,
    photos: []
  })

  useEffect(() => {
    axios.get(`/api/pub/${id}`)
      .then(resp => {
        resp.data.photos.map((photo, index) => {
          const pic = {}
          pic.id = index
          pic.value = photo
          fields.push(pic)
        })
        updatePub(resp.data)
        console.log(resp.data)
      })
  }, [])



  function mapPhotos(data) {
    if (data.photos !== undefined) {
      data.photos.map(photo => {
        return photo.value
      })
    } else {
      return []
    }
  }


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
      photos: mapPhotos(data)
    }


    const toURI = encodeURI(newdata.address.lineone + ' ' + newdata.address.zip_code + '' + 'uk')
    const url = `https://api.opencagedata.com/geocode/v1/json?key=${process.env.geo_key}&q=${toURI}&pretty=1`


    axios.get(url)
      .then(resp => {
        const geo = resp.data.results[0].geometry
        console.log(geo)
        const finaldata = {
          ...newdata,
          coordinates: (geo)
        }
        console.log(finaldata)
        const token = localStorage.getItem('token')
        axios.put(`/api/pub/${id}`, finaldata, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(resp => {
            console.log(resp.data)
          })
      })
      .then(() => {
        props.history.push(`/pubs/${id}`)
      })
  }


  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value

    const updatedData = {
      ...pub,
      [name]: value
    }
    updatePub(updatedData)
  }

  function handleTickChange(event) {
    const name = event.target.name
    const value = event.target.checked

    const updatedData = {
      ...pub,
      [name]: value
    }
    updatePub(updatedData)
  }

  function picInput() {
    append([{ value: getValues('photos-input') }])
    setValue('photos-input', '')
    console.log(fields)
  }
  function removePic(index) {
    remove(index)
    console.log(fields)
  }

  return <>
    <div className="edit-page">
      <h1>Edit Pub Details</h1>
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
              })} value={pub.alias} onChange={handleChange} />
            {errors.alias && (
              <div style={{ color: 'red' }} className="error">{errors.alias.message}</div>
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
            })} value={pub.name} onChange={handleChange} />
            {errors.name && (
              <div style={{ color: 'red' }} className="error">{errors.name.message}</div>
            )}
          </div>
        </div>

        <div className="field">
          <label className="label">imageUrl:</label>
          <div className="control">
            <input className="input is-small" type="text" placeholder="imageUrl" name="imageUrl" ref={register({
              required: {
                value: true,
                message: 'Please enter a valid image for your pub'
              }
            })} value={pub.imageUrl} onChange={handleChange} />
            {errors.imageUrl && (
              <div style={{ color: 'red' }} className="error">{errors.imageUrl.message}</div>
            )}
          </div>
        </div>

        <div className="field">
          <label className="label">Address:</label>
          <div className="control">
            <input className="input is-small" type="text" placeholder="address" name="address" ref={register({
              required: {
                value: true,
                message: 'Please enter a valid address'
              }
            })} value={pub.address.address1} onChange={handleChange} />
            {errors.address && (
              <div style={{ color: 'red' }} className="error">{errors.address.message}</div>
            )}
          </div>
        </div>

        <div className="field">
          <label className="label">City:</label>
          <div className="control">
            <input className="input is-small" type="text" placeholder="city" name="city" ref={register({
              required: {
                value: true,
                message: 'Please enter a valid city'
              }
            })} value={pub.address.city} onChange={handleChange} />
            {errors.city && (
              <div style={{ color: 'red' }} className="error">{errors.city.message}</div>
            )}
          </div>
        </div>

        <div className="field">
          <label className="label">Postcode:</label>
          <div className="control">
            <input className="input is-small" type="text" placeholder="postcode" name="postcode" ref={register({
              required: {
                value: true,
                message: 'Please enter a valid postcode'
              }
            })} value={pub.address.zip_code} onChange={handleChange} />
            {errors.postcode && (
              <div style={{ color: 'red' }} className="error">{errors.postcode.message}</div>
            )}
          </div>
        </div>

        <div className="field">
          <label className="label">Opening Hours:</label>
          <div className="control">
            <input className="input is-small" type="text" placeholder="opening hours" name="openingHours" ref={register({
              required: {
                value: true,
                message: 'Please enter opening hours'
              }
            })} value={pub.openingHours} onChange={handleChange} />
            {errors.openingHours && (
              <div style={{ color: 'red' }} className="error">{errors.openingHours.message}</div>
            )}
          </div>
        </div>

        <div className="field">
          <label className="label">Description:</label>
          <div className="control">
            <textarea className="input is-small" type="text" placeholder="description" name="description" ref={register({
              required: {
                value: true,
                message: 'Please enter a description'
              }
            })} value={pub.description} onChange={handleChange} style={{ height: '80px' }} />
            {errors.description && (
              <div style={{ color: 'red' }} className="error">{errors.description.message}</div>
            )}
          </div>
        </div>

        <div className="field">
          <label className="label">Phone Number:</label>
          <div className="control">
            <textarea className="input is-small" type="text" placeholder="phoneNumber" name="phoneNumber" ref={register} value={pub.phoneNumber} onChange={handleChange} />
          </div>
        </div>

        <section className="Toggles" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', height: '90px' }}>
          <div className="field">
            <div className="control">
              <label className="checkbox" style={{ padding: '3px', border: '3px solid white', width: '180px' }}>
                <input type="checkbox" placeholder="takeaway" name="takeAway" ref={register} checked={pub.takeAway === true ? true : false} onChange={handleTickChange} style={{ marginRight: '15px' }} />Take away?</label>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label className="checkbox" style={{ padding: '3px', border: '3px solid white', width: '180px' }}>
                <input type="checkbox" placeholder="outdoorSeating" name="outdoorSeating" ref={register} checked={pub.outdoorSeating === true ? true : false} onChange={handleTickChange} style={{ marginRight: '15px' }} />Outdoor Seating?</label>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label className="checkbox" style={{ padding: '3px', border: '3px solid white', width: '180px' }}>
                <input type="checkbox" placeholder="heating" name="heating" ref={register} checked={pub.heating === true ? true : false} value={pub.heating} onChange={handleTickChange} style={{ marginRight: '15px' }} />Heating?</label>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label className="checkbox" style={{ padding: '3px', border: '3px solid white', width: '180px' }}>
                <input type="checkbox" placeholder="liveMusic" name="liveMusic" ref={register} checked={pub.liveMusic === true ? true : false} value={pub.liveMusic} onChange={handleTickChange} style={{ marginRight: '15px' }} />LiveMusic?</label>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label className="checkbox" style={{ padding: '3px', border: '3px solid white', width: '180px' }}>
                <input type="checkbox" placeholder="liveSport" name="liveSport" ref={register} checked={pub.liveSport === true ? true : false} value={pub.liveSport} onChange={handleTickChange} style={{ marginRight: '15px' }} />Livesport?</label>
            </div>
          </div>
        </section>
        <p>Photos</p>
        {fields.map((photos, index) => {
          return (<div key={index}>
            <input className="input" type="text" placeholder="Photo URL"
              name={`photos[${index}].value`}
              ref={register}
              defaultValue={photos.value}
            />
            <a type="button" onClick={() => removePic(index)}>Delete</a>
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
    </div >

  </>



}


export default EditPub