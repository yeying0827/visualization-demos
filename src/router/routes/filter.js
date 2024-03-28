const _import = (path) => () => import(`../../pages/Filter/${path}.vue`);

export default {
    path: '/filter',
    name: 'Filter',
    component: _import('index'),
    redirect: '/filter/gray',
    children: [
        {
            path: 'gray',
            name: 'FilterGray',
            component: _import('Gray')
        },
        {
            path: 'filters',
            name: 'FilterFilters',
            component: _import('Filters')
        },
        {
            path: 'gaussian-blur',
            name: 'FilterGaussianBlur',
            component: _import('GaussianBlur')
        },
        {
            path: 'mix',
            name: 'FilterMix',
            component: _import('Mix')
        },
        {
            path: 'css',
            name: 'FilterCSS',
            component: _import('CSS')
        },
        {
            path: 'Canvas',
            name: 'FilterCanvas',
            component: _import('Canvas')
        },
        {
            path: 'practice',
            name: 'FilterPractice',
            component: _import('Practice')
        },
    ]
}
