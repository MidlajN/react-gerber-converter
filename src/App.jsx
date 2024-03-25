import pcbLogo from './assets/pcbLogo.png'
import './App.css'
import GerberSection from './gerber/gerber.jsx'
import { GerberProvider } from './gerber/gerberContext.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

library.add(fab, fas, far);


function App() {

  return (
    <>
     <div className='px-10 py-6 h-lvh'>
      <nav className="w-full flex justify-between items-center mb-5 navbar h-[6%]">
        <div className='flex items-center'>
          <img className="w-9" src={ pcbLogo } alt="" />
          <div>
          <span className='gerber'>Gerber</span><span className='two'>2</span><span className='png'>PNG</span>
          </div>
        </div>
        <div>
          <a href="https://git.fablabkerala.in/midlaj/GerberViewer" target='_blank'>
            <FontAwesomeIcon icon="fa-brands fa-github" size="xl" />
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
