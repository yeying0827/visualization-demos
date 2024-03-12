import {WINDING_NONZERO, WINDING_ODD} from "tess2";
import {tess2Triangulation} from "./polygon.js";

export default class WebGL {
    constructor(gl, vertex, fragment) {
        this.gl = gl;
        // 设置shader对应的GLSL代码
        this.vertex = vertex;
        this.fragment = fragment;
        // 创建WebGL程序
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

        // 检测着色器
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(vertexShader));
        }
        // 检测着色器程序
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            alert(gl.getProgramInfoLog(program));
        }

        this.program = program;
    }

    // 把顶点数据写到缓冲区
    bufferPosition (data) {
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
    /*
    * 将缓冲区数据读取到GPU：
    * 将顶点的buffer数据绑定给顶点着色器的position变量
    * */
    readPosition(positionName = "position") {
        const {gl, program} = this;

        const vPosition = gl.getAttribLocation(program, positionName);
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
    }

    /**
     * 设置uniform变量
     * @param uniforms 变量数组
     */
    setUniforms(uniforms) {
        const {gl, program} = this;

        let uniform;
        uniforms.forEach(item => {
            // gl.getUniformLocation 获取uniform变量的指针
            uniform = gl.getUniformLocation(program, item[0]); // 设置uniform变量
            // 将数据传给uniform变量的地址
            switch(item[2]) {
                case '4fv':
                    gl.uniform4fv(uniform, item[1]); break;
                case '2fv':
                    gl.uniform2fv(uniform, item[1]); break;
                case '1f':
                    gl.uniform1f(uniform, item[1]); break;
                default:
                    break;
            }
        });
    }

    /**
     * 绘制简单的三角形
     * @param points 顶点数组
     * @param size 构成一个顶点的坐标向量长度
     * @param mode 绘图模式
     */
    drawSimple(points, size = 2, mode) {
        const {gl} = this;

        if (!(points instanceof Float32Array)) {
            points = new Float32Array(points);
        }

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

        const vPosition = gl.getAttribLocation(this.program, 'position');
        gl.vertexAttribPointer(vPosition, size, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.clear(gl.COLOR_BUFFER_BIT);
        // gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / size);
        gl.drawArrays(mode || gl.LINE_STRIP, 0, points.length / size);
    }

    /**
     * 绘制多边形（earcut）
     * @param points 顶点数组
     * @param triangles 剖分后的三角形数组（earcut三角剖分）
     * @param uniforms 传递的uniform字段
     * @param mode 绘图模式
     * @param clear 是否清除画布
     */
    drawPolygon(points,
                triangles,
                uniforms = [
                    ['uColor', [1, 0, 0, 1], '4fv']
                ],
                mode,
                clear = true
    ) {
        const {gl, program} = this;

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
        const vPosition = gl.getAttribLocation(program, 'position');
        // 创建一个指向WebGL缓冲区的指针，并保存在vPosition中，在后面由顶点着色器使用
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition); // 激活变量

        this.setUniforms(uniforms);

        const cellBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cellBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cells, gl.STATIC_DRAW);

        // 执行着色器程序完成绘制
        if (clear) gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(mode || gl.TRIANGLES, cells.length, gl.UNSIGNED_SHORT, 0);
    }

    drawTriangle(points, { color  } = {}) {
        const { gl, program }= this
        this.bufferPosition(points.flat());

        const vPosition = gl.getAttribLocation(program, 'position')
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(vPosition);

        let uColor = gl.getUniformLocation(program, 'uColor'); // 设置颜色
        gl.uniform4fv(uColor, color);

        gl.drawArrays(/*gl.LINE_LOOP*/gl.TRIANGLES, 0, points.length);
    }

    /**
     * 绘制多边形（TESS2）
     * @param points 顶点数组
     * @param color 填充色
     * @param rule 剖分规则
     */
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
