import Compare from "../../pages/Compare/index.vue";
import CompareCss from "../../pages/Compare/CSS.vue";
import CompareSvg from "../../pages/Compare/SVG.vue";

export default {
    path: 'compare',
    name: 'Compare',
    component: Compare,
    redirect: '/compare/css',
    children: [
        {
            path: 'css',
            name: 'CompareCss',
            component: CompareCss
        },
        {
            path: 'svg',
            name: 'CompareSvg',
            component: CompareSvg
        }
    ]
}
