import { useEffect, useRef, useState } from "react";
import ConfigSection from "./configSection.jsx"
import './gerber.css'
import convertToSvg from "./convert.jsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useGerberConfig } from "./gerberContext.jsx";
import { PngComponent } from "./svg2png.jsx";
import JSZip from "jszip";


export default function GerberSection() {
    const [isAnimating, setIsAnimating] = useState(false);
    const { mainSvg, pngUrls, setPngUrls } = useGerberConfig();
    const resultRef = useRef(null);
    const pngRef = useRef(null)

    useEffect(() => {
        if (resultRef.current && mainSvg.svg) {  
            setIsAnimating(true);
            setTimeout(() => {
                resultRef.current.innerHTML = '';
                setTimeout(() => {
                    resultRef.current.appendChild(mainSvg.svg);
                    setIsAnimating(false);
                }, 250);
            }, 300); 
        }
    },[mainSvg])


    const downloadZip = () => {
        const zip = new JSZip();
        Promise.all(
            pngUrls.map((pngBlob, index) => {
                return new Promise((resolve) => {
                    fetch(pngBlob.url).then(response => response.blob()).then(blob => {
                        zip.file(`${pngBlob.name}_${index}.png`, blob);
                        resolve();
                    })
                })
            })
        ).then(() => {
            zip.generateAsync({ type : 'blob' }).then(zipBlob => {
                const url = window.URL.createObjectURL(zipBlob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `gerber_files_${pngUrls.length}.zip`);
                document.body.appendChild(link);
                link.click();
            }).catch(err => { console.log('Error Generating Zip File :', err) })
        })
    }


    const transitionStyle = {
        transition: 'opacity 0.3s ease-in-out',
        opacity: isAnimating ? 0 : 1,
    };
 
    return (
        <>
            <div className="relative h-[90%] " >

                <ConfigSection pngRef={pngRef}/>
                
                <div className="h-full flex items-center justify-end">
                    <div className="lg:w-4/5 md:w-full h-full gridsection">
                        <SvgSideComponent />

                        <DropAreaComponent />

                        <TransformWrapper initialScale={1} minScale={.5} limitToBounds={ false }>
                            <TransformComponent
                                contentStyle={{  margin:'auto', transition: 'transform 0.3s ease' }} 
                                wrapperStyle={{ width: '100%', height: '100%', overflow:'visible', display:'flex'}} 
                            >
                                <div ref={ resultRef } style={transitionStyle} className="flex items-center h-full justify-center"></div>
                            </TransformComponent>
                        </TransformWrapper>

                        <SvgColorComponent />

                        <div className="pngDiv">
                            { pngUrls.length > 0 && (
                                <div className="zipDiv">
                                    <button className="button-side" style={{ width: '100%' }} onClick={ downloadZip }><span className="text">Download Zip</span></button>
                                </div>
                            )}
                            <div ref={pngRef}>
                                {/* Create a shallow copy of the pngUrl to render it in reverse order */}
                                { pngUrls.slice().reverse().map((url, index) => (
                                    <PngComponent 
                                        key={index} 
                                        blobUrl={ url.url } 
                                        name={ `${ url.name }.png` } 
                                        handleDelete={ () => {
                                            setPngUrls((prevState) => {
                                                const newState = [...prevState];
                                                newState.splice(pngUrls.length - 1 - index, 1);
                                                return newState
                                            });
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


function DropAreaComponent() {
    const { setTopStack, setBottomStack, setFullLayers, setMainSvg, setLayerType, setStackConfig } = useGerberConfig();

    const [isDragging, setIsDragging] = useState(false);
    const dropAreaRef = useRef(null);

    const handleInputFiles = (e) => {
        e.preventDefault();

        // Access the Files From DataTransfer Object if the files are dropped
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        convertToSvg(files, setTopStack, setBottomStack, setFullLayers, setMainSvg, setStackConfig).then(() => {
            dropAreaRef.current.style.display = 'none';   
            setLayerType('original')
        })
    }

    return (
        <>
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
        </>
    )
}

function SvgColorComponent() {
    const { topstack, bottomstack, layerType, setLayerType } = useGerberConfig();
    return (
        <>
            <div className="layerTypeBtnGroup">
                <button 
                    id="original" 
                    className={`button-side colorButton ${ layerType === 'original' ? 'active' : ''}`}
                    role="button"
                    onClick={ () => { handleColorChange({ color: 'original', id: topstack.id, topstack: topstack, bottomstack: bottomstack }); setLayerType('original') } }
                ><span className="textnew_gerber_png">Original</span></button>

                <button 
                    id="bw" 
                    className={`button-side colorButton ${ layerType === 'bw' ? 'active' : ''}`}
                    role="button"
                    onClick={ () => { handleColorChange({ color: 'bw', id: topstack.id, topstack: topstack, bottomstack: bottomstack }); setLayerType('bw') }}
                ><span className="text">B/W</span></button>

                <button 
                    id="invert" 
                    className={`button-side colorButton ${ layerType === 'bwInvert' ? 'active' : ''}`}
                    role="button"
                    onClick={ () => { handleColorChange({ color: 'bwInvert', id: topstack.id, topstack: topstack, bottomstack: bottomstack }); setLayerType('bwInvert') }}
                ><span className="text">Invert</span></button> 
            </div>
        </>
    )
}

function SvgSideComponent() {
    const { topstack, bottomstack, fullLayers, mainSvg, setMainSvg } = useGerberConfig();
    return (
        <>
            <div className="layerSideBtnGroup">
                <button className={ mainSvg.svg === fullLayers ? 'button-side active' : 'button-side'} onClick={() => { setMainSvg({ id: 'Full Layers', svg: fullLayers }) }}><span className="text">Layers</span></button>
                <button className={ mainSvg.svg === topstack.svg ? 'button-side active' : 'button-side'} onClick={() => { setMainSvg({ id: 'top_layer', svg: topstack.svg}) }}><span className="text">Top</span></button>
                <button className={ mainSvg.svg === bottomstack.svg ? 'button-side active' : 'button-side'} onClick={() => { setMainSvg({ id: 'bottom_layer', svg: bottomstack.svg }) }}><span className="text">Bottom</span></button>
            </div>
        </>
    )
}


export function handleColorChange(props) {
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

