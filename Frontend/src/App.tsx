import {useState} from 'react'
import './App.css'
import { LoginForm } from './components/middleware/login'
import { SignupForm } from './components/middleware/signup'
import { Homepage } from './components/middleware/Homepage'

function App() {


  return (

     <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Homepage/>

    </div>

  )
}

export default App
