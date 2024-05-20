const _import = (path) => () => import(`../../pages/Polar/${path}.vue`);

export default {
    path: 'polar',
    name: 'Polar',
    component: _import('index'),
    redirect: '/polar/canvas',
    children: [
        {
            path: 'canvas',
            name: 'PolarCanvas',
            component: _import('Canvas')
        },
        {
            path: 'webgl',
            name: 'PolarWebGL',
            component: _import('WebGL')
        },
        {
            path: 'conic-gradients',
            name: 'PolarConicGradients',
            component: _import('ConicGradients')
        },
        {
            path: 'color-wheel',
            name: 'PolarColorWheel',
            component: _import('ColorWheel')
        },
        {
            path: 'practice',
            name: 'PolarPractice',
            component: _import('Practice')
        }
    ]
}
