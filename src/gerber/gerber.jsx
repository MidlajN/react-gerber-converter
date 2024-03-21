import { useEffect, useRef, useState } from "react";
import ConfigSection from "./configSection.jsx"
import './gerber.css'
import convertToSvg from "./convert.jsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


export default function GerberSection() {
    const [isDragging, setIsDragging] = useState(false);
    const [topstack, setTopStack] = useState({id: null, svg: null});
    const [bottomstack, setBottomStack] = useState({id: null, svg: null});
    const [fullLayers, setFullLayers] = useState(null);
    const [mainSvg, setMainSvg] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [layerType, setLayerType] = useState(null);
    const [isToggled, setIsToggled] = useState({
        toplayer: { trace: false, pads: false, silkscreen: false },
        bottomlayer: { trace: false, pads: false, silkscreen: false },
        commonlayer: { outline: false, drill: false, outlayer: false}
    });
    const hangleToggleCick = (layertype, layerproperty) => {
        setIsToggled((prevState) => ({
            ...prevState,
            [layertype]: {
                ...prevState[layertype],
                [layerproperty]: !prevState[layertype][layerproperty],
            }
        }));
    }

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


    return (
        <>
            <div className="relative h-[90%] " >
                <div className="lg:w-1/5 lg:absolute left-0 top-8 ">
                    <ConfigSection mainSvg={ mainSvg } isToggled={ isToggled } setIsToggled={ setIsToggled } onToggle={ hangleToggleCick }/>
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
                                onClick={ () => { handleColorChange({ color: 'original', id: topstack.id, topstack: topstack, bottomstack: bottomstack }); setLayerType('original') } }
                            ><span className="text">Original</span></button>

                            <button 
                                id="bw" 
                                className={`button-side colorButton ${layerType === 'bw' ? 'active' : ''}`}
                                role="button"
                                onClick={ () => { handleColorChange({ color: 'bw', id: topstack.id, topstack: topstack, bottomstack: bottomstack }); setLayerType('bw') }}
                            ><span className="text">B/W</span></button>

                            <button 
                                id="invert" 
                                className={`button-side colorButton ${layerType === 'bwInvert' ? 'active' : ''}`}
                                role="button"
                                onClick={ () => { handleColorChange({ color: 'bwInvert', id: topstack.id, topstack: topstack, bottomstack: bottomstack }); setLayerType('bwInvert') }}
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

function handleColorChange(props) {
    const svgColor = {
        'bw': `
            ${props.id}_fr4 {color: #000000  !important;}
            .${props.id}_cu {color: #ffffff !important;}
            .${props.id}_cf {color: #ffffff !important;}
            .${props.id}_sm {color: #ffffff; opacity: 0 !important;}
            .${props.id}_ss {color: #ffffff !important;}
            .${props.id}_sp {color: #ffffff !important;}
            .${props.id}_out {color: #000000 !important;}
        `,

        'bwInvert': `
            .${props.id}_fr4 {color: #ffffff  !important;}
            .${props.id}_cu {color: #000000 !important;}
            .${props.id}_cf {color: #000000 !important;}
            .${props.id}_sm {color: #ffffff; opacity: 0 !important;}
            .${props.id}_ss {color: #000000 !important;}
            .${props.id}_sp {color: #000000 !important;}
            .${props.id}_out {color: #ffffff !important;}
        `,

        'original': `
            .${props.id}_fr4 {color: #666666  !important;}
            .${props.id}_cu {color: #cccccc !important;}
            .${props.id}_cf {color: #cc9933 !important;}
            .${props.id}_sm {color: #004200 !important; opacity: 0.75 !important;}
            .${props.id}_ss {color: #ffffff !important;}
            .${props.id}_sp {color: #999999 !important;}
            .${props.id}_out {color: #000000 !important;}
        `
    }

    const topstackStyle = props.topstack.svg.querySelector('style');
    topstackStyle.innerHTML = svgColor[props.color];

    const bottomstackStyle = props.bottomstack.svg.querySelector('style');
    bottomstackStyle.innerHTML = svgColor[props.color];

}