const _import = (path) => () => import(`../../pages/Polygon/${path}.vue`);

export default {
    path: '/polygon',
    name: 'Polygon',
    component: _import('index'),
    redirect: '/polygon/canvas2d-fill',
    children: [
        {
            path: 'canvas2d-fill',
            name: 'PolygonCanvas2DFill',
            component: _import('Canvas2DFill')
        },
        {
            path: 'canvas2d-check',
            name: 'PolygonCanvas2DCheck',
            component: _import('Canvas2DCheck')
        },
        {
            path: 'webgl-fill',
            name: 'PolygonWebGLFill',
            component: _import('WebGLFill')
        },
        {
            path: 'webgl-check',
            name: 'PolygonWebGLCheck',
            component: _import('WebGLCheck')
        },
        {
            path: 'tess2-triangulation',
            name: 'PolygonTess2Fill',
            component: _import('Tess2Fill')
        }
    ]
}
