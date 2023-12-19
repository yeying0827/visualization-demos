import Color from '../../pages/Color/index.vue';
import ColorRGB from '../../pages/Color/RGB.vue';
import ColorHSL from '../../pages/Color/HSL.vue';
import ColorCIE from '../../pages/Color/CIE.vue';
import ColorCubehelix from '../../pages/Color/Cubehelix.vue';
import ColorWebGL from '../../pages/Color/WebGL.vue';

export default {
    path: '/color',
    name: 'Color',
    component: Color,
    redirect: '/color/rgb',
    children: [
        {
            path: 'rgb',
            name: 'ColorRGB',
            component: ColorRGB
        },
        {
            path: 'hsl',
            name: 'ColorHSL',
            component: ColorHSL
        },
        {
            path: 'cie',
            name: 'ColorCIE',
            component: ColorCIE
        },
        {
            path: 'cubehelix',
            name: 'ColorCubehelix',
            component: ColorCubehelix
        },
        {
            path: 'webgl',
            name: 'ColorWebGL',
            component: ColorWebGL
        }
    ]
}
