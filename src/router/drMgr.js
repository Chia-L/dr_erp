/* 容灾管理 路由表 */

// 资源管理
const resourceMgr = [
  {
    path: '/dr/drmgr/datacenter',
    name: 'DrMgr.ResourceMgr.DataCenter',
    component: () => import('@/views/DrMgr/DataCenter.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '数据中心',
      parentId: 'ResourceMgr'
    }
  },
  {
    path: '/dr/drmgr/drstructure',
    name: 'DrMgr.ResourceMgr.Drstructure',
    component: () => import('@/views/DrMgr/Drstructure.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '容灾架构',
      parentId: 'ResourceMgr'
    }
  }
]

// 需求管理
const demandMgr = [
  {
    path: '/dr/drmgr/drlevel',
    name: 'DrMgr.DemandMgr.DrLevel',
    component: () => import('@/views/DrMgr/DrLevel.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '灾备等级',
      parentId: 'DemandMgr'
    }
  },
  {
    path: '/dr/drmgr/drdemand',
    name: 'DrMgr.DemandMgr.DrDemand',
    component: () => import('@/views/DrMgr/DrDemand.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '灾备需求',
      parentId: 'DemandMgr'
    }
  }
]


export default {
  path: '/dr/drmgr',
  name: 'DrMgr',
  component: () => import('@/views/DrMgr/index.vue'),
  meta: {
    title: '容灾管理',
    sidebar: [
      {icon: '', name: 'DrMgr.ResourceMgr', id: 'ResourceMgr', meta: {title: '资源管理'}},
      {icon: '', name: 'DrMgr.DemandMgr', id: 'DemandMgr', meta: {title: '需求管理'}}
    ]
  },
  children: [
    ...resourceMgr,
    ...demandMgr
  ]
}
