import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Main.css';

const Main = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container">
      <button className="button" onClick={() => navigate('/login')}>Login</button>
      <button className="button" onClick={() => navigate('/signup')}>Signup</button>
    </div>
  )
}

export default Main