const _import = (path) => () => import(`../../pages/Color/${path}.vue`);

export default {
    path: '/color',
    name: 'Color',
    component: _import('index'),
    redirect: '/color/rgb',
    children: [
        {
            path: 'rgb',
            name: 'ColorRGB',
            component: _import('RGB')
        },
        {
            path: 'hsl',
            name: 'ColorHSL',
            component: _import('HSL')
        },
        {
            path: 'cie',
            name: 'ColorCIE',
            component: _import('CIE')
        },
        {
            path: 'cubehelix',
            name: 'ColorCubehelix',
            component: _import('Cubehelix')
        },
        {
            path: 'webgl',
            name: 'ColorWebGL',
            component: _import('WebGL')
        }
    ]
}
