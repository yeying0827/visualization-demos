const _import = (path) => () => import(`../../pages/Noise/${path}.vue`);

export default {
    path: '/noise',
    name: 'Noise',
    component: _import('index'),
    redirect: '/noise/fold-line',
    children: [
        {
            path: 'fold-line',
            name: 'NoiseFoldLine',
            component: _import('FoldLine')
        },
        {
            path: 'application',
            name: 'NoiseApplication',
            component: _import('Application')
        },
        {
            path: 'gradient',
            name: 'NoiseGradient',
            component: _import('Gradient')
        },
        {
            path: 'clouds',
            name: 'NoiseClouds',
            component: _import('Clouds')
        },
        {
            path: 'simplex',
            name: 'NoiseSimplex',
            component: _import('Simplex')
        },
        {
            path: 'grid',
            name: 'NoiseGrid',
            component: _import('Grid')
        },
        {
            path: 'practice',
            name: 'NoisePractice',
            component: _import('Practice')
        },
    ]
}
