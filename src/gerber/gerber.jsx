import { useEffect, useRef, useState } from "react";
import ConfigSection from "./configSection.jsx"
import './gerber.css'
import pcbLogo from '../assets/pcbLogo.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import convertToSvg from "./convert.jsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


function GerberSection() {
    const [isDragging, setIsDragging] = useState(false);
    const [topstack, setTopStack] = useState({id: null, svg: null});
    const [bottomstack, setBottomStack] = useState({id: null, svg: null});
    const [fullLayers, setFullLayers] = useState(null);
    const [mainSvg, setMainSvg] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [layerType, setLayerType] = useState(null);

    const resultRef = useRef(null);
    const dropAreaRef = useRef(null);

    useEffect(() => {

        if (resultRef.current && mainSvg) {
            
            setIsAnimating(true);
            setTimeout(() => {
                resultRef.current.innerHTML = '';
                setTimeout(() => {
                    resultRef.current.appendChild(mainSvg);
                    setIsAnimating(false);
                }, 250);
            }, 300);
            
        }
    },[mainSvg])


    const transitionStyle = {
        transition: 'opacity 0.3s ease-in-out',
        opacity: isAnimating ? 0 : 1,
    };


    const handleInputFiles = (e) => {
        e.preventDefault();

        // Access the Files From DataTransfer Object if the files are dropped
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        convertToSvg(files, setTopStack, setBottomStack, setFullLayers, setMainSvg).then(() => {
            dropAreaRef.current.style.display = 'none';   
            setLayerType('original')
        })
    }


    const handleColorChange = (color, id) => {
        const svgColor = {
            'bw': `
                ${id}_fr4 {color: #000000  !important;}
                .${id}_cu {color: #ffffff !important;}
                .${id}_cf {color: #ffffff !important;}
                .${id}_sm {color: #ffffff; opacity: 0 !important;}
                .${id}_ss {color: #ffffff !important;}
                .${id}_sp {color: #ffffff !important;}
                .${id}_out {color: #000000 !important;}
            `,

            'bwInvert': `
                .${id}_fr4 {color: #ffffff  !important;}
                .${id}_cu {color: #000000 !important;}
                .${id}_cf {color: #000000 !important;}
                .${id}_sm {color: #ffffff; opacity: 0 !important;}
                .${id}_ss {color: #000000 !important;}
                .${id}_sp {color: #000000 !important;}
                .${id}_out {color: #ffffff !important;}
            `,

            'original': `
                .${id}_fr4 {color: #666666  !important;}
                .${id}_cu {color: #cccccc !important;}
                .${id}_cf {color: #cc9933 !important;}
                .${id}_sm {color: #004200 !important; opacity: 0.75 !important;}
                .${id}_ss {color: #ffffff !important;}
                .${id}_sp {color: #999999 !important;}
                .${id}_out {color: #000000 !important;}
            `
        }

        const topstackStyle = topstack.svg.querySelector('style');
        topstackStyle.innerHTML = svgColor[color];

        const bottomstackStyle = bottomstack.svg.querySelector('style');
        bottomstackStyle.innerHTML = svgColor[color];

        setLayerType(color)
    }


    return (
        <>
            <div className="relative h-[90%] " >
                <div className="lg:w-1/5 lg:absolute left-0 top-8 ">
                    <ConfigSection mainSvg={ mainSvg }/>
                </div>
                <div className="h-full flex items-center justify-end">
                    <div className="lg:w-4/5 md:w-full h-full gridsection">
                        <div className="layerSideBtnGroup">
                            <button className={ mainSvg === fullLayers ? 'button-side active' : 'button-side'} onClick={() => { setMainSvg(fullLayers) }}><span className="text">Layers</span></button>
                            <button className={ mainSvg === topstack.svg ? 'button-side active' : 'button-side'} onClick={() => { setMainSvg(topstack.svg) }}><span className="text">Top</span></button>
                            <button className={ mainSvg === bottomstack.svg ? 'button-side active' : 'button-side'} onClick={() => { setMainSvg(bottomstack.svg) }}><span className="text">Bottom</span></button>
                        </div>
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
                                <div ref={ resultRef } style={transitionStyle} className="flex items-center h-full justify-center"></div>
                            </TransformComponent>
                        </TransformWrapper>

                        <div className="layerTypeBtnGroup">
                            <button 
                                id="original" 
                                className={`button-side colorButton ${layerType === 'original' ? 'active' : ''}`}
                                role="button"
                                onClick={ () => { handleColorChange('original', topstack.id) } }
                            ><span className="text">Original</span></button>

                            <button 
                                id="bw" 
                                className={`button-side colorButton ${layerType === 'bw' ? 'active' : ''}`}
                                role="button"
                                onClick={ () => { handleColorChange('bw', topstack.id) }}
                            ><span className="text">B/W</span></button>

                            <button 
                                id="invert" 
                                className={`button-side colorButton ${layerType === 'bwInvert' ? 'active' : ''}`}
                                role="button"
                                onClick={ () => { handleColorChange('bwInvert', topstack.id) }}
                            ><span className="text">Invert</span></button> 
                        </div>




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
