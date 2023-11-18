import Polygon from '../../pages/Polygon/index.vue';
import PolygonCanvas2DFill from '../../pages/Polygon/Canvas2DFill.vue';
import PolygonCanvas2DCheck from '../../pages/Polygon/Canvas2DCheck.vue';
import PolygonWebGLFill from '../../pages/Polygon/WebGLFill.vue';
import PolygonWebGLCheck from '../../pages/Polygon/WebGLCheck.vue';
import PolygonTess2Fill from '../../pages/Polygon/Tess2Fill.vue';

export default {
    path: '/polygon',
    name: 'Polygon',
    component: Polygon,
    redirect: '/polygon/canvas2d-fill',
    children: [
        {
            path: 'canvas2d-fill',
            name: 'PolygonCanvas2DFill',
            component: PolygonCanvas2DFill
        },
        {
            path: 'canvas2d-check',
            name: 'PolygonCanvas2DCheck',
            component: PolygonCanvas2DCheck
        },
        {
            path: 'webgl-fill',
            name: 'PolygonWebGLFill',
            component: PolygonWebGLFill
        },
        {
            path: 'webgl-check',
            name: 'PolygonWebGLCheck',
            component: PolygonWebGLCheck
        },
        {
            path: 'tess2-triangulation',
            name: 'tess2-PolygonTess2Fill',
            component: PolygonTess2Fill
        }
    ]
}
