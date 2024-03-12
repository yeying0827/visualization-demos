const _import = (path) => () => import(`../../pages/Directive/${path}.vue`);

export default {
    path: 'directive',
    name: 'Directive',
    component: _import('index'),
    redirect: '/directive/shape',
    children: [
        {
            path: 'shape',
            name: 'DirectiveShape',
            component: _import('Shape')
        },
        {
            path: 'hierarchy',
            name: 'DirectiveHierarchy',
            component: _import('Hierarchy')
        }
    ]
}
