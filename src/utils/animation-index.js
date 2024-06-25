/**
 * 用于处理动画的时间
 */
export class Timing {
    constructor({duration, iterations = 1, easing = p => p} = {}) {
        this.startTime = Date.now();
        this.duration = duration; // 周期。一个周期的时长
        this.iterations = iterations; // 重复次数
        this.easing = easing; // 缓动函数
    }

    /**
     * 动画经过的时间
     * @returns {number}
     */
    get time() {
        return Date.now() - this.startTime;
    }

    /**
     * 动画进度
     * @returns {number|number}
     */
    get p() {
        // 动画持续了几个周期
        const progress = Math.min(this.time / this.duration, this.iterations);
        // 动画已结束：进度1
        // 动画未结束：0~1
        return this.isFinished ? 1 : this.easing(progress % 1);
    }

    /**
     * 动画是否已结束
     * @returns {boolean}
     */
    get isFinished() {
        // 动画持续了几个周期是否已达到指定次数
        return this.time / this.duration >= this.iterations;
    }
}

export class Animator {
    constructor({duration, iterations, easing}) {
        this.timingParam = {duration, iterations, easing};
    }

    /**
     * 执行动画
     * @param target
     * @param update
     * @returns {Promise<unknown>}
     */
    animate(target, update) {
        let frameIndex = 0; // 帧序号
        const timing = new Timing(this.timingParam);

        return new Promise(resolve => {
            function next() {
                // 通过执行update更新动画
                if(update({target, frameIndex, timing}) !== false
                    && !timing.isFinished) {
                    requestAnimationFrame(next);
                } else {
                    resolve(timing);
                }
                frameIndex ++;
            }
            next();
        })
    }
}
