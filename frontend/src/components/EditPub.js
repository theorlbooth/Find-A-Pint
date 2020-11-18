import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'

const EditPub = (props) => {

  const id = props.match.params.id
  const { register, handleSubmit, control, getValues, setValue } = useForm()
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
    openinghours: '',
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

    <div>
      <h1>Edit Pub</h1>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div>
          <input type="text" placeholder="alias" name="alias" ref={register({ required: true })} value={pub.alias} onChange={handleChange} />
        </div>
        <div>
          <input type="text" placeholder="name" name="name" ref={register({ required: true })} value={pub.name} onChange={handleChange} />
        </div>
        <div>
          <input type="text" placeholder="imageUrl" name="imageUrl" ref={register({ required: true })} value={pub.imageUrl} onChange={handleChange} />
        </div>
        <div>
          <input type="text" placeholder="address" name="address" ref={register({ required: true })} value={pub.address.address1} onChange={handleChange} />
        </div>
        <div>
          <input type="text" placeholder="city" name="city" ref={register({ required: true })} value={pub.address.city} onChange={handleChange} />
        </div>
        <div>
          <input type="text" placeholder="postcode" name="postcode" ref={register({ required: true })} value={pub.address.zip_code} onChange={handleChange} />
        </div>
        <div>
          <input type="text" placeholder="openinghours" name="openinghours" ref={register({ required: true })} value={pub.openingHours} onChange={handleChange} />
        </div>
        <div>
          <textarea type="text" placeholder="description" name="description" ref={register({ required: true })} value={pub.description} onChange={handleChange} />
        </div>
        <div>
          <input type="text" placeholder="phoneNumber" name="phoneNumber" ref={register} value={pub.phoneNumber} onChange={handleChange} />
        </div>
        <div>
          <label>Take away?</label>
        </div>
        <div>
          <input type="checkbox" placeholder="takeaway" name="takeAway" ref={register} checked={pub.takeAway === true ? true : false} onChange={handleTickChange} />
        </div>
        <div>
          <label>Outdoor Seating?</label>
        </div>
        <div>
          <input type="checkbox" placeholder="outdoorSeating" name="outdoorSeating" ref={register} checked={pub.outdoorSeating === true ? true : false} onChange={handleTickChange} />
        </div>
        <div>
          <label>Heating?</label>
        </div>
        <div>
          <input type="checkbox" placeholder="heating" name="heating" ref={register} checked={pub.heating === true ? true : false} value={pub.heating} onChange={handleTickChange} />
        </div>
        <div>
          <label>LiveMusic?</label>
        </div>
        <div>
          <input type="checkbox" placeholder="liveMusic" name="liveMusic" ref={register} checked={pub.liveMusic === true ? true : false} value={pub.liveMusic} onChange={handleTickChange} />
        </div>
        <div>
          <label>Livesport?</label>
        </div>
        <div>
          <input type="checkbox" placeholder="liveSport" name="liveSport" ref={register} checked={pub.liveSport === true ? true : false} value={pub.liveSport} onChange={handleTickChange} />
        </div>

        <p>Photos</p>
        {fields.map((photos, index) => {
          return (<div key={index}>
            <input
              name={`photos[${index}].value`}
              ref={register}
              defaultValue={photos.value}
            />
            <button type="button" onClick={() => removePic(index)}>Delete</button>
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
        <input type="submit" />
      </form>
    </div >

  </>



}


export default EditPub