import pcbLogo from './assets/pcbLogo.png'
import './App.css'
import GerberSection from './gerber/gerber.jsx'
import { GerberProvider } from './gerber/gerberContext.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'


function App() {

  return (
    <>
     <div className='px-10 py-6 h-lvh'>
      <nav className="w-full flex justify-between items-center mb-5 navbar h-[6%]">
        <div className='flex items-center ps-5'>
          <img className="w-9" src={ pcbLogo } alt="" />
          <div>
          <span className='gerber'>Gerber</span><span className='two'>2</span><span className='png'>PNG</span>
          </div>
        </div>
        <div>
          <a href="https://git.fablabkerala.in/midlaj/react-gerber-converter" target='_blank'>
            <FontAwesomeIcon icon={ faGithub } size="xl" />
          </a>
        </div>
      </nav>

      <GerberProvider>
        <GerberSection />
      </GerberProvider>
     </div>

    </>
  )
}

export default App
