import React, { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { getUserId, isAdmin, isLandlord } from '../lib/auth'
import axios from 'axios'

const Navbar = (props) => {

  const token = localStorage.getItem('token')

  function handleLogout() {
    localStorage.removeItem('token')
    props.history.push('/')
    location.reload()
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
    <nav className="navbar ColorInvert">
      <div className="navbar-menu is-active">
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <Link className="button is-black" to="/" style={{ border: '2px solid white' }}>Home</Link>
              <Link className="button is-ghost" to="/pubs">Search</Link>
              <Link className="button is-ghost" to='/pubs/maps'>Map</Link>
              {(token && isLandlord(user)) && <Link className="button is-ghost" to='/pubs/new-pub'>Create Pub</Link>}
              {token && <Link className="button is-ghost" to={`/users/${getUserId()}`}>Account</Link>}
              {!token && <Link className="button is-ghost" to="/login">Login</Link>}
              {isAdmin(user) && <Link className="button is-ghost" to={'/admin'}>Admin</Link>}
              {token && <Link className="button is-ghost" to={'/'} onClick={handleLogout}>Logout</Link>}
            </div>
          </div>
        </div>
      </div>
    </nav>
  </>
}

export default withRouter(Navbar)