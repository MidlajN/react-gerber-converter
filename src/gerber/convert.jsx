


export default async function convertToSvg(files, setTopStack, setBottomStack, setFullLayers, setMainSvg, setStackConfig) {

    const stackup = await useStackup(files)
    const topxmlDoc = new DOMParser().parseFromString(stackup.top.svg, 'image/svg+xml');
    const topsvg = topxmlDoc.documentElement;
    const bottomxmlDoc = new DOMParser().parseFromString(stackup.bottom.svg, 'image/svg+xml');
    const bottomsvg = bottomxmlDoc.documentElement;

    const newTopSvg = modifiedSvg({ svg: topsvg, id: 'toplayer', viewbox: stackup.top.viewBox, width: stackup.top.width, height: stackup.top.height})
    const newBottomSvg = modifiedSvg({ svg: bottomsvg, id: 'bottomlayer', viewbox: stackup.bottom.viewBox, width: stackup.bottom.width, height: stackup.bottom.height})

    const fullStackSvg = useGerberToSvg(files, stackup.layers, stackup.top)
    const newFullStackSvg = modifiedSvg({ svg: fullStackSvg, id: 'fullstack', viewbox: stackup.top.viewBox, width: stackup.top.width, height: stackup.top.height})
    

    setStackConfig({ 
        viewbox: { 
            viewboxX: stackup.top.viewBox[0], 
            viewboxY: stackup.top.viewBox[1], 
            viewboxW: stackup.top.viewBox[2], 
            viewboxH: stackup.top.viewBox[3] 
        }, 
        width: stackup.top.width, 
        height: stackup.top.height})

    setFullLayers(newFullStackSvg)
    setTopStack({id: stackup.id, svg: newTopSvg})
    setBottomStack({id: stackup.id, svg: newBottomSvg})
    setMainSvg({id: 'top_layer', svg: newTopSvg});
}


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
                    gElement.setAttribute('style', `color: ${layerstyle.color}; opacity: ${layerstyle.opacity}; display: ${ layerstyle.display ? layerstyle.display : 'block' }`);
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


function modifiedSvg(props) {
    const { svg, id, viewbox, width, height } = props;
    // console.log('SVG', svg, id, viewbox, width, height)
    const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const outerG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const mainG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    if (id !== 'fullstack') {
        const Gs = svg.querySelectorAll('g');
        Gs.forEach((g) => {
            if (g.hasAttribute('id')) {
                if (g.getAttribute('id').includes('soldermask')) {
                    g.style.display = g.style.display === 'none' ? 'block' : 'none';    
                }
            }
        })
    }

    const clipPath = svg.querySelector('clipPath');
    if (clipPath) {
        const d = clipPath.querySelector('path').getAttribute('d');

        const outlineG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        outlineG.setAttribute('id', 'drillMask');
        outlineG.setAttribute('transform', `translate(${ viewbox[0] + 440 } ${ viewbox[1] + viewbox[3] -500 }) scale(0.99, -0.99) translate(${ -viewbox[0] } ${ -viewbox[1]})`);
        outlineG.appendChild(path);

        svg.insertBefore(outlineG, svg.firstChild);
    }


    const outer = generateOuterSvg(width, height, 0.8, { viewboxX: viewbox[0], viewboxY: viewbox[1]});

    outer.svg.setAttribute('style', 'fill: #86877c; opacity: 0.5');
    outer.svg.setAttribute('id', `${id}outer-svg`);
    outerG.setAttribute('id', `${id}outer`);
    outerG.setAttribute('style', 'display: none;')

    newSvg.setAttribute('id', `${id}`);
    newSvg.setAttribute('width', `${outer.width}mm`);
    newSvg.setAttribute('height', `${outer.height}mm`);

    svg.setAttribute('id', `${id}svg`);
    // mainG.appendChild(svg);
    mainG.setAttribute('id', `${id}MainG`);
    mainG.setAttribute('transform', 'translate(3, 3)');

    outerG.appendChild(outer.svg);
    mainG.appendChild(svg);
    newSvg.appendChild(outerG);
    newSvg.appendChild(mainG);
    
    return newSvg
}

export function generateOuterSvg(width, height, toolwidth , viewbox) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const originX = viewbox.viewboxX;
    const originY = viewbox.viewboxY;
    // svg_outer_width = width + 2 * toolwidth;
    // svg_outer_height = height + 2 * toolwidth;
  
    // Generate Outer SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `${originX - toolwidth} ${originY - toolwidth} ${width + 2 * toolwidth} ${height + 2 * toolwidth}`);
    svg.setAttribute('width', `${width + 2 * toolwidth}mm`);
    svg.setAttribute('height', `${height + 2 * toolwidth}mm`);
  
    const pathlines =   `
    M ${ originX } ${ originY }
    L ${ originX + halfWidth +  2 * toolwidth } ${ originY }
    L ${ originX + halfWidth +  2 * toolwidth } ${ originY - toolwidth }
    L ${ originX + width + toolwidth } ${ originY - toolwidth }
    L ${ originX + width + toolwidth } ${ originY + halfHeight + 2 * toolwidth }
    L ${ originX + width } ${ originY + halfHeight + 2 * toolwidth }
    L ${ originX + width } ${ originY + height }
    L ${ originX + halfWidth - 2 * toolwidth } ${ originY + height }
    L ${ originX + halfWidth - 2 * toolwidth } ${ originY + height + toolwidth }
    L ${ originX - toolwidth } ${ originY + height + toolwidth }
    L ${ originX - toolwidth } ${ originY + halfHeight - 2 * toolwidth }
    L ${ originX } ${ originY + halfHeight - 2 * toolwidth }
    L ${ originX } ${ originY }
    Z`
  
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathlines);
  
    svg.appendChild(path)
  
  
    let response = {
      svg : svg,
      width : width + 2 * toolwidth,
      height : height + 2 * toolwidth,
    }
    return response
}