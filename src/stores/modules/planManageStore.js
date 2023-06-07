import { defineStore } from 'pinia'

export const usePlanManageStore = defineStore({
  id: 'planManage',
  state: () => {
    return {
      currentNode: {},
      currentPath: []
    }
  },
  actions: {
    setCurrentNode(data) {
      this.currentNode = data;
    },
    setCurrentPath(data) {
      this.currentPath = data
    }
  }
})
