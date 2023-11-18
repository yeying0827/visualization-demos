import {WINDING_NONZERO, WINDING_ODD} from "tess2";
import {tess2Triangulation} from "./polygon.js";

export default class WebGL {
    constructor(gl, vertex, fragment) {
        this.gl = gl;
        this.vertex = vertex;
        this.fragment = fragment;
        this.program = null;
        this.createWebGLProgram();
    }

    createWebGLProgram() {
        const {gl, vertex, fragment} = this;

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertex);
        gl.compileShader(vertexShader);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragment);
        gl.compileShader(fragmentShader);
        // program
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        this.program = program;
    }

    // 读取顶点数据到缓冲区
    buffer (data) {
        const { gl } = this;

        if (!(data instanceof Float32Array)) {
            data = new Float32Array(data);
        }
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            data,
            gl.STATIC_DRAW
        )
    }

    drawSimple(points, mode) {
        const {gl} = this;

        if (!(points instanceof Float32Array)) {
            points = new Float32Array(points);
        }

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

        const vPosition = gl.getAttribLocation(this.program, 'position');
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.clear(gl.COLOR_BUFFER_BIT);
        // gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / 2);
        gl.drawArrays(mode || gl.LINE_STRIP, 0, points.length / 2);
    }

    drawPolygon(points, triangles, color = [1, 0, 0, 1], mode) {
        const {gl} = this;

        // 使用着色器程序
        // 1.定义顶点和三角剖分后的元素
        const position = new Float32Array(points);
        const cells = new Uint16Array(triangles);
        // 2.将数据写入WebGL缓冲区
        const pointerBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pointerBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);
        // 将缓冲区数据读取到GPU
        // 将buffer数据绑定给顶点着色器的position变量
        const vPosition = gl.getAttribLocation(this.program, 'position');
        // 创建一个指向WebGL缓冲区的指针，并保存在vPosition中，在后面由顶点着色器使用
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition); // 激活变量

        let uColor = gl.getUniformLocation(this.program, 'uColor'); // 设置颜色
        gl.uniform4fv(uColor, color);

        const cellBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cellBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cells, gl.STATIC_DRAW);

        // 执行着色器程序完成绘制
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(mode || gl.TRIANGLES, cells.length, gl.UNSIGNED_SHORT, 0);
    }

    drawTriangle(points, { color  } = {}) {
        const { gl, program }= this
        this.buffer(points.flat());

        const vPosition = gl.getAttribLocation(program, 'position')
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(vPosition);

        let uColor = gl.getUniformLocation(program, 'uColor'); // 设置颜色
        gl.uniform4fv(uColor, color);

        gl.drawArrays(/*gl.LINE_LOOP*/gl.TRIANGLES, 0, points.length);
    }

    drawPolygonTess2(points, {
        color,
        rule = WINDING_ODD/*WINDING_NONZERO*/
    } = {}) {
        const triangles = tess2Triangulation(points, rule);
        // if (points.length === 5) {
        //     console.log('tess2', triangles);
        // }
        triangles.forEach(t => this.drawTriangle(t, {color}));
    }
}
