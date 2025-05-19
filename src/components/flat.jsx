import { Matrix4 } from "../helpers/matrix4"

const POINTER_MVP_MATRIX = 'uMVPMatrix'
const POINTER_POSITION_VECTOR = 'vPosition'
const POINTER_ATTRIB_TEXTURE_COORDS = 'aTexCoord'
const POINTER_VECTOR_TEXTURE_COORDS = 'vTexCoord'
const POINTER_UNIFORM_FRONT_TEXTURE = 'uFrontTexture'
const POINTER_UNIFORM_BACK_TEXTURE = 'uBackTexture'
const COORDS_PER_VERTEX = 3;

export class Flat {
    constructor(gl, x = 0.0, y = 0.0, z = 0.0) {
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

        this.textCoords = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,

            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
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
            in vec2 ${POINTER_ATTRIB_TEXTURE_COORDS};

            out vec2 ${POINTER_VECTOR_TEXTURE_COORDS};

            void main(void) {
                gl_Position = ${POINTER_MVP_MATRIX} * vec4(${POINTER_POSITION_VECTOR}, 1.0);
                ${POINTER_VECTOR_TEXTURE_COORDS} = ${POINTER_ATTRIB_TEXTURE_COORDS};
            }
        `

        this.shaderSourceFragment = `#version 300 es
            precision highp float;

            in vec2 ${POINTER_VECTOR_TEXTURE_COORDS};
            uniform sampler2D ${POINTER_UNIFORM_FRONT_TEXTURE};
            uniform sampler2D ${POINTER_UNIFORM_BACK_TEXTURE};
            out vec4 color;

            void main(void) {
                // gl_FrontFacing is true for front faces
                if (gl_FrontFacing) {
                    color = texture(${POINTER_UNIFORM_FRONT_TEXTURE}, ${POINTER_VECTOR_TEXTURE_COORDS});
                }
                else {
                    // Flip the X coordinate for the back face
                    vec2 flippedCoord = vec2(1.0 - ${POINTER_VECTOR_TEXTURE_COORDS}.x, ${POINTER_VECTOR_TEXTURE_COORDS}.y);
                    color = texture(${POINTER_UNIFORM_BACK_TEXTURE}, flippedCoord);
                }
            }
        `

        this.frontTexture = this.loadTexture(gl, '/front.jpg');
        this.backTexture = this.loadTexture(gl, '/back.jpg');

    }

    loadTexture(gl, imageUrl) {
        const texture = gl.createTexture();
        const image = new Image();
        image.src = imageUrl;

        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        };

        return texture;
    }

    update(inc) {
        if(this.theta > 360) {
            this.theta -= 360
        }
        if(this.theta < 0) {
            this.theta += 360
        }

        this.theta += inc
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

        const texCoordBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textCoords), gl.STATIC_DRAW)

        const texCoordLocation = gl.getAttribLocation(glProgram, POINTER_ATTRIB_TEXTURE_COORDS)
        gl.enableVertexAttribArray(texCoordLocation)
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)

        // Front texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.frontTexture);
        const frontLoc = gl.getUniformLocation(glProgram, POINTER_UNIFORM_FRONT_TEXTURE);
        gl.uniform1i(frontLoc, 0);

        // Back texture
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.backTexture);
        const backLoc = gl.getUniformLocation(glProgram, POINTER_UNIFORM_BACK_TEXTURE);
        gl.uniform1i(backLoc, 1);

        gl.clearColor(0.0, 0.0, 0.0, 0.0)
        gl.enable(gl.DEPTH_TEST)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        // gl.enable(gl.CULL_FACE)
        // gl.cullFace(gl.BACK)

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / COORDS_PER_VERTEX)
    }
}
