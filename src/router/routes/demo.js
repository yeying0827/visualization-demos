const _import = (path) => () => import(`../../pages/Demo/${path}.vue`);

export default [
    {
        path: '/demo',
        name: 'Demo',
        component: _import('Demo')
    },
    {
        path: '/demo-magnifier',
        name: 'DemoMagnifier',
        component: _import('DemoMagnifier')
    },
    {
        path: '/demo-circle',
        name: 'DemoCircle',
        component: _import('DemoCircle')
    },
    {
        path: '/demo-mosaic',
        name: 'DemoMosaic',
        component: _import('DemoMosaic')
    },
    {
        path: '/demo-shape',
        name: 'DemoShape',
        component: _import('DemoShape')
    },
    {
        path: '/demo-polar',
        name: 'DemoPolar',
        component: _import('DemoPolar')
    },
    {
        path: '/demo-polar-2d',
        name: 'DemoPolar2D',
        component: _import('DemoPolar2D')
    },
    {
        path: '/demo-noise',
        name: 'DemoNoise',
        component: _import('DemoNoise')
    },
    {
        path: '/demo-pps',
        name: 'DemoPPS',
        component: _import('DemoPPS')
    },
    {
        path: '/demo-animation',
        name: 'DemoAnimation',
        component: _import('DemoAnimation')
    },
    {
        path: '/demo-animation-shader',
        name: 'DemoAnimationShader',
        component: _import('DemoAnimationShader')
    },
    {
        path: '/demo-3d',
        name: 'Demo3D',
        component: _import('Demo3D')
    }
]

