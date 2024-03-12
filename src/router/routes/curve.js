const _import = (path) => () => import(`../../pages/Curve/${path}.vue`);

export default {
    path: '/curve',
    name: 'Curve',
    component: _import('index'),
    redirect: '/curve/vector',
    children: [
        {
            path: 'vector',
            name: 'CurveVector',
            component: _import('Vector')
        },
        {
            path: 'param',
            name: 'CurveParam',
            component: _import('Param')
        },
        {
            path: 'high-level',
            name: 'CurveHighLevel',
            component: _import('HighLevel')
        },
        {
            path: 'canvas',
            name: 'CurveCanvas',
            component: _import('Canvas')
        },
        {
            path: 'svg',
            name: 'CurveSVG',
            component: _import('SVG')
        }
    ]
}
