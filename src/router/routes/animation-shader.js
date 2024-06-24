const _import = (path) => () => import(`../../pages/AnimationShader/${path}.vue`);

export default {
    path: 'animation-shader',
    name: 'AnimationShader',
    component: _import('index'),
    redirect: '/animation-shader/fixed-frame',
    children: [
        {
            path: 'fixed-frame',
            name: 'AnimationShaderFixedFrame',
            component: _import('FixedFrame')
        },
        {
            path: 'non-fixed-frame',
            name: 'AnimationShaderNonfixedFrame',
            component: _import('NonfixedFrame')
        },
        {
            path: 'easing',
            name: 'AnimationShaderEasing',
            component: _import('Easing')
        },
        {
            path: 'grain',
            name: 'AnimationShaderGrain',
            component: _import('Grain')
        },
        {
            path: 'practice',
            name: 'AnimationShaderPractice',
            component: _import('Practice')
        },
    ]
}
