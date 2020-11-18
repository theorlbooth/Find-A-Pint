import React, { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { getUserId, isAdmin, isLandlord } from '../lib/auth'
import axios from 'axios'

const Navbar = (props) => {

  const token = localStorage.getItem('token')

  function handleLogout() {
    localStorage.removeItem('token')
    props.history.push('/')
  }
  const id = getUserId()

  const [user, updateUser] = useState([])
  useEffect(() => {
    axios.get(`/api/users/${id}`)
      .then(resp => {
        updateUser(resp.data)
      })
  }, [props])

  return <>
    <nav className="navbar">
      <div className="navbar-menu is-active">
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <Link className="button is-ghost" to="/">Home</Link>
              <Link className="button is-black" to="/pubs">Search</Link>
              <Link className="button is-black" to='/pubs/maps'>Map</Link>
              {(token && isLandlord(user)) && <Link className="button is-black" to='/pubs/new-pub'>Create Pub</Link>}
              {token && <Link className="button is-black" to={`/users/${getUserId()}`}>Account</Link>}
              {!token && <Link className="button is-black" to="/login">Login</Link>}
              {isAdmin(user) && <Link className="button is-black" to={'/admin'}>Admin</Link>}
              {token && <button className="button is-black" onClick={handleLogout}>Logout</button>}
            </div>
          </div>
        </div>
      </div>
    </nav>
  </>
}

export default withRouter(Navbar)