/**
 * 手写实现map方法
 * map方法: 接受两个参数,
 * 迭代器函数,函数中的this指向
 * map方法不能使用箭头函数,获取不到this
 * 
 */
Array.prototype._map = function (fn,thisto) {
    // 类型监测,第一个参数是否为函数
    if (fn.instanceof === 'function') {
        return
    }
    // 存放结构的数组
    const result = [];
    // 建立一个指针指向this
    let that = this;
    for (let i = 0; i < that.length; i++) {
        result[i] = fn.call(thisto,that[i],i,that)
    }
    return result;

}