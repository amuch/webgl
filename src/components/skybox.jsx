import { Matrix4 } from "../helpers/matrix4"

const POINTER_POSITION_VECTOR = 'vPosition'
const POINTER_VECTOR_TEXTURE_COORDS = 'vTexCoord'
const POINTER_MODELVIEW_MATRIX = 'mv_matrix'
const POINTER_PROJECTION_MATRIX = 'proj_matrix'
const POINTER_VECTOR_TEX_COORD = 'tc'
const POINTER_UNIFORM_SAMPLER = 'sampler'

export class Skybox {
    constructor(gl) {
        this.vertices = [
            -1.0,  1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0,
			1.0, -1.0, -1.0, 1.0,  1.0, -1.0, -1.0,  1.0, -1.0,
			1.0, -1.0, -1.0, 1.0, -1.0,  1.0, 1.0,  1.0, -1.0,
			1.0, -1.0,  1.0, 1.0,  1.0,  1.0, 1.0,  1.0, -1.0,
			1.0, -1.0,  1.0, -1.0, -1.0,  1.0, 1.0,  1.0,  1.0,
			-1.0, -1.0,  1.0, -1.0,  1.0,  1.0, 1.0,  1.0,  1.0,
			-1.0, -1.0,  1.0, -1.0, -1.0, -1.0, -1.0,  1.0,  1.0,
			-1.0, -1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0,  1.0,
			-1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0, -1.0, -1.0,
			1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,  1.0,
			-1.0,  1.0, -1.0, 1.0,  1.0, -1.0, 1.0,  1.0,  1.0,
			1.0,  1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0
        ]

        this.textCoords = [
            .25,  .666666666, .25, .3333333333, .5, .3333333333,	// front face lower left
			.5, .333333333333, .5,  .66666666666, .25,  .66666666666,	// front face upper right
			.5, .3333333333, .75, .33333333333,  .5,  .6666666666,	// right face lower left
			.75, .33333333333,  .75,  .66666666666, .5,  .6666666666,	// right face upper right
			.75, .3333333333,  1.0, .3333333333, .75,  .66666666666,	// back face lower
			1.0, .3333333333, 1.0,  .6666666666, .75,  .6666666666,	// back face upper
			0.0, .333333333,  .25, .333333333, 0.0,  .666666666,	// left face lower
			.25, .333333333, .25,  .666666666, 0.0,  .666666666,	// left face upper
			.25, 0.0,  .5, 0.0,  .5, .333333333,			// bottom face front
			.5, .333333333, .25, .333333333, .25, 0.0,		// bottom face back
			.25,  .666666666, .5,  .666666666, .5,  1.0,		// top face back
			.5,  1.0,  .25,  1.0, .25,  .666666666			// top face front
        ]

        this.shaderSourceVertex = `#version 300 es
            layout (location = 0) in vec3 ${POINTER_POSITION_VECTOR};
            layout (location = 1) in vec2 ${POINTER_VECTOR_TEXTURE_COORDS};
            out vec2 ${POINTER_VECTOR_TEX_COORD};

            uniform mat4 ${POINTER_MODELVIEW_MATRIX};
            uniform mat4 ${POINTER_PROJECTION_MATRIX};
            layout (binding = 0) uniform sampler2D ${POINTER_UNIFORM_SAMPLER};

            void main(void) {
                ${POINTER_VECTOR_TEX_COORD} = ${POINTER_VECTOR_TEXTURE_COORDS};
                gl_Position = ${POINTER_PROJECTION_MATRIX} * ${POINTER_MODELVIEW_MATRIX} * vec4(${POINTER_POSITION_VECTOR}, 1.0);
            }
        `

        this.shaderSourceFragment = `#version 300 es
            precision highp float;

            in vec2 ${POINTER_VECTOR_TEX_COORD};
            out vec4 color;

            layout (binding = 0) uniform sampler2D ${POINTER_UNIFORM_SAMPLER};

            void main(void) {
                color = texture(${POINTER_UNIFORM_SAMPLER}, ${POINTER_VECTOR_TEX_COORD});
            }
        `
    }
}
