const _import = (path) => () => import(`../../pages/Axis/${path}.vue`);

export default {
    path: 'axis',
    name: 'Axis',
    component: _import('index'),
    redirect: '/axis/basis',
    children: [
        {
            path: 'basis',
            name: 'AxisBasis',
            component: _import('Basis')
        },
        {
            path: 'transform',
            name: 'AxisTransform',
            component: _import('Transform')
        },
        {
            path: 'tree',
            name: 'AxisTree',
            component: _import('Tree')
        }
    ]
}
