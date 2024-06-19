const _import = (path) => () => import(`../../pages/Animation/${path}.vue`);

export default {
    path: 'animation',
    name: 'Animation',
    component: _import('index'),
    redirect: '/animation/three-ways',
    children: [
        {
            path: 'three-ways',
            name: 'AnimationThreeWays',
            component: _import('ThreeWays')
        },
        {
            path: 'model',
            name: 'AnimationModel',
            component: _import('Model')
        },
        {
            path: 'easing',
            name: 'AnimationEasing',
            component: _import('Easing')
        },
        {
            path: 'practice',
            name: 'AnimationPractice',
            component: _import('Practice')
        },
    ]
}
