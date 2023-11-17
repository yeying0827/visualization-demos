/*
* 定义二维向量
* */
export default class Vector2D extends Array {
    constructor(x = 1, y = 0) {
        super(x, y);
    }
    get x() {
        return this[0];
    }
    set x(value) {
        this[0] = value;
    }
    get y() {
        return this[1];
    }
    set y(value) {
        this[1] = value;
    }
    // 获取向量的长度
    get len() {
        // x、y的平方和的平方根
        return Math.hypot(this.x, this.y);
    }
    // 获取向量与X轴的夹角
    get dir() {
        // 向量与X轴的夹角
        return Math.atan2(this.y, this.x);
    }
    // 复制向量
    copy() {
        return new Vector2D(this.x, this.y);
    }
    // 向量的加法
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    // 向量旋转
    rotate(rad) {
        const c = Math.cos(rad),
            s = Math.sin(rad);
        const [x, y] = this;

        this.x = x * c - y * s;
        this.y = x * s + y * c;

        return this;
    }
    scale(length) {
        this.x *= length;
        this.y *= length;

        return this;
    }
    // 向量的点乘
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    // 向量的叉乘
    cross(v) {
        return this.x * v.y - v.x * this.y;
    }
    reverse() {
        return this.copy().scale(-1);
    }
    // 向量的减法
    minus(v) {
        return this.copy().add(v.reverse());
    }
    // 向量归一化
    normalize() {
        return this.copy().scale(1 / this.len);
    }
}
