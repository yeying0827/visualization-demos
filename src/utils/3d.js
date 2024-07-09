import { multiply } from 'ogl/src/math/functions/Mat4Func.js';
import { cross, subtract, normalize } from 'ogl/src/math/functions/Vec3Func.js';

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

/**
 * 生成长方体6个面的24个顶点，12个三角形的索引，定义每个面的颜色信息
 * @param width
 * @param height
 * @param depth
 * @param colors
 * @returns {{cells: *[], color: *[], positions: *[]}}
 */
export function cuboid(width = 1.0, height = 1.0, depth = 1.0, colors = [[1, 0, 0, 1]]) {
    const w = 0.5 * width,
        h = 0.5 * height,
        d = 0.5 * depth;
    const vertices = [
        [-w, -h, -d],
        [-w, h, -d],
        [w, h, -d],
        [w, -h, -d],
        [-w, -h, d],
        [-w, h, d],
        [w, h, d],
        [w, -h, d]
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

/**
 * 生成正四面体4个面的12个顶点，4个三角形的索引，定义每个面的颜色信息
 * (正四面体，就是取正立方体的四个非共棱顶点组成)
 * @param size
 * @param colors
 * @returns {{cells: *[], color: *[], positions: *[], normal: *[]}}
 */
export function regularTetrahedron(size = 1.0, colors = [[1, 0, 0, 1]]) {
    const h = 0.5 * size;
    const vertices = [
        // 0
        [-h, -h, h],
        [-h, h, -h],
        [h, -h, -h],
        // 1
        // [-h, -h, h],
        // [-h, h, -h],
        [h, h, h],
        // 2
        // [-h, -h, h],
        // [h, h, h],
        // [h, -h, -h],
        // 3
        // [h, h, h],
        // [-h, h, -h],
        // [h, -h, -h]
    ];
    // const vertices = [
    //     [-h, -h, -h], // 0
    //     [-h, h, -h], // 1
    //     [h, h, -h], // 2
    //     [h, -h, -h], // 3
    //     [-h, -h, h], // 4
    //     [-h, h, h], // 5
    //     [h, h, h], // 6
    //     [h, -h, h], // 7
    // ];

    const positions = [];
    const color = [];
    const cells = [];
    const normal = []; // 法向量

    let colorIdx = 0;
    let cellsIdx = 0;
    const colorLen = colors.length;

    const tmp1 = [];
    const tmp2 = [];
    function triangle(a, b, c) {
        [a, b, c].forEach(item => {
            positions.push(vertices[item]);
            color.push(colors[colorIdx % colorLen]);
        });
        cells.push(
            [0, 1, 2].map(i => i + cellsIdx)
        );
        colorIdx ++;
        cellsIdx += 3;

        // 存储法向量
        const norm = [];
        cross(norm, subtract(tmp1, vertices[b], vertices[a]), subtract(tmp2, vertices[c], vertices[a])); // 叉乘：向量ab x 向量ac
        normalize(norm, norm);
        normal.push(norm, norm, norm); // abc三个点共面，他们的法向量相同
    }

    triangle(0, 1, 2);
    triangle(0, 1, 3);
    triangle(0, 3, 2);
    triangle(3, 2, 1);
    // triangle(1, 4, 6);
    // triangle(1, 6, 3);
    // triangle(1, 3, 4);
    // triangle(6, 4, 3);

    return {positions, color, cells, normal};
}

/**
 * 生成圆柱体的顶点，三角形索引，定义顶和底和侧面的颜色信息
 * @param radius 顶和底的圆半径
 * @param height 圆柱体高度
 * @param segments 圆弧分多少段
 * @param colorCap 顶和底的颜色
 * @param colorSide 侧面的颜色
 * @returns {{cells: *[], color: *[], positions: *[], normal: *[]}}
 */
export function cylinder(radius = 1.0, height = 1.0, segments = 30, colorCap = [0, 0, 1, 1], colorSide = [1, 0, 0, 1]) {
    const positions = [];
    const cells = [];
    const color = [];
    const cap = [[0, 0]];
    const h = 0.5 * height;
    const normal = []; // 法向量

    // 顶和底的圆
    for (let i = 0; i <= segments; i ++) {
        const theta = Math.PI * 2 * i / segments;
        const p = [radius * Math.cos(theta), radius * Math.sin(theta)];
        cap.push(p);
    }
    positions.push(...cap.map(([x, y]) => [x, y, -h])); // 内面的点
    normal.push(...cap.map(() => [0, 0, -1])); // 存储法向量
    for (let i = 1; i < cap.length - 1; i ++) { // 内面三角剖分
        cells.push([0, i, i + 1]);
    }
    cells.push([0, cap.length - 1, 1]);

    let offset = positions.length;
    positions.push(...cap.map(([x, y]) => [x, y, h])); // 外面的点
    normal.push(...cap.map(() => [0, 0, 1])); // 存储法向量
    for (let i = 1; i < cap.length - 1; i ++) { // 外面三角剖分
        cells.push([offset, offset + i, offset + i + 1]);
    }
    cells.push([offset, offset + cap.length - 1, offset + 1]);

    color.push(...positions.map(() => colorCap)); // 每个顶点色值

    const tmp1 = [];
    const tmp2 = [];
    // 侧面
    offset = positions.length;
    for (let i = 1; i < cap.length; i ++) {
        const a = [...cap[i], h];
        const b = [...cap[i], -h];
        const nextIdx = i < cap.length - 1 ? i + 1 : 1;
        const c = [...cap[nextIdx], -h];
        const d = [...cap[nextIdx], h];

        positions.push(a, b, c, d);

        // 存储法向量
        const norm = [];
        cross(norm, subtract(tmp1, b, a), subtract(tmp2, c, a)); // 叉乘：向量ab x 向量ac
        normalize(norm, norm);
        normal.push(norm, norm, norm, norm); // abcd四个点共面，它们的法向量相同

        color.push(colorSide, colorSide, colorSide, colorSide);
        cells.push([offset, offset + 1, offset + 2], [offset, offset + 2, offset + 3]);
        offset += 4;
    }

    return {positions, cells, color, normal};
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
    // const ret = [rx, ry, rz].reduce((a, b) => {
    //     return a.multiply(b); // a x b 结果输出到a
    // });
    return ret;
}
