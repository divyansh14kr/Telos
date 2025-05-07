import {useState} from 'react'
import './App.css'
import { LoginForm } from './components/middleware/login'
import { SignupForm } from './components/middleware/signup'
import { Homepage } from './components/middleware/Homepage'
import TelosValues from './components/middleware/ValueBoard'
import { BrowserRouter, Route,Routes} from 'react-router-dom'


function App() {


  return (

      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/signup' element={<SignupForm/>}/>
        <Route path='/login' element ={<LoginForm/>}/>
        <Route path='home' element={<TelosValues/>}/>
      </Routes>
      </BrowserRouter>



  )
}

export default App
