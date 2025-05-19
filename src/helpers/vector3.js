export class Vector3 {
    static dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    }

    static cross(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ]
    }

    static normalize(v) {
        const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
        return len > 0 ? [v[0] / len, v[1] / len, v[2] / len] : [0, 0, 0]
    }
}
