import Home from "../../pages/Home.vue";
import demo from "./demo.js";
import compare from "./compare.js"; // 常见绘图系统
import directive from "./directive.js"; // 指令式绘图系统
import statement from "./statement.js"; // 声明式绘图系统
import webglBasis from "./webgl-basis.js"; // WebGL入门基础
import axis from "./axis.js"; // 使用向量和坐标系
import vector from "./vector.js"; // 向量的乘法
import curve from "./curve.js"; // 描述曲线
import polygon from "./polygon.js"; // 处理多边形
import transform from "./transform.js"; // 仿射变换
import color from "./color.js"; // 颜色表示
import pattern from "./pattern.js"; // 图案生成
import filter from "./filter.js"; // 滤镜函数
import textureAndComplexFilter from "./texture-and-complex-filter.js"; // 给简单图案添加纹理和复杂滤镜
import fragmentShape from "./fragment-shape.js"; // 使用片元着色器进行几何造型
import polar from "./polar.js"; // 用极坐标系绘制有趣图案
import noise from "./noise.js"; // 用噪声生成复杂的纹理
import postProcessChannel from "./post-process-channel.js"; // 使用后期处理通道增强图像效果
import animation from "./animation.js"; // 生成简单动画让图形动起来
import animationShader from "./animation-shader.js"; // 用着色器实现像素动画

export default [
    {
        path: '/',
        name: 'Home',
        component: Home,
        redirect: '/animation-shader',
        children: [
            compare,
            directive,
            statement,
            webglBasis,
            axis,
            vector,
            curve,
            polygon,
            transform,
            color,
            pattern,
            filter,
            textureAndComplexFilter,
            fragmentShape,
            polar,
            noise,
            postProcessChannel,
            animation,
            animationShader,
        ]
    },
    ...demo
]
