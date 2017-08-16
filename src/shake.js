/**
 * [merge 将自定义属性合并到默认配置 ]
 * @method merge
 * @param  {[type]} target [description]
 * @param  {[type]} source [description]
 * @return {[type]}        [description]
 */
function merge(target, source) {
    if (typeof source === 'object') {
        for (const prop in source) {
            if (Object.prototype.hasOwnProperty.call(source, prop)) {
                const origin = target.$props ? target.$props : target;
                if (Object.prototype.hasOwnProperty.call(origin, prop)) {
                    origin[prop] = source[prop];
                }
            }
        }
    }
    return target;
}

function shake(options, fn) {
    this.options = {
        threshold: 10,  // 速度
        timeout: 1000,  // 2次时间间隔
    };
    this.options = merge(this.options, options);
    this.hasDeviceMotion = 'ondevicemotion' in window;
    this.lastTime = new Date();
    this.lastX = 0;
    this.lastY = 0;
    this.lastZ = 0;
    this.reset = () => {
        this.lastTime = new Date();
        this.lastX = 0;
        this.lastY = 0;
        this.lastZ = 0;
    };
    this.start = () => {
        this.reset();
        if (this.hasDeviceMotion) {
            window.addEventListener('devicemotion', this, false);
        }
    };

    this.stop = () => {
        if (this.hasDeviceMotion) {
            window.removeEventListener('devicemotion', this, false);
        }
        this.reset();
    };

    this.devicemotion = e => {
        const current = e.accelerationIncludingGravity;
        let currentTime;
        let timeDifference;
        let deltaX = 0;
        let deltaY = 0;
        let deltaZ = 0;
        if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
            this.lastX = current.x;
            this.lastY = current.y;
            this.lastZ = current.z;
            return;
        }

        deltaX = Math.abs(this.lastX - current.x);
        deltaY = Math.abs(this.lastY - current.y);
        deltaZ = Math.abs(this.lastZ - current.z);
        if (((deltaX > this.options.threshold) && (deltaY > this.options.threshold))
        || ((deltaX > this.options.threshold) && (deltaZ > this.options.threshold))
        || ((deltaY > this.options.threshold) && (deltaZ > this.options.threshold))) {
            currentTime = new Date();
            timeDifference = currentTime.getTime() - this.lastTime.getTime();

            if (timeDifference > this.options.timeout) {
                if (fn) fn();
                this.lastTime = new Date();
            }
        }

        this.lastX = current.x;
        this.lastY = current.y;
        this.lastZ = current.z;
    };

    this.handleEvent = e => {
        if (typeof (this[e.type]) === 'function') {
            return this[e.type](e);
        }
        return '';
    };
}

export default shake;
export { shake };
