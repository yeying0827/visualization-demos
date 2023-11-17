import Curve from '../../pages/Curve/index.vue';
import CurveVector from '../../pages/Curve/Vector.vue';
import CurveParam from '../../pages/Curve/Param.vue';
import CurveHighLevel from '../../pages/Curve/HighLevel.vue';
import CurveCanvas from '../../pages/Curve/Canvas.vue';
import CurveSVG from '../../pages/Curve/SVG.vue';

export default {
    path: '/curve',
    name: 'Curve',
    component: Curve,
    redirect: '/curve/vector',
    children: [
        {
            path: 'vector',
            name: 'CurveVector',
            component: CurveVector
        },
        {
            path: 'param',
            name: 'CurveParam',
            component: CurveParam
        },
        {
            path: 'high-level',
            name: 'CurveHighLevel',
            component: CurveHighLevel
        },
        {
            path: 'canvas',
            name: 'CurveCanvas',
            component: CurveCanvas
        },
        {
            path: 'svg',
            name: 'CurveSVG',
            component: CurveSVG
        }
    ]
}
