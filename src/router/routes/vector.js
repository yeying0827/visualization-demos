import Vector from '../../pages/Vector/index.vue';
import VectorBasis from '../../pages/Vector/Basis.vue';
import VectorDistance from '../../pages/Vector/Distance.vue';

export default {
    path: '/vector',
    name: 'Vector',
    component: Vector,
    redirect: '/vector/basis',
    children: [
        {
            path: 'basis',
            name: 'VectorBasis',
            component: VectorBasis
        },
        {
            path: 'distance',
            name: 'VectorDistance',
            component: VectorDistance
        }
    ]
}
