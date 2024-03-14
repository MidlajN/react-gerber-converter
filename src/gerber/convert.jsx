

async function convertToSvg(files, setTopStack, setBottomStack, setFullLayers) {

    const stackup = await useStackup(files)
    const topxmlDoc = new DOMParser().parseFromString(stackup.top.svg, 'image/svg+xml');
    const topsvg = topxmlDoc.documentElement;
    setTopStack(topsvg)

    const bottomxmlDoc = new DOMParser().parseFromString(stackup.bottom.svg, 'image/svg+xml');
    const bottomsvg = bottomxmlDoc.documentElement;
    setBottomStack(bottomsvg)

    const fullStackSvg = useGerberToSvg(files, stackup.layers, stackup.top)
    setFullLayers(fullStackSvg)
}

export default convertToSvg


function useStackup(filesList) {
    return Promise.all(
        Array.from(filesList).map(file => {
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
            reader.onload = ({ target: { result: fileContent } }) =>
                resolve({ filename: file.name, gerber: fileContent });
            reader.onerror = error => reject(error);
            reader.readAsText(file);
            });
        })
    )
  .then(layers => pcbStackup(layers))
  .catch(error => console.error(error));
}


function useGerberToSvg(files, layers, svgData) {
    const ids = layers.map(({side, type}) => `${side}_${type}`);

    const svg = svgData.svg;
    const svgDoc = new DOMParser().parseFromString(svg, 'image/svg+xml');
    const rootGElement = svgDoc.documentElement.querySelector('svg > g');
    const gTransform = rootGElement.getAttribute('transform');

    const fullLayerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    for (const [key, value] of Object.entries(svgData.attributes)) {
        fullLayerSvg.setAttribute(key, value);
    }

    const fullLayerDef = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const fullLayerG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    fullLayerG.setAttribute('transform', gTransform);

    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const fileContent = e.target.result;
            const uint8Array = new Uint8Array(fileContent);

            let gerberToSvgStream = gerberToSvg(uint8Array);
            let svg = ''

            gerberToSvgStream.on('data', (chunk) => { svg += chunk; });

            gerberToSvgStream.on('end', () => {
                const svgDoc = new DOMParser().parseFromString(svg, 'image/svg+xml');

                const defElement = svgDoc.querySelector('defs');
                if (defElement) {
                    fullLayerDef.appendChild(defElement);
                }

                const gElement = svgDoc.querySelector('g');
                if (gElement) {
                    gElement.setAttribute('id', `g-${ids[index]}`);
                    gElement.removeAttribute('transform');

                    const layerStyle = {
                        'top_copper': {color: 'crimson', opacity: 0.3},
                        'bottom_copper': {color: '#008208', opacity: 0.3},
                        'all_outline': {color: 'green', opacity: 0.5},
                        'top_silkscreen': {color: 'red', opacity: 0.5},
                        'bottom_silkscreen': {color: 'blue', opacity: 0.5},
                        'bottom_soldermask': {color: '#757500', opacity: 0.5, display: 'none'},
                        'bottom_solderpaste': {color: 'orange', opacity: 0.5},
                        'top_solderpaste': {color: '#c362c3', opacity: 0.5},
                        'top_soldermask': {color: '#af4e5f', opacity: 0.5, display: 'none'},
                    };

                    const layerstyle = layerStyle[ids[index]] || { color: 'green', opacity: 0.5 };
                    gElement.setAttribute('style', `color: ${layerstyle.color}; opacity: ${layerstyle.opacity};`);
                    fullLayerG.appendChild(gElement);
                }
            })
        }

        reader.readAsArrayBuffer(file);
    });

    fullLayerSvg.appendChild(fullLayerDef);
    fullLayerSvg.appendChild(fullLayerG);

    return fullLayerSvg
}
