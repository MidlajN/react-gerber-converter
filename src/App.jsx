import { useState } from 'react'
// import { FontAwesomeIcon } from '@fortawesome/fontawesome-free'
import pcbLogo from './assets/pcbLogo.png'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <nav className="w-full flex justify-between items-center px-10 py-6 navbar">
        <div className='flex items-center'>
          <img className="w-8" src={ pcbLogo } alt="" />
          <span className='gerber'>Gerber<span className='snap'>SNAP</span></span>
        </div>
        <div>
        <FontAwesomeIcon icon="fa-solid fa-bars" />
        </div>
      </nav>

    </>
  )
}

export default App
