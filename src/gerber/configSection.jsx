import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import './configSection.css'


function ConfigSection(props) {
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (props.mainSvg) {
            setActive(true);
        }
    }, [props.mainSvg])

    const ToggleButton = (props) => {
        const [isToggled, setIsToggled] = useState(false);

        const handleClick = () => {
            setIsToggled(!isToggled);
        }

        return (
            <div className="layer">
                <span>Traces</span>
                <button className="toggleButton" style={{ 'backgroundColor': isToggled ? 'white' : props.color }} onClick={ handleClick }>
                    <FontAwesomeIcon icon={ isToggled ? faEyeSlash : faEye } style={{ 'color': isToggled ?  '#000000' : '#ffffff'}}/>
                </button>
            </div>  
        )
    }




    return (
        <>
        <div className="p-5" style={{ 'pointerEvents' : active ? 'auto' : 'none' }}>
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

        {/* Double Side Toggle and Tool Width Selection */}
            <div className="doubleSideDiv" id="doubleSideOuterDiv">
                <div className="checkbox">
                    <span>Double Side</span>
                    <label className="toggle" id="doubleSideToggle">
                    <input type="checkbox" id="sideToggle" />
                    <div className="slider">
                        <span className="oneSide"></span>
                        <span className="twoSide"></span>
                    </div>
                    </label>
                </div>
                <div className="selectToolWidth layerHide" id="selectToolWidth">
                    <span>Tool Width</span>
                    <select name="toolWidth" id="toolWidth">
                        <option value="0.8">0.8</option>
                        <option value="0.0">0.0</option>
                    </select>
                </div>
            </div>

        {/* Layers Toggle Buttons */}
            <div className="toggleLayers p-3 lg:block md:flex md:items-end md:gap-5">
                <div className='topLayers'>
                    <div className="heading">
                        <h5>Top Layer</h5>
                    </div>
                    <ToggleButton color="#ced8cd"/> 
                    <ToggleButton color="#b9a323"/>
                    <ToggleButton color="#348f9b"/>
                </div>

                <div className='bottomLayers lg:mt-5'>
                    <div className="heading">
                        <h5>Bottom Layer</h5>
                    </div>
                    <ToggleButton color="#206b19"/> 
                    <ToggleButton color="#b9a323"/>
                    <ToggleButton color="#348f9b"/>
                </div>

                <div className='commonLayers lg:mt-10 md:items-end'>
                    <ToggleButton color="#348f9b"/>
                    <ToggleButton color="#348f9b"/>
                    <ToggleButton color="rgb(85 119 89)"/>
                </div>
            </div>

        {/* Canvas Background Selector */}
            <div className="canvasDiv">
                <label htmlFor='canvasSelect'>Canvas Background </label>
                <select name="canvasSelect" id="canvasBg">
                    <option value="black" defaultValue={true}>Black</option>
                    <option value="white">White</option>
                </select>
            </div> 

        </div>
        </>
    )
}
export default ConfigSection


