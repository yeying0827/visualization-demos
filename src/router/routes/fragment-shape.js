const _import = (path) => () => import(`../../pages/FragmentShape/${path}.vue`);

export default {
    path: '/fragment-shape',
    name: 'FragmentShape',
    component: _import('index'),
    redirect: '/fragment-shape/color-control',
    children: [
        {
            path: 'color-control',
            name: 'FragmentShapeColorControl',
            component: _import('ColorControl')
        },
        {
            path: 'circle',
            name: 'FragmentShapeCircle',
            component: _import('Circle')
        },
        {
            path: 'line',
            name: 'FragmentShapeLine',
            component: _import('Line')
        },
        {
            path: 'triangle',
            name: 'FragmentShapeTriangle',
            component: _import('Triangle')
        },
        {
            path: 'sdf',
            name: 'FragmentShapeSDF',
            component: _import('SDF')
        },
        {
            path: 'usage',
            name: 'FragmentShapeUsage',
            component: _import('Usage')
        },
        {
            path: 'practice',
            name: 'FragmentShapePractice',
            component: _import('Practice')
        },
    ]
}
