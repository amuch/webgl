import { Matrix4 } from '../helpers/matrix4';
import { Vector3 } from './vector3';

const FIELD_OF_VIEW_DEFAULT = 45.0
const Z_CAMERA_DEFAULT = 5.0
const NEAR_PLANE_DEFAULT = 0.1
const FAR_PLANE_DEFAULT = 100.0

export class Camera {
    constructor(
        aspect = 1,
        fovDegrees = FIELD_OF_VIEW_DEFAULT,
        near = NEAR_PLANE_DEFAULT,
        far = FAR_PLANE_DEFAULT
    ) {
        this.aspect = aspect
        this.fovDegrees = fovDegrees
        this.near = near
        this.far = far

        this.position = new Float32Array([0.0, 0.0, Z_CAMERA_DEFAULT])
        this.target = new Float32Array([0.0, 0.0, 0.0])
        this.up = new Float32Array([0.0, 1.0, 0.0])
        this.yaw = -90.0
        this.pitch = 0.0

        this.setTargetFromYaw()
        this.viewMatrix = Matrix4.lookAt(this.position, this.target, this.up)
        this.projectionMatrix = Matrix4.perspective(fovDegrees, aspect, near, far)
    }

    updateProjectionMatrix(width, height) {
        const ratio = width / height
        this.projectionMatrix = Matrix4.perspective(this.fovDegrees, ratio, this.near, this.far)
    }

    updateViewMatrix() {
        this.viewMatrix = Matrix4.lookAt(this.position, this.target, this.up)
    }

    getForwardDirection() {
        const radians = this.yaw * Math.PI / 180
        return [Math.cos(radians), 0, Math.sin(radians)]
    }

    setTargetFromYaw() {
        const radians = this.yaw * Math.PI / 180
        this.target[0] = this.position[0] + Math.cos(radians)
        this.target[1] = this.position[1]
        this.target[2] = this.position[2] + Math.sin(radians)
    }

    moveUp(y) {
        this.position[1] += y
        this.setTargetFromYaw()
    }

    moveDown(y) {
        this.position[1] -= y
        this.setTargetFromYaw()
    }

    moveForward(xz) {
        const direction = this.getForwardDirection()
        this.position[0] += direction[0] * xz
        this.position[2] += direction[2] * xz

        this.target[0] = this.position[0] + direction[0]
        this.target[1] = this.position[1]
        this.target[2] = this.position[2] + direction[2]
    }

    moveBackwards(xz) {
        const direction = this.getForwardDirection()
        this.position[0] -= direction[0] * xz
        this.position[2] -= direction[2] * xz

        this.target[0] = this.position[0] + direction[0]
        this.target[1] = this.position[1]
        this.target[2] = this.position[2] + direction[2]
    }

    rotateYaw(degrees) {
        this.yaw += degrees
        if(this.yaw > 360) {
            this.yaw -= 360
        }
        if(this.yaw < 0) {
            this.yaw += 360
        }
        this.setTargetFromYaw()
    }

    // setTargetFromYawPitch() {
    //     const yawRad = this.yaw * Math.PI / 180
    //     const pitchRad = this.pitch * Math.PI / 180

    //     const x = Math.cos(pitchRad) * Math.cos(yawRad)
    //     const y = Math.sin(pitchRad)
    //     const z = Math.cos(pitchRad) * Math.sin(yawRad)

    //     this.target[0] = this.position[0] + x
    //     this.target[1] = this.position[1] + y
    //     this.target[2] = this.position[2] + z
    // }

    // rotateYaw(degrees) {
    //     this.yaw = (this.yaw + degrees) % 360;
    //     this.setTargetFromYawPitch();
    // }

    // rotatePitch(degrees) {
    //     this.pitch += degrees;
    //     this.pitch = Math.max(-89.0, Math.min(89.0, this.pitch)); // avoid gimbal lock
    //     this.setTargetFromYawPitch();
    // }

}
