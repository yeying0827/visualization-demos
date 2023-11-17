import WebGLBasis from "../../pages/WebGL/index.vue";
import WebGLBasisTriangle from "../../pages/WebGL/Triangle.vue";
import WebGLBasisPolygon from "../../pages/WebGL/Polygon.vue";

export default {
    path: 'webgl-basis',
    name: 'WebGLBasis',
    component: WebGLBasis,
    redirect: '/webgl-basis/triangle',
    children: [
        {
            path: 'triangle',
            name: 'WebGLBasisTriangle',
            component: WebGLBasisTriangle
        },
        {
            path: 'polygon',
            name: 'WebGLBasisPolygon',
            component: WebGLBasisPolygon
        }
    ]
}
