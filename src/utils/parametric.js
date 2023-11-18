/*
* 高阶参数方程绘图模块
* */
export default function parametric(xFunc, yFunc) {
    return function(start, end, seg = 100, ...args) {
        const points = [];
        for (let i = 0; i <= seg; i ++) {
            const p = i / seg;
            // const t = start * (1 - p) + end * p;
            const t = start + (end - start) * i / seg;
            // console.log(t);
            const x = xFunc(t, ...args);
            const y = yFunc(t, ...args);
            points.push([x, y]);
        }
        return {
            draw: draw.bind(null, points),
            points
        }
    }
}

/*
* Canvas2D绘制曲线
* @param point 采样点
* @param context 绘图上下文
* @param {strokeStyle, fillStyle, close} - 描边颜色, 填充颜色, 是否闭合路径
* */
function draw(points, context, {
    strokeStyle = 'black',
    fillStyle = null,
    close = false
} = {}) {
    context.strokeStyle = strokeStyle;
    context.beginPath();
    context.moveTo(...points[0]);
    for (let i = 1; i < points.length; i ++) {
        context.lineTo(...points[i]);
    }
    if (close) context.closePath();
    if (fillStyle) {
        context.fillStyle = fillStyle;
        context.fill();
    }
    context.stroke();
}

// 获得椭圆曲线顶点集合
// x = x0 + a * cos(θ)
// y = y0 + b * sin(θ)
export function ellipse(x0, y0, radiusX, radiusY, startAng = 0, endAng = Math.PI * 2) {
    const TAU_SEGMENTS = 60;
    const TAU = Math.PI * 2;

    const ang = Math.min(TAU, endAng - startAng);
    const ret = ang === TAU ? [] : [[x0, y0]];
    const segments = Math.round(TAU_SEGMENTS * ang / TAU);
    for (let i = 0; i <= segments; i ++) {
        const x = x0 + radiusX * Math.cos(startAng + ang * i / segments);
        const y = y0 + radiusY * Math.sin(startAng + ang * i / segments);
        ret.push([x, y]);
    }
    return ret;
}

// 获得圆形曲线顶点集合
// x = x0 + r * cos(θ)
// y = y0 + r * sin(θ)
export function arc(x0, y0, radius, startAng = 0, endAng = Math.PI * 2) {
    const TAU_SEGMENTS = 60;
    const TAU = Math.PI * 2;

    const ang = Math.min(TAU, endAng - startAng);
    const ret = ang === TAU ? []: [[x0, y0]];
    const segments = Math.round(TAU_SEGMENTS * ang / TAU);
    for (let i = 0; i <= segments; i ++) {
        const x = x0 + radius * Math.cos(startAng + ang * i / segments);
        const y = y0 + radius * Math.sin(startAng + ang * i / segments);
        ret.push([x, y]);
    }
    return ret;
}

// 获取抛物线顶点集合
//  x = x0 + 2pt²
//  y = y0 + 2pt
// 抛物线的参数方程是X轴线性方程，Y轴二次方程；物理意义：水平方向匀速，垂直方向匀加速
export function parabola(x0, y0, p, min, max) {
    const LINE_SEGMENTS = 60;

    const ret = [];
    for(let i = 0; i <= LINE_SEGMENTS; i ++) {
        const s = i / 60;
        const t = min * (1 - s) + max * s;
        const x = x0 + 2 * p * t ** 2;
        const y = y0 + 2 * p * t;
        ret.push([x, y]);
    }
    return ret;
}

// 抛物线参数方程
export const parabola2 = parametric(
    t => 25 * t,
    t => 25 * t **2
)

// 阿基米德螺旋线参数方程
export const helical = parametric(
    (t, l) => l * t * Math.cos(t),
    (t, l) => l * t * Math.sin(t)
);

// 星形线参数方程
export const star = parametric(
    (t, l) => l * Math.cos(t) ** 3,
    (t, l) => l * Math.sin(t) ** 3
);

// 二级贝塞尔曲线参数方程
export const quadricBezier = parametric(
    (t, [{x: x0}, {x: x1}, {x: x2}]) => (1 - t) ** 2 * x0 + 2 * (1 - t) * t * x1 + t ** 2 * x2,
    (t, [{y: y0}, {y: y1}, {y: y2}]) => (1 - t) ** 2 * y0 + 2 * (1 - t) * t * y1 + t ** 2 * y2
);

// 三阶贝塞尔曲线参数方程
export const cubicBezier = parametric(
    (t, [{x: x0}, {x: x1}, {x: x2}, {x: x3}]) => (1 - t) ** 3 * x0 + 3 * t * (1 - t) ** 2 * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3 * x3,
    (t, [{y: y0}, {y: y1}, {y: y2}, {y: y3}]) => (1 - t) ** 3 * y0 + 3 * t * (1 - t) ** 2 * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3 * y3
);
