import Home from "../../pages/Home.vue";
import compare from "./compare.js"; // 常见绘图系统
import directive from "./directive.js"; // 指令式绘图系统
import statement from "./statement.js"; // 声明式绘图系统
import webglBasis from "./webgl-basis.js"; // WebGL入门基础
import axis from "./axis.js"; // 使用向量和坐标系
import vector from "./vector.js"; // 向量的乘法
import curve from "./curve.js"; // 描述曲线
import polygon from "./polygon.js"; // 处理多边形
import transform from "./transform.js"; // 仿射变换

export default [
    {
        path: '/',
        name: 'Home',
        component: Home,
        redirect: '/compare',
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
        ]
    }
]
