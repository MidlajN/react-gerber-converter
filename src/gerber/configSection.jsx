import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './configSection.css'

function ConfigSection() {
    return (
        <>
        <div className="p-5">
        {/* Quick Setup and Convert Button */}
            <div className="setupDiv">
                <div>
                    <h5 for="toolWidth"> Quick Setup</h5>
                    <select name="toolWidth" id="quickSetup">
                        <option value="custom-setup" selected>Custom</option>
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
            <div className="toggleLayers p-3">
                <div className='topLayers'>
                    <div className="heading">
                        <h5>Top Layer</h5>
                    </div>
                    <div className="layer">
                        <span>Traces</span>
                        <button className="toggleButton" style={{'background-color': '#ced8cd'}}><FontAwesomeIcon icon="fa-solid fa-eye" style={{'color': '#ffffff'}}/></button>
                    </div>
                    <div className="layer">
                        <span>Pads</span>
                        <button className="toggleButton" style={{'background-color': '#b9a323'}}><FontAwesomeIcon icon="fa-solid fa-eye" style={{'color': '#ffffff'}}/></button>
                    </div>
                    <div className="layer">
                        <span>Silk Screen</span>
                        <button className="toggleButton" style={{'background-color': '#348f9b'}}><FontAwesomeIcon icon="fa-solid fa-eye" style={{'color': '#ffffff'}}/></button>
                    </div>
                </div>

                <div className='bottomLayers mt-5'>
                    <div className="heading">
                        <h5>Bottom Layer</h5>
                    </div>
                    <div className="layer">
                        <span>Traces</span>
                        <button className="toggleButton" style={{'background-color': '#206b19'}}><FontAwesomeIcon icon="fa-solid fa-eye" style={{'color': '#ffffff'}}/></button>
                    </div>
                    <div className="layer">
                        <span>Pads</span>
                        <button className="toggleButton" style={{'background-color': '#b9a323'}}><FontAwesomeIcon icon="fa-solid fa-eye" style={{'color': '#ffffff'}}/></button>
                    </div>
                    <div className="layer">
                        <span>Silk Screen</span>
                        <button className="toggleButton" style={{'background-color': '#348f9b'}}><FontAwesomeIcon icon="fa-solid fa-eye" style={{'color': '#ffffff'}}/></button>
                    </div>
                </div>

                <div className='commonLayers mt-10'>
                    <div className="layer">
                        <span>Outline</span>
                        <button className="toggleButton" style={{'background-color': '#348f9b'}}><FontAwesomeIcon icon="fa-solid fa-eye" style={{'color': '#ffffff'}}/></button>
                    </div>
                    <div className="layer">
                        <span>Drill</span>
                        <button className="toggleButton" style={{'background-color': '#348f9b'}}><FontAwesomeIcon icon="fa-solid fa-eye" style={{'color': '#ffffff'}}/></button>
                    </div>
                    <div className="layer">
                        <span>OuterLayer</span>
                        <button className="toggleButton" style={{'background-color': 'rgb(85 119 89)'}}><FontAwesomeIcon icon="fa-solid fa-eye" style={{'color': '#ffffff'}}/></button>
                    </div>
                </div>
            </div>

        {/* Canvas Background Selector */}
            <div class="canvasDiv">
                <label for="canvasBg">Canvas Background </label>
                <select name="canvasSelect" id="canvasBg">
                    <option value="black" selected>Black</option>
                    <option value="white">White</option>
                </select>
            </div> 

        </div>
        </>
    )
}
export default ConfigSection