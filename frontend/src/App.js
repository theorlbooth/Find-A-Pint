import React from 'react'
import { BrowserRouter, Switch, Route }  from 'react-router-dom'
import bulma from 'bulma'


import '../styles/style.scss'

import Home from './components/Home'
import NavBar from './components/Navbar'
<<<<<<< HEAD
import Signup from './components/Signup'
import Login from './components/Login'
import PubList from './components/PubList'
import CreatePub from './components/CreatePub'
=======
import Maps from './components/Maps'
>>>>>>> Adambranch

const App = () => {
  return <>
  <BrowserRouter>
    <NavBar />
    <Switch>
      <Route exact path='/' component={Home} />
<<<<<<< HEAD
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/login' component={Login} />
      <Route exact path='login' component={Login} /> */}
=======
      <Route exact path='/pubs/maps' component={Maps}/>
      {/* <Route exact path='/signup' component={Signup} />
      <Route exact path='login' component={Login} />

>>>>>>> Adambranch
      <Route exact path='/pubs' component={PubList} />
      {/* <Route exact path='/pubs/:pubId' component={SinglePub} /> */}
      <Route exact path='/pubs/new-pub' component={CreatePub} />
      {/* <Route exact path='/pubs/edit-pub/:pubId' component={EditPub} /> */}
    </Switch>
  </BrowserRouter>
  </>
}


export default App