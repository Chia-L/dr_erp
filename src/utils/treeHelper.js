import * as jsonpath from 'jsonpath'
import {cloneDeep, isArray, remove} from 'lodash'

/**
 * 操作 jsonTree
 * I 节点唯一标识符字段
 * C 节点包含孩子的字段
 * mutate 是否就地修改
 */
export class JTree {
  constructor(tree, I, C, mutate) {
    if(C === void 0) C = 'children'
    if (mutate === void 0) mutate = false
    this.tree = mutate ? tree : cloneDeep(tree)
    this.I = I
    this.C = C
  }
  // 获取父路径
  jpParent(exp) {
    try {
      return jsonpath.parent(this.tree, exp)
    }
    catch (error) {
      return null
    }
  }
  // 删除指定节点们
  removeNodes(ids) {
    var _a
    for (let i = 0, ids_1 = ids; i < ids_1.length; i++) {
      let id = ids_1[i]
      let arr = this.jpParent("$..*[?(@." + this.I + "===\"" + id + "\")]")
      if (arr && isArray(arr)) remove(arr,(_a = {}, _a[this.I] = id, _a))
    }
  }
  // 删除空的非叶子
  removeEmptyParent() {
    const emptyNodes = () => {
      const nodes = jsonpath.query(this.tree, "$..*[?(@." + this.I + " && @." + this.C + " && @." + this.C + ".length===0)]")
      return nodes.map((node) => node[this.I])
    }
  }
  // 删除“断言成功”的节点
  trim(predicate, rmEmptyParent) {
    if (rmEmptyParent === void 0) rmEmptyParent = false
    let rmNodes = []
    this.nodesWalker(node => {
      if (predicate(node)) rmNodes.push(node)
    })
    let _rmNodes = rmNodes.map( (node) => node[this.I] )
    this.removeNodes(_rmNodes)
    if(rmEmptyParent) this.removeEmptyParent()
  }
  // 遍历所有节点
  nodesWalker(handle) {
    let nodes = jsonpath.query(this.tree, "$..*[?(@." + this.I + ")]")
    for (let i = 0, nodes_1 = nodes; i < nodes_1.length; i++) {
      let node = nodes_1[i]
      handle(node)
    }
  }
  // 获取指定节点
  getNodeById(id) {
    let _a
    let elem = jsonpath.query(this.tree, "$..*[?(@." + this.I + "===\"" + id + "\")]")
    return (_a = elem[0]) !== null && _a !== void 0 ? _a : null
  }
  // 计算路径节点
  nodePath(id) {
    const paths2Elem = jsonpath.paths(this.tree, "$..*[?(@." + this.I + "===\"" + id + "\")]")
    if (paths2Elem.length !== 1) return []
    const path2Elem = paths2Elem[0]
    let nodes = []
    for (let i = 0; i < path2Elem.length; i++) {
      const pathExp = path2Elem.slice(0, i + 1).join('.')
      let val = jsonpath.query(this.tree, pathExp)[0]
      if (!val) continue
      if((val[this.I] && val[this.C]) || (i === path2Elem.length - 1)) nodes.push(val)
    }
    return nodes
  }
}
