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
