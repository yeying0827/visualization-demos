const _import = (path) => () => import(`../../pages/TextureAndComplexFilter/${path}.vue`);

export default {
    path: '/texture-and-complex-filter',
    name: 'TextureAndComplexFilter',
    component: _import('index'),
    redirect: '/texture-and-complex-filter/canvas',
    children: [
        {
            path: 'canvas',
            name: 'TextureAndComplexFilterCanvas',
            component: _import('Canvas')
        },
        {
            path: 'webgl',
            name: 'TextureAndComplexFilterWebGL',
            component: _import('WebGL')
        },
        {
            path: 'practice',
            name: 'TextureAndComplexFilterPractice',
            component: _import('Practice')
        },
    ]
}
