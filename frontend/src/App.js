import React from 'react'
import { BrowserRouter, Switch, Route }  from 'react-router-dom'
import bulma from 'bulma'


import '../styles/style.scss'
import 'react-slideshow-image/dist/styles.css'

import Home from './components/Home'
import NavBar from './components/Navbar'
import Signup from './components/Signup'
import Login from './components/Login'
import PubList from './components/PubList'
import CreatePub from './components/CreatePub'
import Maps from './components/Maps'
import SinglePub from './components/SinglePub'
import Admin from './components/Admin'
import User from './components/User'
import Reply from './components/Reply'


const App = () => {
  return <>
  <BrowserRouter>
    <NavBar />
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/pubs' component={PubList} /> 
      <Route exact path='/pubs/maps' component={Maps} />
      <Route exact path='/pubs' component={PubList} />
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/pubs/new-pub' component={CreatePub} />
      <Route exact path='/pubs/:id/comments/:commentId' component={Reply} />
      <Route exact path ='/pubs/:id' component={SinglePub} />
      <Route exact path='/admin' component={Admin} />
      <Route exact path='/users/:id' component={User} />
      
    </Switch>
  </BrowserRouter>
  </>
}


export default App