import { multiply } from 'ogl/src/math/functions/Mat4Func.js';

/**
 * 生成立方体6个面的24个顶点，12个三角形的索引，定义每个面的颜色信息
 * @param size
 * @param colors
 * @returns {{cells: *[], color: *[], positions: *[]}}
 */
export function cube(size = 1.0, colors = [[1, 0, 0, 1]]) {
    const h = 0.5 * size;
    const vertices = [
        [-h, -h, -h],
        [-h, h, -h],
        [h, h, -h],
        [h, -h, -h],
        [-h, -h, h],
        [-h, h, h],
        [h, h, h],
        [h, -h, h]
    ];

    const positions = [];
    const color = [];
    const cells = [];

    let colorIdx = 0;
    let cellsIdx = 0;
    const colorLen = colors.length;

    function quad(a, b, c, d) {
        [a, b, c, d].forEach(item => {
            positions.push(vertices[item]);
            color.push(colors[colorIdx % colorLen]);
        });
        cells.push(
            [0, 1, 2].map(i => i + cellsIdx),
            [0, 2, 3].map(i => i + cellsIdx)
        );
        colorIdx ++;
        cellsIdx += 4;
    }

    quad(1, 0, 3, 2); // 内
    quad(4, 5, 6, 7); // 外
    quad(2, 3, 7, 6); // 右
    quad(5, 4, 0, 1); // 左
    quad(3, 0, 4, 7); // 下
    quad(6, 5, 1, 2); // 上

    return {positions, color, cells};
}

export function fromRotation(rotationX, rotationY, rotationZ) {
    let c = Math.cos(rotationX);
    let s = Math.sin(rotationX);
    const rx = [
        1,  0, 0, 0, // 绕X轴旋转
        0,  c, s, 0,
        0, -s, c, 0,
        0,  0, 0, 1
    ];

    c = Math.cos(rotationY);
    s = Math.sin(rotationY);
    const ry = [
        c,  0, s, 0,
        0,  1, 0, 0, // 绕Y轴旋转
        -s, 0, c, 0,
        0,  0, 0, 1
    ];

    c = Math.cos(rotationZ);
    s = Math.sin(rotationZ);
    const rz = [
        c,  s, 0, 0,
        -s, c, 0, 0,
        0,  0, 1, 0, // 绕Z轴旋转
        0,  0, 0, 1
    ];

    const ret = [];
    multiply(ret, rx, ry);
    multiply(ret, ret, rz);
    return ret;
}
