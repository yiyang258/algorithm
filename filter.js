/**
 * 手写实现filter过滤器
 * filter 中的 exc 接受三个参数，
 * 与map一致，主要实现的是数组的过滤功能，
 * 会根据 exc 函数的返回值来判断是否“留下”该值。
 * filter 返回的是一个新的数组，地址不一致。
 */
Array.prototype._filter = function(exc){
    const result = [];
    this.forEach((item,index,arr)=>{
        if (exc(item,index,arr)) {
            result.push(item)
        }
    })
    return result
}