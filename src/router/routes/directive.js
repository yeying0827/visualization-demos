import Directive from "../../pages/Directive/index.vue";
import DirectiveShape from "../../pages/Directive/Shape.vue";
import DirectiveHierarchy from "../../pages/Directive/Hierarchy.vue";

export default {
    path: 'directive',
    name: 'Directive',
    component: Directive,
    redirect: '/directive/shape',
    children: [
        {
            path: 'shape',
            name: 'DirectiveShape',
            component: DirectiveShape
        },
        {
            path: 'hierarchy',
            name: 'DirectiveHierarchy',
            component: DirectiveHierarchy
        }
    ]
}
