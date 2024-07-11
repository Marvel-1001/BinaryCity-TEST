import React from 'react'
import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import ViewClient from './ViewClient'
import CreateClient from './CreateClient'
import UpdateClient from './UpdateClient'
import CreateContacts from './CreateContacts'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ViewClient />}></Route>
          <Route path='/create-contact' element={<CreateContacts />}></Route>
          <Route path='/create' element={<CreateClient />}></Route>
          <Route path='/update' element={<UpdateClient />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
