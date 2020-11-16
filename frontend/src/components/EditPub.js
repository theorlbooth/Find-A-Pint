import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'

const EditPub = (props) => {

  const id = props.match.params.id
  const { register, handleSubmit, errors, control, getValues } = useForm()
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
    phoneNumber: '',
    takeaway: false,
    outdoorSeating: false,
    heating: false,
    liveMusic: false,
    liveSport: false, 
    photos: []
  })

  useEffect(() => {
    axios.get(`/api/pub/${id}`)
      .then(resp => {
        updatePub(resp.data)
        console.log(resp.data)
      })
  }, [])



  const onSubmit = data => {
    console.log(data)
    const newdata = {
      ...data,
      reviewed: false,
      address: {
        address1: data.address,
        city: data.city,
        zip_code: data.postcode
      }
    }


    const toURI = encodeURI(newdata.address.lineone + ' ' + newdata.address.zip_code + '' + 'uk')
    const url = `https://api.opencagedata.com/geocode/v1/json?key=9c8531b6642b43319982489fb18739ab&q=${toURI}&pretty=1`


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
  }


  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value

    const updatedData = {
      ...pub,
      [name]: value
    }
    updatePub(updatedData)
    console.log(updatedData)
  }

  function handleTickChange(event) {
    const name = event.target.name
    const value = event.target.checked

    const updatedData = {
      ...pub,
      [name]: value
    }
    updatePub(updatedData)
    console.log(updatedData)
  }


  return <>

    <div>
      <h1>Edit Pub</h1>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div>
          <input type="text" placeholder="alias" name="alias" ref={register({ required: true })} value={pub.alias} onChange={handleChange}/>
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
          <input type="text" placeholder="postcode" name="postcode" ref={register({ required: true })}  value={pub.address.zip_code} onChange={handleChange} />
        </div>
        <div>
          <input type="text" placeholder="openinghours" name="openinghours" ref={register({ required: true })} value={pub.openinghours} onChange={handleChange} />
        </div>
        <div>
          <input type="text" placeholder="phoneNumber" name="phoneNumber" ref={register} value={pub.phoneNumber} onChange={handleChange} />
        </div>
        <div>
          <label>Take away?</label>
        </div>
        <div>
          <input type="checkbox" placeholder="takeaway" name="takeaway" ref={register} checked={pub.takeaway === true ? true : false} onChange={handleTickChange}/>
        </div>
        <div>
          <label>Outdoor Seating?</label>
        </div>
        <div>
          <input type="checkbox" placeholder="outdoorSeating" name="outdoorSeating" ref={register} checked={pub.outdoorSeating === true ? true : false} onChange={handleTickChange}/>
        </div>
        <div>
          <label>Heating?</label>
        </div>
        <div>
          <input type="checkbox" placeholder="heating" name="heating" ref={register} checked={pub.heating === true ? true : false} value={pub.heating} onChange={handleTickChange}/>
        </div>
        <div>
          <label>LiveMusic?</label>
        </div>
        <div>
          <input type="checkbox" placeholder="liveMusic" name="liveMusic" ref={register} checked={pub.liveMusic === true ? true : false} value={pub.liveMusic} onChange={handleTickChange}/>
        </div>
        <div>
          <label>Livesport?</label>
        </div>
        <div>
          <input type="checkbox" placeholder="liveSport" name="liveSport" ref={register} checked={pub.liveSport === true ? true : false} value={pub.liveSport} onChange={handleTickChange}/>
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
          <a onClick={() => append({ value: getValues('image-input') })} >
            Add image
          </a>
        </p>

        <input type="submit" />
      </form>
    </div >

  </>



}


export default EditPub