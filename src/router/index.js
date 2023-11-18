import {createRouter, createWebHashHistory} from "vue-router";

import Home from '../pages/Home.vue';
import compare from "./routes/compare.js";
import directive from "./routes/directive.js";
import statement from "./routes/statement.js";
import webglBasis from "./routes/webgl-basis.js";
import axis from "./routes/axis.js";
import vector from "./routes/vector.js";
import curve from "./routes/curve.js";
import polygon from "./routes/polygon.js";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        redirect: '/compare',
        children: [
            compare,
            directive,
            statement,
            webglBasis,
            axis,
            vector,
            curve,
            polygon,
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
