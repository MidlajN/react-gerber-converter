import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';
import './configSection.css'
import { useGerberConfig } from './gerberContext';
import { generateOuterSvg } from './convert';
import svg2png from './svg2png'

export default function ConfigSection(props) {
    const { mainSvg } = useGerberConfig(); 
    const [active, setActive] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (mainSvg) {
            setActive(true);
        }
    }, [mainSvg])

    return (
        <>
        <div className="lg:w-1/5 lg:absolute left-0 top-8 ">
            <div className="p-5" style={{ 'pointerEvents' : active ? 'auto' : 'none' }}>
                <QuickSetup isChecked={isChecked} pngRef={props.pngRef} />
                <DoubleSideButton isChecked={isChecked} setIsChecked={setIsChecked} />
                <LayersToggleButtons isChecked={isChecked} />
                <CanvasBackground />
            </div>
        </div>
        </>
    )
}


function QuickSetup(props) {
    const { mainSvg, canvasBg, pngUrls, setPngUrls, fullLayers, topstack } = useGerberConfig();

    const handlePngConversion = () => {
        const targetSvg = mainSvg.svg === fullLayers ? topstack.svg.cloneNode(true) : mainSvg.svg.cloneNode(true); 
        const [outerSvg, gerberSvg] = targetSvg.querySelectorAll('svg');
        const svg = props.isChecked ? targetSvg : gerberSvg;
        const canvasBackground = canvasBg;
        const drillPath = gerberSvg.querySelector('#drillMask path');
        const fillColor = canvasBackground === 'black' ? '#ffffff' : '#000000';

        drillPath.setAttribute('fill', fillColor);
        outerSvg.setAttribute('style', `opacity: ${ props.isChecked ? 1 : 0}; fill:${ fillColor }`);

        const svgString = new XMLSerializer().serializeToString(svg);
        const width = parseFloat(svg.getAttribute('width'));
        const height = parseFloat(svg.getAttribute('height'));
        svg2png(svgString, width, height, canvasBackground).then(canvas => {
            canvas.setAttribute('style', 'width: 100%; height: 100%;');
            canvas.toBlob(pngBlob => {
                const blobUrl = (window.URL || window.webkitURL || window).createObjectURL(pngBlob);
                setPngUrls([...pngUrls, { name: mainSvg.id, url: blobUrl }]);
            }, 'image/png');
        }).catch(err => { console.error('Error converting svg to png :', err)});        
    }

    return (
        <>
            {/* Quick Setup and Convert Button */}
            <div className="setupDiv">
                <div>
                    <h5> Quick Setup</h5>
                    <select name="toolWidth" id="quickSetup">
                        <option value="custom-setup" defaultValue={true}>Custom</option>
                        <option value="top-trace">Top Trace</option>
                        <option value="top-drill">Top Drill</option>
                        <option value="top-cut">Top Cut</option>
                        <option value="bottom-trace" className="bottomSetup" disabled>Bottom Trace</option>
                        <option value="bottom-cut" className="bottomSetup" disabled>Bottom Cut</option>
                    </select>
                </div>
                <div>
                    <button className="convertBtn" id="renderButton" onClick={ handlePngConversion } data-layer="toplayers"><span className='text' id="renderBtnText">Generate PNG </span><span className="icon"><i className="fa-solid fa-download fa-sm"></i></span></button>
                </div>  
            </div>
        </>
    )
}


 
function DoubleSideButton(props) {
    const { isChecked, setIsChecked } = props;
    const { topstack, bottomstack, fullLayers, handleToggleCick, isToggled, stackConfig } = useGerberConfig();
    const toolWidthRef = useRef(null);

    const handleDoubleSide = (e) => {
        setIsChecked(!isChecked);

        if (!e.target.checked && !isToggled['commonlayer']['outlayer'] || e.target.checked && isToggled['commonlayer']['outlayer']) {
            handleToggleCick('commonlayer', 'outlayer');
        }

        topstack.svg.querySelector('#toplayerouter').style.display = isChecked ? 'none' : 'block';
        bottomstack.svg.querySelector('#bottomlayerouter').style.display = isChecked ? 'none' : 'block';
        fullLayers.querySelector('#fullstackouter').style.display = isChecked ? 'none' : 'block';
    }


    const handleToolWidth = () => {
        const toolwidth = parseFloat(toolWidthRef.current.value);
        const svgs = [{stack: topstack, name:'toplayer'}, {stack: bottomstack, name:'bottomlayer'}, {stack: fullLayers, name:'fullstack'}];

        svgs.forEach(({stack, name}) => {
            const outer = stack.svg.querySelector(`#${name}outer`);
            const main = stack.svg.querySelector(`#${name}MainG`);

            const newOuter = generateOuterSvg(stackConfig.width, stackConfig.height, toolwidth, { viewboxX: stackConfig.viewbox.viewboxX, viewboxY: stackConfig.viewbox.viewboxY });
            newOuter.svg.setAttribute('id', `${name}outer-svg`);
            newOuter.svg.setAttribute('style', 'fill: #86877c; opacity: 0.5');
            stack.svg.setAttribute('width', `${newOuter.width}mm`);
            stack.svg.setAttribute('height', `${newOuter.height}mm`);
            outer.querySelector('svg').replaceWith(newOuter.svg);
            main.setAttribute('transform', `translate(${ toolwidth === 0 ? 0 : 3 } ${ toolwidth === 0 ? 0 : 3 })`);
        })
    }

    return (
        <>
            {/* Double Side Toggle and Tool Width Selection */}
            <div className="doubleSideDiv" id="doubleSideOuterDiv">
                <div className="checkbox">
                    <span>Double Side</span>
                    <label className="toggle" id="doubleSideToggle">
                    <input type="checkbox" id="sideToggle" onChange={ handleDoubleSide } />
                    <div className="slider">
                        <span className="oneSide"></span>
                        <span className="twoSide"></span>
                    </div>
                    </label>
                </div>
                <div className={ `selectToolWidth ${ isChecked ? '' : 'layerHide' }`} id="selectToolWidth">
                    <span>Tool Width</span>
                    <select ref={ toolWidthRef } name="toolWidth" id="toolWidth" onChange={ handleToolWidth }>
                        <option value="0.8">0.8</option>
                        <option value="0.0">0.0</option>
                    </select>
                </div>
            </div>
        </>
    )
}

function LayersToggleButtons({ isChecked }) {
    const { isToggled } = useGerberConfig();

    const layers = [
        { type: 'toplayer', label: 'Top Layer', colors: ['#ced8cd', '#b9a323', '#348f9b'], properties: ['trace', 'pads', 'silkscreen'], ids: ['top_copper', 'top_solderpaste', 'top_silkscreen'] },
        { type: 'bottomlayer', label: 'Bottom Layer', colors: ['#206b19', '#b9a323', '#348f9b'], properties: ['trace', 'pads', 'silkscreen'], ids: ['bottom_copper', 'bottom_solderpaste', 'bottom_silkscreen'] },
        { type: 'commonlayer', label: null, colors: ['#206b19', '#b9a323', '#348f9b'], properties: ['outline', 'drill', 'outlayer'], ids: ['outline', 'drill', 'outer'] },
    ]

    return (
        <>
            <div className="toggleLayers p-3 lg:block md:flex md:items-end md:gap-5">
                { layers.map((layer, index) => (
                    <div key={index} className={ layer.label ? layer.type + ' lg:mt-5' : 'commonlayer lg:mt-5 md:items-end'}>
                        <div className="heading">
                            <h5>{ layer.label }</h5>
                        </div>
                        { layer.colors.map((color, i) =>(
                            <ToggleButton 
                                key={i} 
                                color={color} 
                                layerType={layer.type} 
                                layerProperty={layer.properties[i]}  
                                isToggled={ isToggled[layer.type][layer.properties[i]] } 
                                layerId={layer.ids[i]}
                                isChecked={isChecked}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}

function ToggleButton(props) {
    const { topstack, bottomstack, fullLayers, handleToggleCick } = useGerberConfig();
    const { color, layerType, layerProperty, isToggled, layerId, isChecked } = props;

    const handleClick = () => {
        let layerGroups = [];

        if (layerId === 'toplayer') {
            layerGroups = [topstack.svg.querySelectorAll('g'), fullLayers.querySelectorAll('g')];
        } else if (layerId === 'bottomlayer') {
            layerGroups = [bottomstack.svg.querySelectorAll('g'), fullLayers.querySelectorAll('g')];
        } else {
            layerGroups = [topstack.svg.querySelectorAll('g'), bottomstack.svg.querySelectorAll('g'), fullLayers.querySelectorAll('g')];
        }

        layerGroups.forEach(layerGroup => {
            layerGroup.forEach(layer => {
                if (layer.hasAttribute('id') && layer.getAttribute('id').includes(layerId)) {
                    layer.style.display = isToggled ? 'block' : 'none';
                }
            })
        })

        if (layerId === 'outline') {
            [topstack, bottomstack].forEach(stack => {
                const clipPath = stack.svg.querySelector('clipPath');
                if (clipPath) {
                    clipPath.style.display = isToggled ? 'block' : 'none';
                }
            })
        }
        handleToggleCick(layerType, layerProperty);
    }

    return (
        <div className={`layer ${ layerProperty === 'outlayer' ? isChecked ? '' : 'layerHide' : ''}`}>
            <span style={{ textTransform:'capitalize' }}>{ layerProperty }</span>
            <button className="toggleButton" style={{ 'backgroundColor': isToggled ? 'white' : color }} onClick={ handleClick }>
                <FontAwesomeIcon icon={ isToggled ? faEyeSlash : faEye } style={{ 'color': isToggled ?  '#000000' : '#ffffff'}}/>
            </button>
        </div>  
    )
}


function CanvasBackground() {
    const { setCanvasBg } = useGerberConfig();
    return (
        <>
            {/* Canvas Background Selector */}
            <div className="canvasDiv">
                <label htmlFor='canvasSelect'>Canvas Background </label>
                <select name="canvasSelect" id="canvasBg" onChange={(e) => setCanvasBg(e.target.value)}>
                    <option value="black" defaultValue={true}>Black</option>
                    <option value="white">White</option>
                </select>
            </div> 
        </>
    )
}