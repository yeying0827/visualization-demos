const _import = (path) => () => import(`../../pages/Transform/${path}.vue`);

export default {
    path: 'transform',
    name: 'Transform',
    component: _import('index'),
    redirect: '/transform/grain-animation',
    children: [
        {
            path: 'grain-animation',
            name: 'TransformGrainAnimation',
            component: _import('GrainAnimation')
        },
        {
            path: 'css',
            name: 'TransformCSS',
            component: _import('CSS')
        },
        {
            path: 'css-3d',
            name: 'TransformCSS3D',
            component: _import('CSS3D')
        }
    ]
}
