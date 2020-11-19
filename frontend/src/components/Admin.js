import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Loader from './Loader'

import { getUserId, isCurrentUser } from '../lib/auth'

const Admin = () => {

  const [pubsList, updatePubList] = useState([])
  const [userList, updateUserList] = useState([])
  const [flaggedPubs, updateFlaggedPubs] = useState([])

  useEffect(() => {
    axios.get('/api/pub')
      .then(resp => {
        updatePubList(resp.data)
      })
  }, [])

  useEffect(() => {
    axios.get('/api/pubs/flagged/comments/pubs')
      .then(resp => {
        updateFlaggedPubs(resp.data)
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
        <div className="columns is-multiline is-mobile pub-flex">
          {adminFilter().map((pub, index) => {
            return <div className="column is-2-desktop is-6-tablet is-12-mobile" key={index}>
              <Link to={`pubs/${pub._id}`}>
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
              <button className='button' style={{ margin: '10px' }} onClick={() => removePub(pub._id)}>Remove</button>
              <button className='button' style={{ margin: '10px' }} onClick={() => approvePub(pub._id)}>Approve</button>
            </div>
          })}
        </div>
      </div>
    </div>
    <div className="flagged-button">
      <div className="flag-button">
        <Link style={{ minWidth: '150px' }} className={flaggedPubs.length === 0 ? 'button is-black flag-button' : 'button is-danger'} to='/pubs/flagged'>Flagged</Link>
      </div>
    </div>
    <h2 style={{ color: 'white' }} className="title is-2 has-text-centered">Users</h2>

    <div className="users-page">
      <div className="filter">
      </div>
      <div className="search-results">
        <div className="columns is-multiline is-mobile search-results">
          {userList.map((user, index) => {
            return <div className="column is-2-desktop is-6-tablet is-12-mobile indiv-result" key={index}>
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
              {!isCurrentUser(user._id) && <button className='button' style={{ margin: '10px' }} onClick={() => removeUser(user._id)}>Remove</button>}
            </div>
          })}
        </div>
      </div>
    </div>
  </>


}

export default Admin