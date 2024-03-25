import React, {createContext, useContext, useState} from "react";

const GerberContext = createContext();

export const GerberProvider = ({children}) => {
    const [mainSvg, setMainSvg] = useState({id: null, svg: null});
    const [topstack, setTopStack] = useState({id: null, svg: null});
    const [bottomstack, setBottomStack] = useState({id: null, svg: null});
    const [fullLayers, setFullLayers] = useState(null);
    const [layerType, setLayerType] = useState(null);
    const [canvasBg, setCanvasBg] = useState('black');
    const [pngUrls, setPngUrls] = useState([]);
    const [stackConfig, setStackConfig] = useState({ vewbox: { viewboxX: 0, viewboxY: 0, viewboxW: 0, viewboxH: 0}, width: 0, height: 0 });
    const [isToggled, setIsToggled] = useState({
        toplayer: { trace: false, pads: false, silkscreen: false },
        bottomlayer: { trace: false, pads: false, silkscreen: false },
        commonlayer: { outline: false, drill: false, outlayer: true}
    });
    
    const handleToggleCick = (layertype, layerproperty) => {
        setIsToggled((prevState) => ({
            ...prevState,
            [layertype]: {
                ...prevState[layertype],
                [layerproperty]: !prevState[layertype][layerproperty],
            }
        }));
    }

    return (
        <GerberContext.Provider
            value={{
                mainSvg,
                setMainSvg,
                topstack,
                setTopStack,
                bottomstack,
                setBottomStack,
                fullLayers,
                setFullLayers,
                isToggled,
                setIsToggled,
                layerType,
                setLayerType,
                handleToggleCick,
                stackConfig,
                setStackConfig,
                canvasBg,
                setCanvasBg,
                pngUrls,
                setPngUrls
            }}
        >
            {children}
        </GerberContext.Provider>
    )
};

export const useGerberConfig = () => useContext(GerberContext)