const _import = (path) => () => import(`../../pages/3D/${path}.vue`);

export default {
    path: '3d',
    name: '3D',
    component: _import('index'),
    redirect: '/3d/cube',
    children: [
        {
            path: 'cube',
            name: '3DCube',
            component: _import('Cube')
        },
        {
            path: 'normal',
            name: '3DNormal',
            component: _import('Normal')
        },
        {
            path: 'practice',
            name: '3DPractice',
            component: _import('Practice')
        },
    ]
}
