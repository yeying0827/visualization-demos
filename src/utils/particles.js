const push = (arr, x) => { arr[arr.length] = x }

export function createParticles (n = 1, aspectRatio = 1) {
    const [position, center, texCoord, index] = [[], [], [], []]
    const r = aspectRatio
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const [x0, x1] = [i / n, (i + 1) / n]
            const [y0, y1] = [j / n, (j + 1) / n]
            const [xC, yC] = [(x0 + x1) / 2, (y0 + y1) / 2]
            const h = 0.5

            // positions in (x, y), z = 0
            push(position, (x0 - h) * r); push(position, y0 - h)
            push(position, (x1 - h) * r); push(position, y0 - h)
            push(position, (x1 - h) * r); push(position, y1 - h)
            push(position, (x0 - h) * r); push(position, y1 - h)

            // texCoords in (x, y)
            push(texCoord, x0); push(texCoord, y0)
            push(texCoord, x1); push(texCoord, y0)
            push(texCoord, x1); push(texCoord, y1)
            push(texCoord, x0); push(texCoord, y1)

            // center in (x, y), z = 0
            push(center, (xC - h) * r); push(center, yC - h)
            push(center, (xC - h) * r); push(center, yC - h)
            push(center, (xC - h) * r); push(center, yC - h)
            push(center, (xC - h) * r); push(center, yC - h)

            // indices
            const k = (i * n + j) * 4
            push(index, k); push(index, k + 1); push(index, k + 2)
            push(index, k); push(index, k + 2); push(index, k + 3)
        }
    }

    return {
        vertex: { position, center, texCoord }, index: { array: index }
    }
}
