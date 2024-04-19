/**
 * 处理颜色矩阵的模块
 */

/**
 * 灰度化处理
 * @param p 灰度化的程度 [0,1]
 * @returns {number[]}
 */
export function grayscale(p = 1) {
    const r = 0.2126 * p;
    const g = 0.7152 * p;
    const b = 0.0722 * p;

    // r + g + b = p;
    return [
        r + 1 - p, g,         b,         0, 0, // 1 - 0.7874p [1(p=0), 0.2126(p=1)]
        r,         g + 1 - p, b,         0, 0, // 1 - 0.2848p [1,      0.7152]
        r,         g,         b + 1 - p, 0, 0, // 1 - 0.9278p [1,      0.0722]
        0,         0,         0,         1, 0
    ];
}

/**
 * 将`color`通过颜色矩阵映射成新的色值返回
 * @param color {Array} 原色值（各分量的归一化值）
 * @param matrix 颜色矩阵（多个）
 * @returns {Array}
 */
export function transformColor(color, ...matrix) {
    const [r, g, b, a] = color;
    matrix = matrix.reduce((prev, current) => multiply(prev, current));
    // 颜色向量与矩阵相乘
    color[0] = matrix[0]  * r + matrix[1] *  g + matrix[2]  * b + matrix[3]  * a + matrix[4];
    color[1] = matrix[5]  * r + matrix[6] *  g + matrix[7]  * b + matrix[8]  * a + matrix[9];
    color[2] = matrix[10] * r + matrix[11] * g + matrix[12] * b + matrix[13] * a + matrix[14];
    color[3] = matrix[15] * r + matrix[16] * g + matrix[17] * b + matrix[18] * a + matrix[19];
    return color;
}

/**
 * 将颜色矩阵相乘：b x a
 * @param a
 * @param b
 * @returns {*[]}
 */
export function multiply(a, b) {
    const out = [];
    const a00 = a[0],  a01 = a[1],  a02 = a[2],  a03 = a[3],  a04 = a[4];
    const a10 = a[5],  a11 = a[6],  a12 = a[7],  a13 = a[8],  a14 = a[9];
    const a20 = a[10], a21 = a[11], a22 = a[12], a23 = a[13], a24 = a[14];
    const a30 = a[15], a31 = a[16], a32 = a[17], a33 = a[18], a34 = a[19];

    // cache only the current line of the second matrix
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4];
    // b 行（1行5个元素） x a 列(1列4个元素)  => 第一行数据（5个元素）
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    out[4] = b0 * a04 + b1 * a14 + b2 * a24 + b3 * a34 + b4;

    b0 = b[5], b1 = b[6], b2 = b[7], b3 = b[8], b4 = b[9];
    out[5] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[6] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[7] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[8] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    out[9] = b0 * a04 + b1 * a14 + b2 * a24 + b3 * a34 + b4;

    b0 = b[10], b1 = b[11], b2 = b[12], b3 = b[13], b4 = b[14];
    out[10] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[11] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[12] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[13] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    out[14] = b0 * a04 + b1 * a14 + b2 * a24 + b3 * a34 + b4;

    b0 = b[15], b1 = b[16], b2 = b[17], b3 = b[18], b4 = b[19];
    out[15] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[16] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[17] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[18] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    out[19] = b0 * a04 + b1 * a14 + b2 * a24 + b3 * a34 + b4;

    return out;
}

/**
 * 滤镜函数：过滤或增强某个颜色通道
 * @param r
 * @param g
 * @param b
 * @returns {(number|number)[]}
 */
export function channel({r = 1, g = 1, b = 1}) {
    return [
        r, 0, 0, 0, 0,
        0, g, 0, 0, 0,
        0, 0, b, 0, 0,
        0, 0, 0, 1, 0
    ];
}

/**
 * 滤镜函数：改变亮度
 * @param p `p=0 全暗；0<p<1 调暗； p=1 原色；p>1 调亮`
 * @returns {(*|number)[]}
 */
export function brightness(p) {
    return [
        p, 0, 0, 0, 0,
        0, p, 0, 0, 0,
        0, 0, p, 0, 0,
        0, 0, 0, 1, 0
    ]
}

/**
 * 滤镜函数：改变饱和度，与grayscale相反
 * @param p p=0 完全灰度化；p=1 原色，p>1 增强饱和度
 * @returns {(*|number)[]}
 */
export function saturate(p) {
    const r = 0.2126 * (1 - p);
    const g = 0.7152 * (1 - p);
    const b = 0.0722 * (1 - p);
    return [
        r + p, g,     b,     0, 0, // 0.2126 + 0.7874p  0.2126(p=0) 1(p=1)
        r,     g + p, b,     0, 0, // 0.7152 + 0.2848p  0.7152      1
        r,     g,     b + p, 0, 0, // 0.0722 + 0.9278p  0.0722      1
        0,     0,     0,     1, 0
    ];
}

/**
 * 滤镜函数：改变对比度
 * @param p p=1 原色；p<1 减弱对比度；p>1 增强对比度
 * @returns {(*|number)[]}
 */
export function contrast(p) {
    const d = 0.5 * (1 - p);
    return [
        p, 0, 0, 0, d,
        0, p, 0, 0, d,
        0, 0, p, 0, d,
        0, 0, 0, 1, 0
    ];
}

/**
 * 滤镜函数：改变透明度
 * @param p p=0全透明；p=1 原色
 * @returns {(number|*)[]}
 */
export function opacity(p) {
    return [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, p, 0
    ];
}

/**
 * 滤镜函数：反色
 * @param p p=0 原色；p=1 完全反色
 * @returns {(number|*)[]}
 */
export function invert(p) {
    const d = 1 - 2 * p;
    return [
        d, 0, 0, 0, p, // p = 0, d = 1
        0, d, 0, 0, p, // p = 1, d = -1
        0, 0, d, 0, p,
        0, 0, 0, 1, 0
    ];
}

/**
 * 滤镜函数：色相旋转
 * @param deg 将色调沿极坐标转过deg角度
 * @returns {number[]}
 */
export function hueRotate(deg) {
    const rotation = deg / 180 * Math.PI;
    const cos = Math.cos(rotation),
        sin = Math.sin(rotation),
        lumR = 0.2126,
        lumG = 0.7152,
        lumB = 0.0722;
    return [
        lumR + cos * (1 - lumR) + sin * (-lumR),    lumG + cos * (-lumG) + sin * (-lumG) ,   lumB + cos * (-lumB) + sin * (1 - lumB), 0, 0,
        lumR + cos * (-lumR) + sin * (0.143),       lumG + cos * (1 - lumG) + sin * (0.140), lumB + cos * (-lumB) + sin * (-0.283),   0, 0,
        lumR + cos * (-lumR) + sin * (-(1 - lumR)), lumG + cos * (-lumG) + sin * (lumG),     lumB + cos * (1 - lumB) + sin * (lumB),  0, 0,
        0,                                          0,                                       0,                                       1, 0
    ];
}
