const _import = (path) => () => import(`../../pages/Compare/${path}.vue`);

export default {
    path: 'compare',
    name: 'Compare',
    component: _import('index'),
    redirect: '/compare/css',
    children: [
        {
            path: 'css',
            name: 'CompareCss',
            component: _import('CSS')
        },
        {
            path: 'svg',
            name: 'CompareSvg',
            component: _import('SVG')
        }
    ]
}
