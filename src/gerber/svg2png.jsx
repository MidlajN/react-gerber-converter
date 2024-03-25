import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



export default async function svg2png(svg, swidth, sheight, canvasBg) {
    
    return new Promise((resolve, reject) => {
        const svgBlob = new Blob([svg], { type: "image/svg+xml" });
        let blobURL = (window.URL || window.webkitURL || window).createObjectURL(svgBlob);
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement("canvas");

            const scaleFactor = 1000 / 25.4;

            const width = swidth ;
            const height = sheight;
            const scaledWidth = width * scaleFactor;
            const scaledHeight = height * scaleFactor;

            const toolWidth = 0.8;
            const toolWidthErr = 0.02;
            const scaledToolWidth = (toolWidth + toolWidthErr) * scaleFactor;

            canvas.width = scaledWidth + scaledToolWidth * 2;
            canvas.height = scaledHeight + scaledToolWidth * 2; 
            
            const ctx = canvas.getContext("2d");
            
            ctx.fillStyle = canvasBg;
            ctx.fillRect(0, 0, scaledWidth + scaledToolWidth * 2, scaledHeight + scaledToolWidth * 2);
            ctx.drawImage(img, scaledToolWidth, scaledToolWidth, scaledWidth , scaledHeight );

            (window.URL || window.webkitURL || window).revokeObjectURL(blobURL);

            resolve(canvas);
        };

        // Handle errors during image loading
        img.onerror = function (err) {
            console.log('Error loading image:', err);
            reject(err);

            (window.URL || window.webkitURL || window).revokeObjectURL(blobURL);
        };
        img.src = blobURL;
    });  
}

export function PngComponent(props) {
    const { blobUrl, name, handleDelete } = props;


    return (
        <>
            <div className="png my-2">
                <img src={ blobUrl } className="w-full" alt="" />
                <div className="footer">
                    <p className="text-[12px]">{ name }</p>
                    <div className="buttons flex gap-2">
                        <a href={ blobUrl } download={ name }>
                            <FontAwesomeIcon icon="fa-solid fa-download" />
                        </a>
                        <button onClick={handleDelete}>
                            <FontAwesomeIcon icon="fa-solid fa-trash" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}