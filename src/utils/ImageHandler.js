/**
 * 异步加载图片
 * @param src {string} 图片路径
 * @returns {Promise<unknown>}
 */
export function loadImage(src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    return new Promise(resolve => {
        img.onload = () => {
            resolve(img);
        };
        img.src = src;
    });
}

const imageDataContext = new WeakMap();
/**
 * 获得图片的`ImageData`数据
 * @param img {HTMLImageElement}
 * @param rect {number[]}
 * @returns {ImageData}
 */
export function getImageData(img, rect = [0, 0, img.width, img.height]) {
    let context;
    if (imageDataContext.has(img)) context = imageDataContext.get(img);
    else {
        // OffscreenCanvas 提供了一个可以脱离屏幕渲染的 canvas 对象。它在窗口环境和web worker环境均有效。
        // https://article.juejin.cn/post/7232983794055266360
        const canvas =  new OffscreenCanvas(img.width, img.height);
        context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        imageDataContext.set(img, context); // 存储img和context的关联关系
    }
    return context.getImageData(...rect);
}

/**
 * 循环遍历`imageData`数据
 * @param imageData {ImageData}
 * @param pass {Function}
 * @returns {ImageData}
 */
export function traverse(imageData, pass) {
    const {width, height, data} = imageData;
    for (let i = 0; i < width * height * 4; i += 4) {
        const [r, g, b, a] = pass({
            // rgba归一化处理
            r: data[i] / 255,
            g: data[i + 1] / 255,
            b: data[i + 2] / 255,
            a: data[i + 3] / 255,
            index: i,
            width,
            height,
            // 像素点对应的横纵坐标（百分比）：`i / 4`可以得出当前是像素点数组中的第几个
            x: ((i / 4) % width) / width, // 每一列像素点`%width`求模得到的结果一样，相当于每一行的第几个，再`/ width`得到x坐标
            y: Math.floor(i / 4 / width) / height // `i / 4 / width`得出像素点在第几行，再`/ height`得到y坐标
        });
        data.set([r, g, b, a].map(v => Math.round(v * 255)), i);
    }
    return imageData;
}

/**
 * 生成高斯分布矩阵
 * @param radius {number} (周围)几格以内(的像素)
 * @param sigma {number}
 * @returns {{sum: number, matrix: number[]}}
 */
function gaussianMatrix(radius, sigma = radius / 3) {
    const a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
    const b = -1 / (2 * sigma ** 2);
    let sum = 0;
    const matrix = [];
    // 按照一位高斯函数加权
    for (let x = -radius; x <= radius; x ++) {
        const g = a * Math.exp(b * x ** 2);
        matrix.push(g);
        sum += g;
    }

    // 求平均
    for (let i = 0, len = matrix.length; i < len; i ++) {
        matrix[i] /= sum;
    }

    return {matrix, sum};
}

/**
 * 平滑效果滤镜：高斯模糊
 * @param pixels {Uint8ClampedArray} ImageData.data
 * @param width {number}
 * @param height {number}
 * @param radius {number}
 * @param sigma {number}
 * @returns {Uint8ClampedArray}
 */
export function gaussianBlur(pixels, width, height, radius = 3, sigma = radius / 3) {
    const {matrix, sum} = gaussianMatrix(radius, sigma);
    // x方向一维高斯运算
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            let r = 0,
                g = 0,
                b = 0;
            for (let j = -radius; j <= radius; j ++) {
                const k = x + j; // 当前像素点x坐标
                if (k >= 0 && k < width) {
                    const i = (y * width + k) * 4; // 对应像素点在ImageData.data数组中的下标
                    r += pixels[i]     * matrix[j + radius];
                    g += pixels[i + 1] * matrix[j + radius];
                    b += pixels[i + 2] * matrix[j + radius];
                }
            }
            const i = (y * width + x) * 4;
            // 除以`sum`是为了消除处于边缘的像素，高斯运算不足的问题
            pixels[i]     = r / sum;
            pixels[i + 1] = g / sum;
            pixels[i + 2] = b / sum;
        }
    }

    // y方向一维高斯运算
    for (let x = 0; x < width; x ++) {
        for (let y = 0; y < height; y ++) {
            let r = 0,
                g = 0,
                b = 0;
            for (let i = -radius; i <= radius; i ++) {
                const k = y + i;  // 当前像素点y坐标
                if (k >= 0 && k < height) {
                    const j = (k * width + x) * 4; // 对应像素点在ImageData.data数组中的起始下标
                    r += pixels[j]     * matrix[i + radius];
                    g += pixels[j + 1] * matrix[i + radius];
                    b += pixels[j + 2] * matrix[i + radius];
                }
            }
            const j = (y * width + x) * 4;
            // 除以sum是为了消除处于边缘的像素，高斯运算不足的问题
            pixels[j]     = r / sum;
            pixels[j + 1] = g / sum;
            pixels[j + 2] = b / sum;
        }
    }

    return pixels;
}
