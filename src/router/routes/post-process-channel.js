const _import = (path) => () => import(`../../pages/post-process-channel/${path}.vue`);

export default {
    path: '/post-process-channel',
    name: 'PostProcessChannel',
    component: _import('index'),
    redirect: '/post-process-channel/blur',
    children: [
        {
            path: 'blur',
            name: 'PostProcessChannelBlur',
            component: _import('Blur')
        },
        {
            path: 'tone',
            name: 'PostProcessChannelTone',
            component: _import('Tone')
        },
        {
            path: 'smoke',
            name: 'PostProcessChannelSmoke',
            component: _import('Smoke')
        },
        {
            path: 'practice',
            name: 'PostProcessChannelPractice',
            component: _import('Practice')
        },
    ]
}
