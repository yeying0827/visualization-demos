const _import = (path) => () => import(`../../pages/WebGL/${path}.vue`);

export default {
    path: 'webgl-basis',
    name: 'WebGLBasis',
    component: _import('index'),
    redirect: '/webgl-basis/triangle',
    children: [
        {
            path: 'triangle',
            name: 'WebGLBasisTriangle',
            component: _import('Triangle')
        },
        {
            path: 'polygon',
            name: 'WebGLBasisPolygon',
            component: _import('Polygon')
        }
    ]
}
