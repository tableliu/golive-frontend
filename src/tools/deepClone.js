/**
 * 深度克隆---Vue.deepClone()
 * @param  {Object} 需要克隆的对象(多维对象 | 多维对象数组内嵌对象 等复杂的对象,单维对象或对象数组用Object.assign({}, Object)深拷贝)
 * @return {Object} 拷贝的数组
 */
export default function deepClone(obj) {
    // 是否为对象或数组
    const isObject = function(o) {
        // return (typeof o === 'object' || typeof o === 'function') && o !== null
        return (typeof o === 'object') && o !== null
    }
    if (!isObject(obj)) {
        throw new Error(obj.name + 'is not a object！')
    }
    // 如果是数组返回数组展开的深拷贝
    const isArray = Array.isArray(obj)
    let cloneObj = isArray ? [...obj] : { ...obj }
    //Reflect.ownKeys()返回对象所有可枚举不可枚举的属性(Object.keys()只返回可枚举属性)
    // 递归将所有属性及其值赋予新对象
    Reflect.ownKeys(cloneObj).forEach(key => {
        cloneObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
    })
    return cloneObj
}
