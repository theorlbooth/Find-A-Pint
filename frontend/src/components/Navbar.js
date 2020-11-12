import React from 'react'
import { Link, withRouter } from 'react-router-dom'


const Navbar = (props) => {

  function handleLogout() {
    localStorage.removeItem('token')
    props.history.push('/')
  }

  return <>
  <nav className="navbar">
    <div className="navbar-menu is-active">
      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            <Link className="button is-ghost" to="/">Home</Link>
            <Link className="button is-black" to="/pubs">Search</Link>
            <Link className="button is-black" to='/pubs/maps'>Map</Link>
            {!localStorage.getItem('token') && <Link className="button is-black" to="/login">Login</Link>}
            {localStorage.getItem('token') && <button className="button is-black" onClick={handleLogout}>Logout</button>}
          </div>
        </div>
      </div>
    </div>
  </nav>
  </>
}

export default withRouter(Navbar)