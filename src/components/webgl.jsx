import React, {useRef, useEffect, useState} from 'react';
import './webgl.css';
import { Matrix4 } from '../helpers/matrix4';
import { Flat } from './flat';
import { Camera } from '../helpers/camera';


export const WebGl = ({width, height}) => {
    const canvasRef = useRef(null)
    const [gl, setGl] = useState(null)
    const [isMouseInFrame, setIsMouseInFrame] = useState(false)
    const flatRef = useRef(null)
    const cameraRef = useRef(new Camera())


    useEffect(() => {
        const canvas = canvasRef.current
        setGl(canvas.getContext('webgl2'))

        if(!gl) {
            console.error("WebGL2 is not supported in this browser.")
            return
        }

        flatRef.current = new Flat(gl, 0.01)

    }, [gl])

    useEffect(() => {
        drawScene(gl)
    }, [gl])


    const drawScene = (gl) => {
        if(gl && cameraRef.current && flatRef.current) {
            const camera = cameraRef.current
            const flat = flatRef.current
            camera.aspect = gl.canvas.width / gl.canvas.height
            camera.updateViewMatrix()
            flat.draw(gl, camera.viewMatrix, camera.projectionMatrix)
        }
    }

    const handleMouseClick = () => {
        const flat = flatRef.current
        if(gl && flat) {
            flat.update(10)
            drawScene(gl, flat)
        }
    }

    const handleMouseMove = () => {
        if(isMouseInFrame) {

        }
    }

    const handleMouseEnter = () => {
        setIsMouseInFrame(true)
    }

    const handleMouseLeave = () => {
        setIsMouseInFrame(false)
    }

    const handleWheel = (e) => {
        e.preventDefault()
        if(!cameraRef.current) {
            return
        }
        const camera = cameraRef.current
        const inc = 0.1
        if(e.deltaY < 0) {
            camera.moveForward(inc)
        }
        if(e.deltaY > 0) {
            camera.moveBackwards(inc)
        }

        drawScene(gl, flatRef.current)
    }

    return (
        <canvas
            ref={canvasRef}
            className='gl-canvas'
            {...{width, height}}
            onClick={handleMouseClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
        />
    )
}
