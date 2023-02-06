/**
 *  题目描述:实现一个 compose 函数
 *  用法如下:
 *  function fn1(x) {return x + 1;}function fn2(x) {return x + 2;}function fn3(x) {return x + 3;}function fn4(x) {return x + 4;}const a = compose(fn1, fn2, fn3, fn4); console.log(a(1))
 * 前一个函数的返回值作为后一个函数的参数依次调用
 * compose的函数作用就是组合函数的，将函数串联起来执行。
 * 将多个函数组合起来，一个函数的输出记过是另一个函数的输入参数，一旦第一个函数开始执行，就会像多米诺骨牌一样推导执行.
 * */
const compose = (...fn) => {
    console.log('解构后的fn', ...fn);
    console.log('fn的长度', fn.length);
    // 当不存在fn的时候
    if (!fn.length) return (v) => v;
    // 如果只有一个参数时候,返回第一个函数
    if (fn.length === 1) return fn[0];
    // 如果存在多个函数时候
    /**
     * reduce函数,逐个遍历数组元素，每一步都将当前元素的值与上一步的计算结果相加
     * （上一步的计算结果是当前元素之前所有元素的总和）——直到没有更多的元素被相加。
     * 语法使用 : reduce(function(previousValue, currentValue, currentIndex, array) { 函数内容 }, initialValue)
     * 参数说明 : 
     *       previousValue：上一次调用 callbackFn 时的返回值。
     *       在第一次调用时，若指定了初始值 initialValue，其值则为 initialValue，否则为数组索引为 0 的元素 array[0]
     *       currentValue：数组中正在处理的元素.在第一次调用时,若指定了初始值 initialValue,其值则为数组索引为 0 的元素          
     *       array[0]，否则为 array[1]。
     *       currentIndex：数组中正在处理的元素的索引。若指定了初始值 initialValue，则起始索引号为 0，否则从索引 1 起始。
     *       array：用于遍历的数组。
     */
    return fn.reduce(
        (pre, cur) =>
            (...args) =>
                pre(cur(...args))
    );
}

/**
 * settimeout 模拟实现 setinterval(带清除定时器的版本)
 */
const mySettimeout = () => {
    let timer = null;
    function interval() {
        fn();
        timer = setTimeout(interval, t);
    }
    interval();
    return {
        cancel: () => {
            clearTimeout(timer)
        }
    }
}

/**
 * 使用 setinterval 模拟实现 settimeout
 */
const mySetTimeout = () => {
    const timer = setInterval(() => {
        clearInterval(timer);
        fn();
    }, time);
}

/**
 * setInterval存在的问题 ? 
 * 在 setInterval 被推入任务队列时，如果在它前面有很多任务或者某个任务等待时间较长比如网络请求等，
 * 那么这个定时器的执行时间和我们预定它执行的时间可能并不一致。
 * 意味着，如果我们定时器里面的代码需要进行大量的计算，花费的时间就会比较长，
 * 那么我上一次的代码还没有执行完毕，那么我又推入了下一次的代码去任务队列，这个时候就会变得不准确。
 * 根据上文我们得知，setInterval是存在以下缺点的：
 * 使用setInterval时，某些间隔会被跳过（如果上一次执行代码没有执行，那么这次的执行代码将不会被放入队列，会被跳过）
 * 可能多个定时器会连续执行（上一次代码在队列中等待还没有开始执行，然后定时器又添加第二次代码，第一次代码等待时间和执行时间刚好等于第二次代码执行）
 * 通俗来说：每个 setTimeout 产生的任务会直接 push 到任务队列中；而 setInterval 在每次把任务 push 到任务队列前，都要进行一下判
 * (看上次的任务是否仍在队列中，如果有则不添加，没有则添加)
 */

/*
 * 实现一个发布订阅模式拥有 on emit once off 方法  
 * 
 */
class EventEmitter {
    constructor() {
        this.events = {};
    }
    // 实现订阅
    on(type, callBack) {
        if (!this.events[type]) {
            this.events[type] = [callBack];
        } else {
            this.events[type].push(callBack);
        }
    }
    // 删除订阅
    off(type, callBack) {
        if (!this.events[type]) return;
        this.events[type] = this.events[type].filter((item) => {
            return item !== callBack;
        });
    }
    // 只执行一次订阅事件
    once(type, callBack) {
        function fn() {
            callBack();
            this.off(type, fn);
        }
        this.on(type, fn);
    }
    // 触发事件
    emit(type, ...rest) {
        this.events[type] &&
            this.events[type].forEach((fn) => fn.apply(this, rest));
    }
}
// 使用如下
// const event = new EventEmitter();

// const handle = (...rest) => {
//   console.log(rest);
// };

// event.on("click", handle);

// event.emit("click", 1, 2, 3, 4);

// event.off("click", handle);

// event.emit("click", 1, 2);

// event.once("dbClick", () => {
//   console.log(123456);
// });
// event.emit("dbClick");
// event.emit("dbClick");

/**
 * 一步实现数组去重
 */
const uniqueArr = (arr) => {
    return [...new Set(arr)];
}

/**
 * 实现数组扁平化
 * 使用递归思路
 */
const flatter = (arr) => {
    // 如果部署数组直接返回
    if (!arr.length) return;
    // 递归调用
    return arr.reduce(
        (pre, cur) =>
            Array.isArray(cur) ? [...pre, ...flatter(cur)] : [...pre, cur], []
    );
}

/**
 * 使用迭代思路实现数组扁平化
 */
const anotherflatter = (arr) => {
    if (!arr.length) return;
    while (arr.some((item) => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}
// console.log(flatter([1, 2, [1, [2, 3, [4, 5, [6]]]]]));

/**
 * 实现寄生组合继承
 */
const Parent = (name) => {
    this.name = name;
    this.say = () => {
        console.log(111);
    };
}
Parent.prototype.play = () => {
    console.log(222);
};
const Children = (name) => {
    Parent.call(this);
    this.name = name;
}
Children.prototype = Object.create(Parent.prototype);
Children.prototype.constructor = Children;
// let child = new Children("111");
// // console.log(child.name);
// // child.say();
// // child.play();

/**
 * 实现new操作符
 */
const myNew = (fn, ...args) => {
    let obj = Object.create(fn.prototype);
    let res = fn.call(obj, ...args);
    if (res && (typeof res === "object" || typeof res === "function")) {
        return res;
    }
    return obj;
}
//   用法如下：
// // function Person(name, age) {
// //   this.name = name;
// //   this.age = age;
// // }
// // Person.prototype.say = function() {
// //   console.log(this.age);
// // };
// // let p1 = myNew(Person, "lihua", 18);
// // console.log(p1.name);
// // console.log(p1);
// // p1.say();

/**
 * 实现有并行限制的 Promise 调度器
 * 保证同时运行的任务最多有两个
 */
class Scheduler {
    constructor(limit) {
        this.queue = [];
        this.maxCount = limit;
        this.runCounts = 0;
    }
    add(time, order) {
        const promiseCreator = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(order);
                    resolve();
                }, time);
            });
        };
        this.queue.push(promiseCreator);
    }
    taskStart() {
        for (let i = 0; i < this.maxCount; i++) {
            this.request();
        }
    }
    request() {
        if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
            return;
        }
        this.runCounts++;
        this.queue
            .shift()()
            .then(() => {
                this.runCounts--;
                this.request();
            });
    }
}
const scheduler = new Scheduler(2);
const addTask = (time, order) => {
    scheduler.add(time, order);
};
addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
scheduler.taskStart();

/**
 * 手写实现call,apply,bind
 */
Function.prototype.myCall = function (context, ...args) {
    if (!context || context === null) {
        context = window;
    }
    // 创造唯一的key值  作为我们构造的context内部方法名
    let fn = Symbol();
    context[fn] = this; //this指向调用call的函数
    // 执行函数并返回结果 相当于把自身作为传入的context的方法进行调用了
    return context[fn](...args);
};

// apply原理一致  只是第二个参数是传入的数组
Function.prototype.myApply = function (context, args) {
    if (!context || context === null) {
        context = window;
    }
    // 创造唯一的key值  作为我们构造的context内部方法名
    let fn = Symbol();
    context[fn] = this;
    // 执行函数并返回结果
    return context[fn](...args);
};

//bind实现要复杂一点  因为他考虑的情况比较多 还要涉及到参数合并(类似函数柯里化)

Function.prototype.myBind = function (context, ...args) {
    if (!context || context === null) {
        context = window;
    }
    // 创造唯一的key值  作为我们构造的context内部方法名
    let fn = Symbol();
    context[fn] = this;
    let _this = this;
    //  bind情况要复杂一点
    const result = function (...innerArgs) {
        // 第一种情况 :若是将 bind 绑定之后的函数当作构造函数，通过 new 操作符使用，则不绑定传入的 this，而是将 this 指向实例化出来的对象
        // 此时由于new操作符作用  this指向result实例对象  而result又继承自传入的_this 根据原型链知识可得出以下结论
        // this.__proto__ === result.prototype   //this instanceof result =>true
        // this.__proto__.__proto__ === result.prototype.__proto__ === _this.prototype; //this instanceof _this =>true
        if (this instanceof _this === true) {
            // 此时this指向指向result的实例  这时候不需要改变this指向
            this[fn] = _this;
            this[fn](...[...args, ...innerArgs]); //这里使用es6的方法让bind支持参数合并
        } else {
            // 如果只是作为普通函数调用  那就很简单了 直接改变this指向为传入的context
            context[fn](...[...args, ...innerArgs]);
        }
    };
    // 如果绑定的是构造函数 那么需要继承构造函数原型属性和方法
    // 实现继承的方式: 使用Object.create
    result.prototype = Object.create(this.prototype);
    return result;
};

//用法如下

// function Person(name, age) {
//   console.log(name); //'我是参数传进来的name'
//   console.log(age); //'我是参数传进来的age'
//   console.log(this); //构造函数this指向实例对象
// }
// // 构造函数原型的方法
// Person.prototype.say = function() {
//   console.log(123);
// }
// let obj = {
//   objName: '我是obj传进来的name',
//   objAge: '我是obj传进来的age'
// }
// // 普通函数
// function normalFun(name, age) {
//   console.log(name);   //'我是参数传进来的name'
//   console.log(age);   //'我是参数传进来的age'
//   console.log(this); //普通函数this指向绑定bind的第一个参数 也就是例子中的obj
//   console.log(this.objName); //'我是obj传进来的name'
//   console.log(this.objAge); //'我是obj传进来的age'
// }

// 先测试作为构造函数调用
// let bindFun = Person.myBind(obj, '我是参数传进来的name')
// let a = new bindFun('我是参数传进来的age')
// a.say() //123

// 再测试作为普通函数调用
// let bindFun = normalFun.myBind(obj, '我是参数传进来的name')
//  bindFun('我是参数传进来的age')

/**
 * 深拷贝（考虑到复制 Symbol 类型）
 */
const isObject = (val) => {
    return typeof val === "object" && val !== null;
}

function deepClone(obj, hash = new WeakMap()) {
    if (!isObject(obj)) return obj;
    if (hash.has(obj)) {
        return hash.get(obj);
    }
    let target = Array.isArray(obj) ? [] : {};
    hash.set(obj, target);
    Reflect.ownKeys(obj).forEach((item) => {
        if (isObject(obj[item])) {
            target[item] = deepClone(obj[item], hash);
        } else {
            target[item] = obj[item];
        }
    });

    return target;
}
// var obj1 = {
// a:1,
// b:{a:2}
// };
// var obj2 = deepClone(obj1);
// console.log(obj1);

/**
 * 实现instance of
 */
const myinstanceof = (left, right) => {
    while (true) {
        if (left === null) {
            return false;
        }
        if (left.__proto__ === right.prototype) {
            return true;
        }
        left = left.__proto__;
    }
}

/**
 * 实现函数柯里化
 * 柯里化（Currying），又称部分求值（Partial Evaluation），
 * 是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，
 * 并且返回接受余下的参数而且返回结果的新函数的技术。
 * 核心思想是把多参数传入的函数拆成单参数（或部分）函数，内部再返回调用下一个单参数（或部分）函数，依次处理剩余的参数。
 */
const currying = (fn, ...args) => {
    const length = fn.length;
    let allArgs = [...args];
    const res = (...newArgs) => {
        allArgs = [...allArgs, ...newArgs];
        if (allArgs.length === length) {
            return fn(...allArgs);
        } else {
            return res;
        }
    };
    return res;
}

/**
 * 实现冒泡排序
 * 
 */
const bubbleSort = (arr) => {
    // 缓存数组长度
    const len = arr.length;
    // 外层循环用于控制从头到尾的比较+交换到底有多少轮
    for (let i = 0; i < len; i++) {
        // 内层循环用于完成每一轮遍历过程中的重复比较+交换
        for (let j = 0; j < len - 1; j++) {
            // 若相邻元素前面的数比后面的大
            if (arr[j] > arr[j + 1]) {
                // 交换两者
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    // 返回数组
    return arr;
}
// console.log(bubbleSort([3, 6, 2, 4, 1]));

/**
 * 实现一个选择排序
 */
const selectSort = (arr) => {
    // 缓存数组长度
    const len = arr.length;
    // 定义 minIndex，缓存当前区间最小值的索引，注意是索引
    let minIndex;
    // i 是当前排序区间的起点
    for (let i = 0; i < len - 1; i++) {
        // 初始化 minIndex 为当前区间第一个元素
        minIndex = i;
        // i、j分别定义当前区间的上下界，i是左边界，j是右边界
        for (let j = i; j < len; j++) {
            // 若 j 处的数据项比当前最小值还要小，则更新最小值索引为 j
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        // 如果 minIndex 对应元素不是目前的头部元素，则交换两者
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    return arr;
}
// console.log(quickSort([3, 6, 2, 4, 1]));

/**
 * 实现插入排序
 */
const insertSort = (arr) => {
    for (let i = 1; i < arr.length; i++) {
        let j = i;
        let target = arr[j];
        while (j > 0 && arr[j - 1] > target) {
            arr[j] = arr[j - 1];
            j--;
        }
        arr[j] = target;
    }
    return arr;
}
// console.log(insertSort([3, 6, 2, 4, 1]));

/**
 * 实现快速排序
 */
const quickSort = (arr) => {
    if (arr.length < 2) {
        return arr;
    }
    const cur = arr[arr.length - 1];
    const left = arr.filter((v, i) => v <= cur && i !== arr.length - 1);
    const right = arr.filter((v) => v > cur);
    return [...quickSort(left), cur, ...quickSort(right)];
}

/**
 * 实现并归排序
 */
const merge = (left, right) => {
    let res = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            res.push(left[i]);
            i++;
        } else {
            res.push(right[j]);
            j++;
        }
    }
    if (i < left.length) {
        res.push(...left.slice(i));
    } else {
        res.push(...right.slice(j));
    }
    return res;
}
const mergeSort = (arr) => {
    if (arr.length < 2) {
        return arr;
    }
    const mid = Math.floor(arr.length / 2);

    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}

/**
 * 如何确定一个数在一个有序数组中的位置
 * 思路:二分查找
 */
function search(arr, target, start, end) {
    let targetIndex = -1;
    let mid = Math.floor((start + end) / 2);
    if (arr[mid] === target) {
        targetIndex = mid;
        return targetIndex;
    }
    if (start >= end) {
        return targetIndex;
    }
    if (arr[mid] < target) {
        return search(arr, target, mid + 1, end);
    } else {
        return search(arr, target, start, mid - 1);
    }
}
// const dataArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// const position = search(dataArr, 6, 0, dataArr.length - 1);
// if (position !== -1) {
//   console.log(`目标元素在数组中的位置:${position}`);
// } else {
//   console.log("目标元素不在数组中");
// }

/**
 * 实现lazyman
 * 思路:关键是输出的顺序，以及需要在每一个任务执行完再执行下一步，
 * 类似promise（可以使用promise的方式实现），使用队列也可以。链式调用则要求每个方法都得返回当前对象。
 */
class _LazyMan {
    constructor(name) {
        this.tasks = [];
        const task = () => {
            console.log(`Hi! This is ${name}`);
            this.next();
        };
        this.tasks.push(task);
        setTimeout(() => {
            // 把 this.next() 放到调用栈清空之后执行
            this.next();
        }, 0);
    }
    next() {
        const task = this.tasks.shift(); // 取第一个任务执行
        task && task();
    }
    sleep(time) {
        this._sleepWrapper(time, false);
        return this; // 链式调用
    }
    sleepFirst(time) {
        this._sleepWrapper(time, true);
        return this;
    }
    _sleepWrapper(time, first) {
        const task = () => {
            setTimeout(() => {
                console.log(`Wake up after ${time}`);
                this.next();
            }, time * 1000);
        };
        if (first) {
            this.tasks.unshift(task); // 放到任务队列顶部
        } else {
            this.tasks.push(task); // 放到任务队列尾部
        }
    }
    eat(name) {
        const task = () => {
            console.log(`Eat ${name}`);
            this.next();
        };
        this.tasks.push(task);
        return this;
    }
}
function LazyMan(name) {
    return new _LazyMan(name);
}

/**
 * 实现防抖和节流
 */
// 防抖
function debounce(fn, delay = 300) {
    //默认300毫秒
    let timer;
    return function () {
        const args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, args); // 改变this指向为调用debounce所指的对象
        }, delay);
    };
}

window.addEventListener(
    "scroll",
    debounce(() => {
        console.log(111);
    }, 1000)
);

// 节流
// 设置一个标志
function throttle(fn, delay) {
    let flag = true;
    return () => {
        if (!flag) return;
        flag = false;
        timer = setTimeout(() => {
            fn();
            flag = true;
        }, delay);
    };
}

window.addEventListener(
    "scroll",
    throttle(() => {
        console.log(111);
    }, 1000)
);

/**
 * 版本号排序
 */


/**
 * 实现LRU 算法
 */
//  一个Map对象在迭代时会根据对象中元素的插入顺序来进行
// 新添加的元素会被插入到map的末尾，整个栈倒序查看
class LRUCache {
    constructor(capacity) {
        this.secretKey = new Map();
        this.capacity = capacity;
    }
    get(key) {
        if (this.secretKey.has(key)) {
            let tempValue = this.secretKey.get(key);
            this.secretKey.delete(key);
            this.secretKey.set(key, tempValue);
            return tempValue;
        } else return -1;
    }
    put(key, value) {
        // key存在，仅修改值
        if (this.secretKey.has(key)) {
            this.secretKey.delete(key);
            this.secretKey.set(key, value);
        }
        // key不存在，cache未满
        else if (this.secretKey.size < this.capacity) {
            this.secretKey.set(key, value);
        }
        // 添加新key，删除旧key
        else {
            this.secretKey.set(key, value);
            // 删除map的第一个元素，即为最长未使用的
            this.secretKey.delete(this.secretKey.keys().next().value);
        }
    }
}
// let cache = new LRUCache(2);
// cache.put(1, 1);
// cache.put(2, 2);
// console.log("cache.get(1)", cache.get(1))// 返回  1
// cache.put(3, 3);// 该操作会使得密钥 2 作废
// console.log("cache.get(2)", cache.get(2))// 返回 -1 (未找到)
// cache.put(4, 4);// 该操作会使得密钥 1 作废
// console.log("cache.get(1)", cache.get(1))// 返回 -1 (未找到)
// console.log("cache.get(3)", cache.get(3))// 返回  3
// console.log("cache.get(4)", cache.get(4))// 返回  4

/**
 * 手写 Promise 以及 Promise.all Promise.race 的实现
 */
class Mypromise {
    constructor(fn) {
        // 表示状态
        this.state = "pending";
        // 表示then注册的成功函数
        this.successFun = [];
        // 表示then注册的失败函数
        this.failFun = [];

        let resolve = (val) => {
            // 保持状态改变不可变（resolve和reject只准触发一种）
            if (this.state !== "pending") return;

            // 成功触发时机  改变状态 同时执行在then注册的回调事件
            this.state = "success";
            // 为了保证then事件先注册（主要是考虑在promise里面写同步代码） promise规范 这里为模拟异步
            setTimeout(() => {
                // 执行当前事件里面所有的注册函数
                this.successFun.forEach((item) => item.call(this, val));
            });
        };

        let reject = (err) => {
            if (this.state !== "pending") return;
            // 失败触发时机  改变状态 同时执行在then注册的回调事件
            this.state = "fail";
            // 为了保证then事件先注册（主要是考虑在promise里面写同步代码） promise规范 这里模拟异步
            setTimeout(() => {
                this.failFun.forEach((item) => item.call(this, err));
            });
        };
        // 调用函数
        try {
            fn(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    // 实例方法 then
    then(resolveCallback, rejectCallback) {
        // 判断回调是否是函数
        resolveCallback =
            typeof resolveCallback !== "function" ? (v) => v : resolveCallback;
        rejectCallback =
            typeof rejectCallback !== "function"
                ? (err) => {
                    throw err;
                }
                : rejectCallback;
        // 为了保持链式调用  继续返回promise
        return new Mypromise((resolve, reject) => {
            // 将回调注册到successFun事件集合里面去
            this.successFun.push((val) => {
                try {
                    //    执行回调函数
                    let x = resolveCallback(val);
                    //（最难的一点）
                    // 如果回调函数结果是普通值 那么就resolve出去给下一个then链式调用  如果是一个promise对象（代表又是一个异步） 那么调用x的then方法 将resolve和reject传进去 等到x内部的异步 执行完毕的时候（状态完成）就会自动执行传入的resolve 这样就控制了链式调用的顺序
                    x instanceof Mypromise ? x.then(resolve, reject) : resolve(x);
                } catch (error) {
                    reject(error);
                }
            });

            this.failFun.push((val) => {
                try {
                    //    执行回调函数
                    let x = rejectCallback(val);
                    x instanceof Mypromise ? x.then(resolve, reject) : reject(x);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
    //静态方法
    static all(promiseArr) {
        let result = [];
        //声明一个计数器 每一个promise返回就加一
        let count = 0;
        return new Mypromise((resolve, reject) => {
            for (let i = 0; i < promiseArr.length; i++) {
                //这里用 Promise.resolve包装一下 防止不是Promise类型传进来
                Promise.resolve(promiseArr[i]).then(
                    (res) => {
                        //这里不能直接push数组  因为要控制顺序一一对应(感谢评论区指正)
                        result[i] = res;
                        count++;
                        //只有全部的promise执行成功之后才resolve出去
                        if (count === promiseArr.length) {
                            resolve(result);
                        }
                    },
                    (err) => {
                        reject(err);
                    }
                );
            }
        });
    }
    //静态方法
    static race(promiseArr) {
        return new Mypromise((resolve, reject) => {
            for (let i = 0; i < promiseArr.length; i++) {
                Promise.resolve(promiseArr[i]).then(
                    (res) => {
                        //promise数组只要有任何一个promise 状态变更  就可以返回
                        resolve(res);
                    },
                    (err) => {
                        reject(err);
                    }
                );
            }
        });
    }
}

// 使用
// let promise1 = new Mypromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(123);
//     }, 2000);
// });
// let promise2 = new Mypromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(1234);
//     }, 1000);
// });

// Mypromise.all([promise1, promise2]).then(res => {
//     console.log(res);
// })

// Mypromise.race([promise1, promise2]).then(res => {
//     console.log(res);
// });

// promise1
//     .then(
//         res => {
//             console.log(res); //过两秒输出123
//             return new Mypromise((resolve, reject) => {
//                 setTimeout(() => {
//                     resolve("success");
//                 }, 1000);
//             });
//         },
//         err => {
//             console.log(err);
//         }
//     )
//     .then(
//         res => {
//             console.log(res); //再过一秒输出success
//         },
//         err => {
//             console.log(err);
//         }
//     );

/**
 * 取消promise
 */
function wrap(pro) {
    let obj = {};
    // 构造一个新的promise用来竞争
    let p1 = new Promise((resolve, reject) => {
        obj.resolve = resolve;
        obj.reject = reject;
    });

    obj.promise = Promise.race([p1, pro]);
    return obj;
}

let testPro = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(123);
    }, 1000);
});

let wrapPro = wrap(testPro);
wrapPro.promise.then((res) => {
    console.log(res);
});
wrapPro.resolve("被拦截了");

/**
 * 给定不同面额的硬币 coins 和一个总金额 amount。
 * 编写一个函数来计算可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，返回 -1
 * 示例1：
 * 输入: coins = [1, 2, 5], amount = 11
 * 输出: 3
 * 解释: 11 = 5 + 5 + 1
 * 示例2：输入: coins = [2], amount = 3
 * 输出: -1
 */
const coinChange = function (coins, amount) {
    // 用于保存每个目标总额对应的最小硬币个数
    const f = [];
    // 提前定义已知情况
    f[0] = 0;
    // 遍历 [1, amount] 这个区间的硬币总额
    for (let i = 1; i <= amount; i++) {
        // 求的是最小值，因此我们预设为无穷大，确保它一定会被更小的数更新
        f[i] = Infinity;
        // 循环遍历每个可用硬币的面额
        for (let j = 0; j < coins.length; j++) {
            // 若硬币面额小于目标总额，则问题成立
            if (i - coins[j] >= 0) {
                // 状态转移方程
                f[i] = Math.min(f[i], f[i - coins[j]] + 1);
            }
        }
    }
    // 若目标总额对应的解为无穷大，则意味着没有一个符合条件的硬币总数来更新它，本题无解，返回-1
    if (f[amount] === Infinity) {
        return -1;
    }
    // 若有解，直接返回解的内容
    return f[amount];
};

/**
 * 请实现 DOM2JSON 一个函数，可以把一个 DOM 节点输出 JSON 的格式
 * 题目描述 : 
 * <div><span><a></a></span><span><a></a><a></a></span></div>
 * 把上诉dom结构转成下面的JSON格式
 * {tag: 'DIV',
    children: [
        {
        tag: 'SPAN',
        children: [
            { tag: 'A', children: [] } ]
        },{
        tag: 'SPAN',
        children: [
            { tag: 'A', children: [] },
            { tag: 'A', children: [] } ]
        } ] }
 * 思路解析: 这个问题就类似 Vue 的模板编译原理 
    我们可以利用正则匹配html字符串 遇到开始标签 结束标签和文本 
    解析完毕之后生成对应的 ast 并建立相应的父子关联 
    不断的 advance 截取剩余的字符串 直到 html 全部解析完毕 
 */
const dom2Json = (domtree) => {
    let obj = {};
    obj.name = domtree.tagName;
    obj.children = [];
    domtree.childNodes.forEach((child) => obj.children.push(dom2Json(child)));
    return obj;
}

/**
 * 类数组拥有 length 属性 可以使用下标来访问元素 但是不能使用数组的方法 如何把类数组转化为数组?
 */
const changarr = () => {
    const arrayLike = document.querySelectorAll('div')
    // 1.扩展运算符
    let test = [...arrayLike];
    // 2.Array.from
    let arr = Array.from(arrayLike)
    // 3.Array.prototype.slice
    Array.prototype.slice.call(arrayLike)
    // 4.Array.apply
    Array.apply(null, arrayLike)
    // 5.Array.prototype.concat
    Array.prototype.concat.apply([], arrayLike)
}

/**
 * Object.is 实现
 * Object.is不会转换被比较的两个值的类型，这点和===更为相似，他们之间也存在一些区别。
 * 1. NaN在===中是不相等的，而在Object.is中是相等的
 * 2. +0和-0在===中是相等的，而在Object.is中是不相等的
 */
const objectis = (x, y) => {
    if (x === y) {
        // 当前情况下，只有一种情况是特殊的，即 +0 -0
        // 如果 x !== 0，则返回true
        // 如果 x === 0，则需要判断+0和-0，则可以直接使用 1/+0 === Infinity 和 1/-0 === -Infinity来进行判断
        return x !== 0 || 1 / x === 1 / y;
    }

    // x !== y 的情况下，只需要判断是否为NaN，如果x!==x，则说明x是NaN，同理y也一样
    // x和y同时为NaN时，返回true
    return x !== x && y !== y;
}

/**
 * 利用 XMLHttpRequest 手写 AJAX 实现
 */
const ajax = (url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status === 200 || xhr.status === 304) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(xhr.responseText));
            }
        };
        xhr.send();
    });
}

/**
 * 渲染百万条结构简单的大数据时 怎么使用分片思想优化渲染
 */
let ul = document.getElementById("container");
// 插入十万条数据
let total = 100000;
// 一次插入 20 条
let once = 20;
//总页数
let page = total / once;
//每条记录的索引
let index = 0;
const loop = (curTotal, curIndex) => {
    if (curTotal <= 0) {
        return false;
    }
    //每页多少条
    let pageCount = Math.min(curTotal, once);
    window.requestAnimationFrame(function () {
        for (let i = 0; i < pageCount; i++) {
            let li = document.createElement("li");
            li.innerText = curIndex + i + " : " + ~~(Math.random() * total);
            ul.appendChild(li);
        }
        loop(curTotal - pageCount, curIndex + pageCount);
    });
}

/**
 * JSON 格式的虚拟 Dom 怎么转换成真实 Dom
 * {    tag: 'DIV',
 *      attrs: {
            id: 'app'
        },
        children: [
            {
                tag: 'SPAN',
                children: [ { tag: 'A', children: [] } ]
            },
            {
                tag: 'SPAN',
                children: [ { tag: 'A', children: [] }, { tag: 'A', children: [] } ]
            }
        ]
    }
 *  把上诉虚拟Dom转化成下方真实Dom
    < div id = "app" >
        <span><a></a></span>
        <span><a></a><a></a></span>
    </ >
 */
// 真正的渲染函数
const _render = (vnode) => {
    // 如果是数字类型转化为字符串
    if (typeof vnode === "number") {
        vnode = String(vnode);
    }
    // 字符串类型直接就是文本节点
    if (typeof vnode === "string") {
        return document.createTextNode(vnode);
    }
    // 普通DOM
    const dom = document.createElement(vnode.tag);
    if (vnode.attrs) {
        // 遍历属性
        Object.keys(vnode.attrs).forEach((key) => {
            const value = vnode.attrs[key];
            dom.setAttribute(key, value);
        });
    }
    // 子数组进行递归操作
    vnode.children.forEach((child) => dom.appendChild(_render(child)));
    return dom;
}

/**
 * 实现模板字符串解析功能
 * let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
 * let data = { name: '姓名' , age: 18 }
 * render(template, data); // 我是姓名，年龄18，性别undefined
 */
const render = (template, data) => {
    let computed = template.replace(/\{\{(\w+)\}\}/g, function (match, key) {
        return data[key];
    });
    return computed;
}

/**
 * 实现一个对象的 flatten 方法
 * const obj = {
 *  a:{
 *    b: 1,c: 2,d: {e: 5}
 *  },
 *  b: [1, 3, {a: 2, b: 3}],
 *  c: 3
 * }
 * flatten(obj) 结果返回如下{
 *  'a.b': 1,
 *  'a.c': 2,
 *  'a.d.e': 5,
 *  'b[0]': 1,
 *  'b[1]': 3,
 *  'b[2].a': 2,
 *  'b[2].b': 3,
 *   c: 3
 * }
 */
const _isObject = (val) => {
    return typeof val === "object" && val !== null;
}

const flatten = (obj) => {
    if (!_isObject(obj)) {
        return;
    }
    let res = {};
    const dfs = (cur, prefix) => {
        if (_isObject(cur)) {
            if (Array.isArray(cur)) {
                cur.forEach((item, index) => {
                    dfs(item, `${prefix}[${index}]`);
                });
            } else {
                for (let k in cur) {
                    dfs(cur[k], `${prefix}${prefix ? "." : ""}${k}`);
                }
            }
        } else {
            res[prefix] = cur;
        }
    };
    dfs(obj, "");
    return res;
}
flatten();

/**
 * 列表转成树形结构
 * [
 * {id: 1,text: '节点1',parentId: 0 //这里用0表示为顶级节点},
 * {id: 2,text: '节点1_1',parentId: 1 //通过这个字段来确定子父级}
 * ...
 * ]
 * 转成
 * [
 *  { id: 1,text: '节点1', parentId: 0, 
 *      children: [
 *          {id:2,text: '节点1_1',parentId:1}
 *      ]
 *  }
 * ]
 */
const listToTree = (data) => {
    let temp = {};
    let treeData = [];
    for (let i = 0; i < data.length; i++) {
        temp[data[i].id] = data[i];
    }
    for (let i in temp) {
        if (+temp[i].parentId != 0) {
            if (!temp[temp[i].parentId].children) {
                temp[temp[i].parentId].children = [];
            }
            temp[temp[i].parentId].children.push(temp[i]);
        } else {
            treeData.push(temp[i]);
        }
    }
    return treeData;
}

/**
 * 树形结构转成列表
 * [
 *  { id: 1,text: '节点1', parentId: 0, 
 *      children: [
 *          {id:2,text: '节点1_1',parentId:1}
 *      ]
 *  }
 * ]
 * 转成
 * [
 *   {id: 1,text: '节点1',parentId: 0 //这里用0表示为顶级节点},
 *   {id: 2,text: '节点1_1',parentId: 1 //通过这个字段来确定子父级},
 *   ...
 * ]
 */
const treetoList = (data) => {
    let res = [];
    const dfs = (tree) => {
        tree.forEach((item) => {
            if (item.children) {
                dfs(item.children);
                delete item.children;
            }
            res.push(item);
        });
    };
    dfs(data);
    return res;
}

/**
 * 实现一个add方法完成两个大数相加
 * let a = "9007199254740991";
 * let b = "1234567899999999999";
 * function add(a ,b){ //... }
 */
const add = (a, b) => {
    //取两个数字的最大长度
    let maxLength = Math.max(a.length, b.length);
    //用0去补齐长度
    a = a.padStart(maxLength, 0);//"0009007199254740991"
    b = b.padStart(maxLength, 0);//"1234567899999999999"
    //定义加法过程中需要用到的变量
    let t = 0;
    let f = 0;   //"进位"
    let sum = "";
    for (let i = maxLength - 1; i >= 0; i--) {
        t = parseInt(a[i]) + parseInt(b[i]) + f;
        f = Math.floor(t / 10);
        sum = t % 10 + sum;
    }
    if (f !== 0) {
        sum = '' + f + sum;
    }
    return sum;
}

