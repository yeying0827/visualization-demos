import Transform from '../../pages/Transform/index.vue';
import TransformGrainAnimation from '../../pages/Transform/GrainAnimation.vue';
import TransformCSS from '../../pages/Transform/CSS.vue';
import TransformCSS3D from '../../pages/Transform/CSS3D.vue';

export default {
    path: 'transform',
    name: 'Transform',
    component: Transform,
    redirect: '/transform/grain-animation',
    children: [
        {
            path: 'grain-animation',
            name: 'TransformGrainAnimation',
            component: TransformGrainAnimation
        },
        {
            path: 'css',
            name: 'TransformCSS',
            component: TransformCSS
        },
        {
            path: 'css-3d',
            name: 'TransformCSS3D',
            component: TransformCSS3D
        }
    ]
}
