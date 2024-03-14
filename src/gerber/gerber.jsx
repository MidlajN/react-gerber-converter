import { useEffect, useRef } from "react";
import ConfigSection from "./configSection.jsx"
import './gerber.css'
import pcbLogo from '../assets/pcbLogo.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function GerberSection() {
    const resultRef = useRef(null);
    return (
        <>
            <div className="relative h-[90%] " >
                <div className="w-1/5 absolute left-0 top-8 ">
                    <ConfigSection />
                </div>
                <div className="h-full flex items-center justify-end">
                    <div className="w-4/5 h-full gridsection">
                        <div id="dropArea" className="dropArea" style={{'display': 'flex'}}>
                            <div className="dropbox">
                                <div className="shadow">
                                    <p>Drop your Gerber file here</p>
                                    <input type="file" id="gerberFileInput" multiple/>
                                </div>
                            </div>
                        </div>
                        <div id="result" ref={resultRef} >
                            <div className="pngDiv">
                                <div className="png">
                                    <img className="w-full" src={ pcbLogo } alt="" />
                                    <div className="footer">
                                        <span>new_gerber_png.png</span>
                                        <div className="buttons gap-2 flex">
                                            <a href="">
                                                <FontAwesomeIcon icon="fa-solid fa-download" />
                                            </a>
                                            <a href="">
                                                <FontAwesomeIcon icon="fa-solid fa-trash" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GerberSection
