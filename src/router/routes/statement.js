const _import = (path) => () => import(`../../pages/Statement/${path}.vue`);

export default {
    path: 'statement',
    name: 'Statement',
    component: _import('index'),
    redirect: '/statement/shape',
    children: [
        {
            path: 'shape',
            name: 'StatementShape',
            component: _import('Shape')
        },
        {
            path: 'hierarchy',
            name: 'StatementHierarchy',
            component: _import('Hierarchy')
        }
    ]
}
