const _import = (path) => () => import(`../../pages/Vector/${path}.vue`);

export default {
    path: '/vector',
    name: 'Vector',
    component: _import('index'),
    redirect: '/vector/basis',
    children: [
        {
            path: 'basis',
            name: 'VectorBasis',
            component: _import('Basis')
        },
        {
            path: 'distance',
            name: 'VectorDistance',
            component: _import('Distance')
        }
    ]
}
