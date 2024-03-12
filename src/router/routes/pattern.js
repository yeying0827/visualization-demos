const _import = (path) => () => import(`../../pages/Pattern/${path}.vue`);

export default {
    path: 'pattern',
    name: 'Pattern',
    component: _import('index'),
    redirect: '/pattern/css',
    children: [
        {
            path: 'css',
            name: 'PatternCSS',
            component: _import('CSS')
        },
        {
            path: 'webgl',
            name: 'PatternWebGL',
            component: _import('WebGL')
        },
        {
            path: 'fractal',
            name: 'FractalPatternWebGL',
            component: _import('fractalPattern')
        },
        {
            path: 'random',
            name: 'RandomPattern',
            component: _import('RandomPattern')
        },
        {
            path: 'practice',
            name: 'PracticePattern',
            component: _import('PracticePattern')
        }
    ]
}
