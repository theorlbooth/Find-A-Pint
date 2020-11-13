import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Loader from './Loader'



const Admin = () => {

  const [pubsList, updatePubList] = useState([])
  const [userList, updateUserList] = useState([])

  useEffect(() => {
    axios.get('/api/pub')
      .then(resp => {
        updatePubList(resp.data)
      })
  }, [])


  useEffect(() => {
    axios.get('/api/users')
      .then(resp => {
        updateUserList(resp.data)
      })
  }, [])

  if (pubsList === undefined) {
    return
  }


  if (!pubsList.reviewed) {
    <Loader />
  }


  function adminFilter() {
    const adminFiltered = pubsList.filter(pubs => {
      return pubs.reviewed === false
    })
    return adminFiltered
  }

  function removeUser(user) {
    const token = localStorage.getItem('token')
    axios.delete(`api/users/${user}`, {
      headers: { Authorization: `Bearer ${token} ` }
    })
      .then(resp => {
        console.log(resp.data)
        axios.get('/api/users')
          .then(resp => {
            updateUserList(resp.data)
          })
      })
  }

  function removePub(pub) {
    const token = localStorage.getItem('token')
    axios.delete(`/api/pub/${pub}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        console.log(resp.data)
        axios.get('/api/pub')
          .then(resp => {
            updatePubList(resp.data)
          })
      })
  }

  function approvePub(pub) {
    const token = localStorage.getItem('token')
    axios.put(`/api/pub/${pub}`, {
      reviewed: true
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        console.log(resp.data)
        axios.get('/api/pub')
          .then(resp => {
            updatePubList(resp.data)
          })
      })
  }

  console.log(adminFilter())

  function checkForImage(pub) {
    if (pub.imageUrl === '') {
      return 'https://images.unsplash.com/photo-1586993451228-09818021e309?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80'
    }
    return pub.imageUrl
  }

  return <>
    <div className="pubs-page">
      <div className="filter">
      </div>
      <div className="search-results">
        <div className="columns is-multiline is-mobile">
          {adminFilter().map((pub, index) => {
            return <div className="column is-2-desktop is-6-tablet is-12-mobile" key={index}>
              <Link to={`pub/${pub._id}`}>
                <div className="card">
                  <div className="card-image">
                    <figure className="image is-square">
                      <img src={checkForImage(pub)} alt={pub.name} />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="media-content">
                      <h2 className="title is-5">{pub.name}</h2>
                      <p className="subtitle is-6">{pub.address.address1}, {pub.address.zip_code}</p>
                      <p className="subtitle is-6">Distance from:</p>
                    </div>
                  </div>
                </div>
              </Link>
              <button className='button' onClick={() => removePub(pub._id)}>Remove</button>
              <button className='button' onClick={() => approvePub(pub._id)}>Approve</button>
            </div>
          })}
        </div>
      </div>
    </div>


    <h2 className="title is-2 has-text-centered">Users</h2>

    <div className="users-page">
      <div className="filter">
      </div>
      <div className="search-results">
        <div className="columns is-multiline is-mobile">
          {userList.map((user, index) => {
            return <div className="column is-2-desktop is-6-tablet is-12-mobile" key={index}>
              <Link to={`/users/${user._id}`}>
                <div className="card">
                  <div className="card-content">
                    <div className="media-content">
                      <h2 className="title is-5">{user.username}</h2>
                      <p className="subtitle is-6">{user.email}</p>
                    </div>
                  </div>
                </div>
              </Link>
              <button className='button' onClick={() => removeUser(user._id)}>Remove</button>
            </div>
          })}
        </div>
      </div>
    </div>
  </>


}

export default Admin