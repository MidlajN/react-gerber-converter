import { useEffect, useRef, useState } from "react";
import ConfigSection from "./configSection.jsx"
import './gerber.css'
import pcbLogo from '../assets/pcbLogo.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import convertToSvg from "./convert.jsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


function GerberSection() {
    const [isDragging, setIsDragging] = useState(false);
    const [topstack, setTopStack] = useState(null);
    const [bottomstack, setBottomStack] = useState(null);
    const [fullLayers, setFullLayers] = useState(null);

    const resultRef = useRef(null);
    const dropAreaRef = useRef(null);

    useEffect(() => {

        if (topstack) {
            resultRef.current.innerHTML = '';

            resultRef.current.appendChild(topstack)
            // resultRef.current.appendChild(bottomstack)
        }

    }, [topstack, bottomstack])

    const handleInputFiles = (e) => {
        e.preventDefault();

        // Access the Files From DataTransfer Object if the files are dropped
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        convertToSvg(files, setTopStack, setBottomStack, setFullLayers).then(() => {
            dropAreaRef.current.style.display = 'none';
        })
    }
    
    return (
        <>
            <div className="relative h-[90%] " >
                <div className="w-1/5 absolute left-0 top-8 ">
                    <ConfigSection />
                </div>
                <div className="h-full flex items-center justify-end">
                    <div className="w-4/5 h-full gridsection">
                        <div 
                            ref={ dropAreaRef }
                            className={`dropArea ${isDragging ? 'active' : ''}`} 
                            onDragOver={(e) => { e.preventDefault() }} 
                            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }} 
                            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }} 
                            onDrop={ handleInputFiles }
                        >
                            <div className="dropbox">
                                <div className="shadow">
                                    <p>Drop your Gerber file here</p>
                                    <input type="file" id="gerberFileInput" onChange={ handleInputFiles } multiple/>
                                </div>
                            </div>
                        </div>

                        <TransformWrapper 
                            initialScale={1} 
                            minScale={.5} 
                            limitToBounds={false }
                        >
                            <TransformComponent
                                contentStyle={{  margin:'auto', transition: 'transform 0.3s ease' }} 
                                wrapperStyle={{ width: '100%', height: '100%', overflow:'visible', display:'flex'}} 
                            >
                                <div ref={ resultRef } className="flex items-center h-full justify-center"></div>
                            </TransformComponent>
                        </TransformWrapper>






                        {/* <div className="pngDiv">
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
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default GerberSection
