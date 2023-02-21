// 实现instanceof
/**
 * 如果 target 为基本数据类型直接返回 false
 * 判断 Fn.prototype 是否在 target 的隐式原型链上
 * 基本类型包括: string null undefined symbol boolean number bigint
 * 引用类型: object
 * object中包含: Array(数组对象) Regexp(正则对象) Date(日期对象) 
 */
const _instanceof = (target,Fn) => {
    // 排除object和function,其余均为基本类型
    if (typeof target !=="object" && typeof target != "function") {
        console.log('基本类型');
        return false
    }
    let proto = target.__proto__
    // 不停向下遍历prototype,直到为null时,代表原型遍历结束 
    while(true){
        if (proto === null) {
            return false
        }
        if (proto == Fn.prototype) {
            return true
        }
        proto = proto.__proto__
    }
}
function a(params) {   
}
let test = new a()
console.log(_instanceof({ayd:1},a))
console.log(_instanceof(test,a));