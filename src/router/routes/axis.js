import Axis from '../../pages/Axis/index.vue';
import AxisBasis from '../../pages/Axis/Basis.vue';
import AxisTransform from '../../pages/Axis/Transform.vue';
import AxisTree from '../../pages/Axis/Tree.vue';

export default {
    path: 'axis',
    name: 'Axis',
    component: Axis,
    redirect: '/axis/basis',
    children: [
        {
            path: 'basis',
            name: 'AxisBasis',
            component: AxisBasis
        },
        {
            path: 'transform',
            name: 'AxisTransform',
            component: AxisTransform
        },
        {
            path: 'tree',
            name: 'AxisTree',
            component: AxisTree
        }
    ]
}
