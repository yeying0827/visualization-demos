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

        if (color) {
            let uColor = gl.getUniformLocation(program, 'uColor'); // 设置颜色
            gl.uniform4fv(uColor, color);
        }

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

    drawCells(cells,
              mode,
              clear = true) {
        const {gl} = this;

        const cellBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cellBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cells, gl.STATIC_DRAW);

        // 执行着色器程序完成绘制
        if (clear) gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(mode || gl.TRIANGLES, cells.length, gl.UNSIGNED_SHORT, 0);
    }

    /**
     * 创建纹理对象
     * @param img
     * @returns {*}
     */
    createTexture(img) {
        const {gl} = this;
        // 创建纹理对象
        const texture = gl.createTexture();

        // 设置预处理函数，由于图片坐标系和WebGL坐标的Y轴是相反的，这个设置可以将图片Y坐标翻转一下
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        // 激活指定纹理单元，WebGL有多个纹理单元，因此在Shader中可以使用多个纹理
        gl.activeTexture(gl.TEXTURE0);

        // 将纹理绑定到当前上下文
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // 指定纹理图像
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            // 1, // width
            // 1, // height
            // 0, // border
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            img
        );

        // 设置纹理的一些参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        // 解除纹理绑定
        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }

    /**
     * 设置纹理
     * @param texture
     * @param fieldName
     * @param idx 编号
     */
    setTexture(texture, fieldName, idx = 0) {
        const {gl, program} = this;
        // 激活纹理单元
        gl.activeTexture(gl.TEXTURE0 + idx);
        // 绑定纹理
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // 获取Shader中纹理变量
        const loc = gl.getUniformLocation(program, fieldName);
        // 将对应的纹理单元写入Shader变量
        gl.uniform1i(loc, idx);
        // 解除纹理绑定
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}
