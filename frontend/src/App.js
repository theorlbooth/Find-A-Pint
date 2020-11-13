import React from 'react'
import { BrowserRouter, Switch, Route }  from 'react-router-dom'
import bulma from 'bulma'


import '../styles/style.scss'

import Home from './components/Home'
import NavBar from './components/Navbar'
import Signup from './components/Signup'
import Login from './components/Login'
import PubList from './components/PubList'
import CreatePub from './components/CreatePub'
import Maps from './components/Maps'
<<<<<<< HEAD
=======
import SinglePub from './components/SinglePub'
import Admin from './components/Admin'

>>>>>>> b0e53fec6df9a130d96eb6b0e0b44df4f60e4ecd

const App = () => {
  return <>
  <BrowserRouter>
    <NavBar />
    <Switch>
      <Route exact path='/' component={Home} />
<<<<<<< HEAD
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/pubs' component={PubList} /> 
      <Route exact path='/pubs/maps' component={Maps}/>
      <Route exact path='/pubs/new-pub' component={CreatePub} />

=======
      <Route exact path='/pubs' component={PubList} />
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/pubs/maps' component={Maps} />
      <Route exact path='/pubs/new-pub' component={CreatePub} />
      <Route exact path ='/pubs/:id' component={SinglePub} />
      <Route exact path='/admin' component={Admin} />
>>>>>>> b0e53fec6df9a130d96eb6b0e0b44df4f60e4ecd
    </Switch>
  </BrowserRouter>
  </>
}


export default App