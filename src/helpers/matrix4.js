// Matrix4 is a set of static utility functions operating on Float32Array[16] in column-major order
import { Vector3 } from "./vector3";

export class Matrix4 {
    // Create a new identity matrix
    static identity() {
        const m = new Float32Array(16);
        m[0] = m[5] = m[10] = m[15] = 1.0;
        return m;
    }

    // Clone a matrix
    static clone(src) {
        return new Float32Array(src);
    }

    // Set target = source
    static set(target, source) {
        for (let i = 0; i < 16; i++) {
            target[i] = source[i];
        }
    }

    // Multiply two matrices: result = a * b
    static multiply(a, b) {
        const result = new Float32Array(16);
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                let sum = 0.0;
                for (let i = 0; i < 4; i++) {
                    sum += a[i * 4 + row] * b[col * 4 + i];
                }
                result[col * 4 + row] = sum;
            }
        }
        return result;
    }

    // Rotation X
    static rotateX(m, degrees) {
        const r = Math.PI * degrees / 180.0;
        const c = Math.cos(r), s = Math.sin(r);
        const rot = Matrix4.identity();
        rot[5] = c; rot[6] = s;
        rot[9] = -s; rot[10] = c;
        return Matrix4.multiply(m, rot);
    }

    // Rotation Y
    static rotateY(m, degrees) {
        const r = Math.PI * degrees / 180.0;
        const c = Math.cos(r), s = Math.sin(r);
        const rot = Matrix4.identity();
        rot[0] = c; rot[2] = -s;
        rot[8] = s; rot[10] = c;
        return Matrix4.multiply(m, rot);
    }

    // Rotation Z
    static rotateZ(m, degrees) {
        const r = Math.PI * degrees / 180.0;
        const c = Math.cos(r), s = Math.sin(r);
        const rot = Matrix4.identity();
        rot[0] = c; rot[1] = s;
        rot[4] = -s; rot[5] = c;
        return Matrix4.multiply(m, rot);
    }

    // Translation
    static translate(m, x, y, z) {
        const t = Matrix4.identity();
        t[12] = x; t[13] = y; t[14] = z;
        return Matrix4.multiply(m, t);
    }

    // Scaling
    static scale(m, x, y, z) {
        const s = Matrix4.identity();
        s[0] = x; s[5] = y; s[10] = z;
        return Matrix4.multiply(m, s);
    }

    static perspective(fovDegrees, aspect, near, far) {
        const fovRadians = fovDegrees * Math.PI / 180
        const focalLength = 1.0 / Math.tan(fovRadians / 2)
        const rangeInverse = 1  / (near - far)

       return [
           focalLength / aspect, 0, 0, 0,
           0, focalLength, 0, 0,
           0, 0, (near + far) * rangeInverse, -1,
           0, 0, (2 * near * far) * rangeInverse, 0
       ]
    }

    static lookAt(eye, target, up) {
        const forward = Vector3.normalize([
            target[0] - eye[0],
            target[1] - eye[1],
            target[2] - eye[2],
        ])

        const side = Vector3.normalize(Vector3.cross(forward, up))
        const upCamera = Vector3.cross(side, forward)

        const matrix = Matrix4.identity()

        matrix[0] = side[0]
        matrix[4] = side[1]
        matrix[8] = side[2]

        matrix[1] = upCamera[0]
        matrix[5] = upCamera[1]
        matrix[9] = upCamera[2]

        matrix[2]  = -1 * forward[0]
        matrix[6]  = -1 * forward[1]
        matrix[10] = -1 * forward[2]

        matrix[12] = -1 * Vector3.dot(side, eye)
        matrix[13] = -1 * Vector3.dot(upCamera, eye)
        matrix[14] = Vector3.dot(forward, eye)

        return matrix
    }

    // Debug print
    static print(m) {
        console.table([
            [m[0], m[4], m[8], m[12]],
            [m[1], m[5], m[9], m[13]],
            [m[2], m[6], m[10], m[14]],
            [m[3], m[7], m[11], m[15]]
        ]);
    }
}
