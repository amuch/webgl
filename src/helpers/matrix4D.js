export class Matrix4D {
    /* Column Major matrix
        0,  4,  8, 12,
        1,  5,  9, 13,
        2,  6, 10, 14,
        3,  7, 11, 15,
    */
    constructor() {
        this.entries = new Float32Array(16).fill(0.0)
    }

    // Debug
    printEntries() {
        console.table(this.entries)
    }

    // Basic
    getEntry(col, row) {
        return this.entries[col * 4 + row]
    }

    setEntry(col, row, value) {
        this.entries[col * 4 + row] = value
    }

    getEntryByIndex(index) {
        return this.entries[index]
    }

    setEntryByIndex(index, value) {
        this.entries[index] = value
    }

    // Complex
    setIdentity() {
        for(let i = 0; i < this.entries.length; i++) {
            switch(i) {
                case 0:
                case 5:
                case 10:
                case 15:
                    this.entries[i] = 1.0
                continue

                default:
                    this.entries[i] = 0.0
            }
        }
    }

    static setMatrix(target, source) {
        for(let i = 0; i < source.entries.length; i++) {
            target.setEntryByIndex(i, source.getEntryByIndex(i))
        }
    }

    static multiply(left, right) {
        const matrix = new Matrix4D()
        for(let row = 0; row < 4; row++) {
            for(let col = 0; col < 4; col++) {
                let entry = 0.0
                for(let i = 0; i < 4; i++) {
                    entry += left.getEntry(row, i) * right.getEntry(i, col)
                }
                matrix.setEntry(row, col, entry)
            }
        }
       return matrix
    }

    static rotateX(matrix, degrees) {
        const multiplier = new Matrix4D()
        const radians = Math.PI * degrees / 180.0
        const cos = Math.cos(radians)
        const sin = Math.sin(radians)

        multiplier.setEntry(0, 0, 1.0)
        multiplier.setEntry(1, 1, cos)
        multiplier.setEntry(1, 2, sin)
        multiplier.setEntry(2, 1, -1 * sin)
        multiplier.setEntry(2, 2, cos)
        multiplier.setEntry(3, 3, 1.0)

        return Matrix4D.multiply(matrix, multiplier)
    }

    static rotateY(matrix, degrees) {
        const multiplier = new Matrix4D()
        const radians = Math.PI * degrees / 180.0
        const cos = Math.cos(radians)
        const sin = Math.sin(radians)

        multiplier.setEntry(0, 0, cos)
        multiplier.setEntry(0, 2, -1 * sin)
        multiplier.setEntry(1, 1, 1.0)
        multiplier.setEntry(2, 0, sin)
        multiplier.setEntry(2, 2, cos)
        multiplier.setEntry(3, 3, 1.0)

        return Matrix4D.multiply(matrix, multiplier)
    }

    static rotateZ(matrix, degrees) {
        const multiplier = new Matrix4D()
        const radians = Math.PI * degrees / 180.0
        const cos = Math.cos(radians)
        const sin = Math.sin(radians)

        multiplier.setEntry(0, 0, cos)
        multiplier.setEntry(0, 1, sin)
        multiplier.setEntry(1, 0, -1 * sin)
        multiplier.setEntry(1, 1, cos)
        multiplier.setEntry(2, 2, 1.0)
        multiplier.setEntry(3, 3, 1.0)

        return Matrix4D.multiply(matrix, multiplier)
    }

    static translateX(matrix, x) {
        const multiplier = new Matrix4D()
        multiplier.setIdentity()
        multiplier.setEntry(3, 0, x)
        return Matrix4D.multiply(matrix, multiplier)
    }

    static translateY(matrix, y) {
        const multiplier = new Matrix4D()
        multiplier.setIdentity()
        multiplier.setEntry(3, 1, y)
        return Matrix4D.multiply(matrix, multiplier)
    }

    static translateZ(matrix, z) {
        const multiplier = new Matrix4D()
        multiplier.setIdentity()
        multiplier.setEntry(3, 2, z)
        return Matrix4D.multiply(matrix, multiplier)
    }

    // static translate(matrix, x, y, z) {
    //     Matrix4D.translateX(matrix, x)
    //     Matrix4D.translateY(matrix, y)
    //     Matrix4D.translateZ(matrix, z)
    // }

    static scaleX(matrix, factor) {
        const multiplier = new Matrix4D()
        multiplier.setIdentity()
        multiplier.setEntry(0, 0, factor)
        return Matrix4D.multiply(matrix, multiplier)
    }

    static scaleY(matrix, factor) {
        const multiplier = new Matrix4D()
        multiplier.setIdentity()
        multiplier.setEntry(1, 1, factor)
        return Matrix4D.multiply(matrix, multiplier)
    }

    static scaleZ(matrix, factor) {
        const multiplier = new Matrix4D()
        multiplier.setIdentity()
        multiplier.setEntry(2, 2, factor)
        return Matrix4D.multiply(matrix, multiplier)
    }

    // static scale(matrix, x, y, z) {
    //     Matrix4D.scaleX(matrix, x)
    //     Matrix4D.scaleY(matrix, y)
    //     Matrix4D.scaleZ(matrix, z)
    // }
}
