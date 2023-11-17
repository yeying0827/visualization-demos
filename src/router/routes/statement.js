import Statement from "../../pages/Statement/index.vue";
import StatementShape from "../../pages/Statement/Shape.vue";
import StatementHierarchy from "../../pages/Statement/Hierarchy.vue";

export default {
    path: 'statement',
    name: 'Statement',
    component: Statement,
    redirect: '/statement/shape',
    children: [
        {
            path: 'shape',
            name: 'StatementShape',
            component: StatementShape
        },
        {
            path: 'hierarchy',
            name: 'StatementHierarchy',
            component: StatementHierarchy
        }
    ]
}
