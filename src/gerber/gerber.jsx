import { useEffect, useRef } from "react";
import ConfigSection from "./configSection.jsx"
import './gerber.css'
import * as THREE from 'three'

/**
 * Component for viewing and manipulating Gerber files.
 * 
 * @returns {JSX.Element}
 */
function GerberSection() {
    // Create references for rendering and cleanup
    const resultRef = useRef(null);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Add event handler for rendering and cleanup
    useEffect(() => {
        // Create renderer and add to DOM
        const renderer = new THREE.WebGL1Renderer(window.innerWidth, window.innerHeight);
        renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        if (resultRef.current) {
            resultRef.current.appendChild(renderer.domElement);
        }

        // Create cube and add to scene
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 5;

        // Animate and render on each frame
        function animate() {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();

        // Cleanup on unmount
        return () => {
            renderer.dispose();
            // if (observer) observer.disconnect(); // Disconnect observer on unmount
        };
    },[]);

    return (
        <>
            <div className="relative h-[90%]">
                <div className="w-1/5 absolute left-0 top-8">
                    <ConfigSection />
                </div>
                <div className="h-full flex items-center justify-end ">
                    <div className="w-4/5 h-full">
                        <div id="dropArea" className="dropArea" style={{'display': 'none'}}>
                            <div className="dropbox">
                                <div className="shadow">
                                    <p>Drop your Gerber file here</p>
                                    <input type="file" id="gerberFileInput" multiple/>
                                </div>
                            </div>
                        </div>
                        <div ref={resultRef}>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GerberSection
