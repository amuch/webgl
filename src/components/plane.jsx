import { Matrix4 } from "../helpers/matrix4"

const POINTER_MVP_MATRIX = 'uMVPMatrix'
const POINTER_POSITION_VECTOR = 'vPosition'
const COORDS_PER_VERTEX = 3;

export class Plane {
    constructor(x = 0.0, y = 0.0, z = 0.0) {
        this.vertices = [
            // Triangle 1
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0,
            -1.0,  1.0,  0.0,
           // Triangle 2
            -1.0,  1.0,  0.0,
             1.0, -1.0,  0.0,
             1.0,  1.0,  0.0
        ]
        this.x = x
        this.y = y
        this.z = z
        this.modelMatrix = Matrix4.identity()
        this.mvpMatrix = Matrix4.identity()
        this.theta = 0.0

        this.shaderSourceVertex = `#version 300 es
            uniform mat4 ${POINTER_MVP_MATRIX};
            in vec3 ${POINTER_POSITION_VECTOR};
            out vec4 varyingColor;

            void main(void) {
                gl_Position = ${POINTER_MVP_MATRIX} * vec4(${POINTER_POSITION_VECTOR}, 1.0);
                varyingColor = vec4(${POINTER_POSITION_VECTOR}, 1.0) * 0.5 + vec4(0.1, 0.2, 0.9, 0.5);
            }
        `

        this.shaderSourceFragment = `#version 300 es
            precision highp float;

            in vec4 varyingColor;
            out vec4 color;

            void main(void) {
                color = varyingColor;
            }
        `
    }

    update() {
        if(this.theta > 360) {
            this.theta -= 360
        }
        if(this.theta < 0) {
            this.theta += 360
        }

        this.theta -= 15
    }


    draw(gl, viewMatrix, projectionMatrix) {
        if(!gl) {
            console.error("No webGL found.")
            return
        }

        this.modelMatrix = Matrix4.identity()
        this.modelMatrix = Matrix4.translate(this.modelMatrix, this.x, this.y, this.z)
        this.modelMatrix = Matrix4.rotateY(this.modelMatrix, this.theta)

        const modelViewMatrix = Matrix4.multiply(viewMatrix, this.modelMatrix)
        this.mvpMatrix = Matrix4.multiply(projectionMatrix, modelViewMatrix)

        const shaderVertex = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(shaderVertex, this.shaderSourceVertex)
        gl.compileShader(shaderVertex)
        if(!gl.getShaderParameter(shaderVertex, gl.COMPILE_STATUS)) {
            console.error("Vertex shader error:", gl.getShaderInfoLog(shaderVertex))
        }

        const shaderFragment = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(shaderFragment, this.shaderSourceFragment)
        gl.compileShader(shaderFragment)
        if(!gl.getShaderParameter(shaderFragment, gl.COMPILE_STATUS)) {
            console.error("Vertex shader error:", gl.getShaderInfoLog(shaderFragment))
        }

        const glProgram = gl.createProgram()
        gl.attachShader(glProgram, shaderVertex)
        gl.attachShader(glProgram, shaderFragment)
        gl.linkProgram(glProgram)

        if(!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
            console.error("Shader Program Linking Error: ", gl.getProgramInfoLog(glProgram))
        }

        gl.useProgram(glProgram)

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        const bufferVertices = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)

        const vertexHandle = gl.getAttribLocation(glProgram, POINTER_POSITION_VECTOR)
        gl.enableVertexAttribArray(vertexHandle)
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices)
        gl.vertexAttribPointer(vertexHandle, COORDS_PER_VERTEX, gl.FLOAT, false, 0, 0)

        const mvpMatrixLocation = gl.getUniformLocation(glProgram, POINTER_MVP_MATRIX)
        gl.uniformMatrix4fv(mvpMatrixLocation, false, this.mvpMatrix)

        gl.clearColor(0.0, 0.0, 0.0, 0.0)
        gl.enable(gl.DEPTH_TEST)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / COORDS_PER_VERTEX)
    }
}
