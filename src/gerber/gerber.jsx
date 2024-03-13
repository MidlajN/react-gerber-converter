import ConfigSection from "./configSection.jsx"
import './gerber.css'

function GerberSection() {
    return (
        <>
            <div className="relative h-[90%]">
                <div className="w-1/5 absolute left-0">
                    <ConfigSection />
                </div>
                <div className="h-full flex items-center justify-end ">
                    <div className="w-4/5 h-full">
                        <div id="dropArea" className="dropArea" >
                            <div className="dropbox">
                                <div className="shadow">
                                    <p>Drop your Gerber file here</p>
                                    <input type="file" id="gerberFileInput" multiple/>
                                </div>
                            </div>
                        </div>
                        <div id="result">
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GerberSection