export default class Canvas2D {
    constructor(ctx) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.transformCoordinate();
    }

    // 变换坐标系
    transformCoordinate() {
        const {ctx, canvas} = this;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(1, -1); // 绕X轴翻转
    }

    // 绘制坐标
    drawAxis(color = '#333') {
        const {canvas} = this;

        this.drawLine([-canvas.width / 2, 0], [canvas.width / 2, 0], color);
        this.drawLine([0, canvas.height / 2], [0, -canvas.height / 2], color);
    }

    // 绘制直线
    drawLine(start, end, color, width = '4px') {
        const {ctx} = this;

        ctx.beginPath();
        ctx.save();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(...start);
        ctx.lineTo(...end);
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    }

    // 绘制文本
    drawText(text, x, y, fillStyle = '#333', font = "16px serif") {
        const {ctx} = this;

        ctx.beginPath();
        ctx.save();
        ctx.font = font;
        ctx.scale(1, -1);
        ctx.fillStyle = fillStyle;
        ctx.fillText(`${text}`, x, y);
        ctx.restore();
    }

    // 多边形描边
    strokePolygon(vertices, strokeStyle) {
        const {ctx} = this;

        ctx.beginPath();
        ctx.moveTo(...vertices[0]);
        for (let i = 1; i < vertices.length; i ++) {
            ctx.lineTo(...vertices[i]);
        }
        ctx.closePath();
        if (strokeStyle) ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }

    // 填充多边形
    fillPolygon(vertices, {
        fillStyle = "red",
        close = false,
        rule = "nonzero"
    } = {}) {
        const {ctx} = this;

        ctx.beginPath();
        ctx.moveTo(...vertices[0]);
        for (let i = 1; i < vertices.length; i ++) {
            ctx.lineTo(...vertices[i]);
        }
        if (close) ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill(rule);  // 设置填充规则
    }
}
