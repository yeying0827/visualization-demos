import Home from "../../pages/Home.vue";
import Demo from "../../pages/Demo.vue";
import DemoMagnifier from "../../pages/DemoMagnifier.vue";
import DemoCircle from "../../pages/DemoCircle.vue";
import DemoMosaic from "../../pages/DemoMosaic.vue";
import DemoShape from "../../pages/DemoShape.vue";
import DemoPolar from "../../pages/DemoPolar.vue";
import DemoPolar2D from "../../pages/DemoPolar2D.vue";
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

export default [
    {
        path: '/',
        name: 'Home',
        component: Home,
        redirect: '/polar',
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
        ]
    },
    {
        path: '/demo',
        name: 'Demo',
        component: Demo
    },
    {
        path: '/demo-magnifier',
        name: 'DemoMagnifier',
        component: DemoMagnifier
    },
    {
        path: '/demo-circle',
        name: 'DemoCircle',
        component: DemoCircle
    },
    {
        path: '/demo-mosaic',
        name: 'DemoMosaic',
        component: DemoMosaic
    },
    {
        path: '/demo-shape',
        name: 'DemoShape',
        component: DemoShape
    },
    {
        path: '/demo-polar',
        name: 'DemoPolar',
        component: DemoPolar
    },
    {
        path: '/demo-polar-2d',
        name: 'DemoPolar2D',
        component: DemoPolar2D
    }
]
