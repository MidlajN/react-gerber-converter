import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';
import './configSection.css'


export default function ConfigSection(props) {
    const { mainSvg, isToggled, onToggle } = props;
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (mainSvg) {
            setActive(true);
        }
    }, [mainSvg])

    return (
        <>
        <div className="p-5" style={{ 'pointerEvents' : active ? 'auto' : 'none' }}>
            <QuickSetup />
            <DoubleSideButton />
            <LayersToggleButtons isToggled={ isToggled } onToggle={ onToggle }/>
            <CanvasBackground />
        </div>
        </>
    )
}


function QuickSetup() {
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
                    <button className="convertBtn" id="renderButton" data-layer="toplayers"><span className='text' id="renderBtnText">Generate PNG </span><span className="icon"><i className="fa-solid fa-download fa-sm"></i></span></button>
                </div>  
            </div>
        </>
    )
}


 
function DoubleSideButton() {
    const [isChecked, setIsChecked] = useState(false);
    const toolWidthRef = useRef(null);

    const handleDoubleSide = () => {
        setIsChecked(!isChecked);
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
                    <select ref={ toolWidthRef } name="toolWidth" id="toolWidth">
                        <option value="0.8">0.8</option>
                        <option value="0.0">0.0</option>
                    </select>
                </div>
            </div>
        </>
    )
}

function LayersToggleButtons({isToggled, onToggle}) {
    const layers = [
        { type: 'toplayer', label: 'Top Layer', colors: ['#ced8cd', '#b9a323', '#348f9b'], properties: ['trace', 'pads', 'silkscreen'], ids: ['top_copper', 'top_solderpaste', 'top_silkscreen'] },
        { type: 'bottomlayer', label: 'Bottom Layer', colors: ['#206b19', '#b9a323', '#348f9b'], properties: ['trace', 'pads', 'silkscreen'], ids: ['bottom_copper', 'bottom_solderpaste', 'bottom_silkscreen'] },
        { type: 'commonlayer', label: null, colors: ['#206b19', '#b9a323', '#348f9b'], properties: ['outline', 'drill', 'outlayer'], ids: ['outline', 'drill', 'OuterLayer'] },
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
                                onToggle={ onToggle }
                                layerId={layer.ids[i]}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}

function ToggleButton(props) {
    const { color, layerType, layerProperty, isToggled, onToggle, layerId } = props;

    const handleClick = () => {
        onToggle(layerType, layerProperty);
    }

    return (
        <div className="layer">
            <span style={{ textTransform:'capitalize' }}>{ layerProperty }</span>
            <button className="toggleButton" style={{ 'backgroundColor': isToggled ? 'white' : color }} onClick={ handleClick }>
                <FontAwesomeIcon icon={ isToggled ? faEyeSlash : faEye } style={{ 'color': isToggled ?  '#000000' : '#ffffff'}}/>
            </button>
        </div>  
    )
}


function CanvasBackground() {
    return (
        <>
            {/* Canvas Background Selector */}
            <div className="canvasDiv">
                <label htmlFor='canvasSelect'>Canvas Background </label>
                <select name="canvasSelect" id="canvasBg">
                    <option value="black" defaultValue={true}>Black</option>
                    <option value="white">White</option>
                </select>
            </div> 
        </>
    )
}