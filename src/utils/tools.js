/**
 * 是否是数字
 * @param val 数据
 * @returns {boolean}
 */
export function isNumber(val) {
  return !isNaN(Number(val))
}

/**
 * 是否拥有key
 * @param foo 对象
 * @param propertyName 属性名
 * @returns {boolean}
 */
export function hasOwnProperty(foo, propertyName) {
  return Object.prototype.hasOwnProperty.call(foo, propertyName)
}

/**
 * 返回数据类型
 * @param data 待检查的数据
 * @returns {string} string | number | boolean | object | function | null | undefined
 */
export function returnType(data) {
  return Object.prototype.toString.call(data).replace(/[\[\]]/g,'').slice(7).toLowerCase()
}
