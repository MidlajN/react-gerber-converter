import pcbLogo from './assets/pcbLogo.png'
import './App.css'
import GerberSection from './gerber/gerber.jsx'
import { GerberProvider } from './gerber/gerberContext.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faFacebook, faDropbox, faHubspot, faWordpress } from '@fortawesome/free-brands-svg-icons'


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
        <div className='flex gap-3'>
          <a href="https://git.fablabkerala.in/midlaj/gerber2png/-/wikis/home" target='_blank'>
            <WikiIcon />
          </a>
          <a href="https://git.fablabkerala.in/midlaj/gerber2png" target='_blank'>
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

const WikiIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-book-marked"
    {...props}
  >
    <path d="M10 2v8l3-3 3 3V2" />
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
  </svg>
);
