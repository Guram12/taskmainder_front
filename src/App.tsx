import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage'
import Login from './auth/login'
import Register from './auth/register'
import Boards from './components/Boards';





const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<MainPage />} />
        <Route path='/boards' element={<Boards />} />
      </Routes>

    </Router>
  )
}

export default App
