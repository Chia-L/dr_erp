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

// 灾备管理
const DrMgr = [
  {
    path: '/dr/drmgr/drstrategy',
    name: 'DrMgr.DrMgr.DrStrategy',
    component: () => import('@/views/DrMgr/DrStrategy.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '灾备策略',
      parentId: 'DrMgr'
    }
  },
  {
    path: '/dr/drmgr/drexecution',
    name: 'DrMgr.DrMgr.DrExecution',
    component: () => import('@/views/DrMgr/DrExecution.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '灾备实施',
      parentId: 'DrMgr'
    }
  },
  {
    path: '/dr/drmgr/drplan',
    name: 'DrMgr.DrMgr.DrPlan',
    component: () => import('@/views/DrMgr/DrPlan.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '灾备计划',
      parentId: 'DrMgr'
    }
  },
  {
    path: '/dr/drmgr/taskmgr',
    name: 'DrMgr.DrMgr.TaskMgr',
    component: () => import('@/views/DrMgr/TaskMgr.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '任务管理',
      parentId: 'DrMgr'
    }
  },
]

// 预案管理
const planMgr = [
  {
    path: '/dr/drmgr/planManage',
    name: 'DrMgr.PlanMgr.PlanManage',
    component: () => import('@/views/PlanManage/PlanManage.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '预案管理',
      parentId: 'PlanMgr'
    }
  },
  {
    path: '/dr/drmgr/scriptstore',
    name: 'DrMgr.PlanMgr.ScriptStore',
    component: () => import('@/views/DrMgr/ScriptStore.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '脚本仓库',
      parentId: 'PlanMgr'
    }
  }
]

// 演练管理
const ExerciseMgr = [
  {
    path: '/dr/drmgr/exerciseproject',
    name: 'DrMgr.ExerciseMgr.ExerciseProject',
    component: () => import('@/views/DrMgr/ExerciseProject.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '演练项目',
      parentId: 'ExerciseMgr'
    }
  },
  {
    path: '/dr/drmgr/exerciseplan',
    name: 'DrMgr.ExerciseMgr.ExercisePlan',
    component: () => import('@/views/DrMgr/ExercisePlan.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '演练方案',
      parentId: 'ExerciseMgr'
    }
  },
  {
    path: '/dr/drmgr/exercisetasks',
    name: 'DrMgr.ExerciseMgr.ExerciseTasks',
    component: () => import('@/views/DrMgr/ExerciseTasks.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '演练任务',
      parentId: 'ExerciseMgr'
    }
  },
  {
    path: '/dr/drmgr/exerciseevaluation',
    name: 'DrMgr.ExerciseMgr.ExerciseEvaluation',
    component: () => import('@/views/DrMgr/ExerciseEvaluation.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '演练评估',
      parentId: 'ExerciseMgr'
    }
  },
  {
    path: '/dr/drmgr/exerciseimprovement',
    name: 'DrMgr.ExerciseMgr.ExerciseImprovement',
    component: () => import('@/views/DrMgr/ExerciseImprovement.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '演练改进',
      parentId: 'ExerciseMgr'
    }
  }
]
// 流程管理
const ProcessMgr = [
  {
    path: '/dr/drmgr/approvalcontrol',
    name: 'DrMgr.ProcessMgr.ApprovalControl',
    component: () => import('@/views/DrMgr/ApprovalControl.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '审批控制',
      parentId: 'ProcessMgr'
    }
  },
  {
    path: '/dr/drmgr/emgprocedures',
    name: 'DrMgr.ProcessMgr.EMGProcedures',
    component: () => import('@/views/DrMgr/EMGProcedures.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '应急流程',
      parentId: 'ProcessMgr'
    }
  },
]
// 其他管理
const OthersMgr = [
  {
    path: '/dr/drmgr/basedata',
    name: 'DrMgr.OthersMgr.BaseData',
    component: () => import('@/views/DrMgr/BaseData.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '基础数据',
      parentId: 'OthersMgr'
    }
  },
  {
    path: '/dr/drmgr/knowledgebase',
    name: 'DrMgr.OthersMgr.KnowledgeBase',
    component: () => import('@/views/DrMgr/KnowledgeBase.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '知识库',
      parentId: 'OthersMgr'
    }
  },
  {
    path: '/dr/drmgr/structure',
    name: 'DrMgr.OthersMgr.Structure',
    component: () => import('@/views/DrMgr/Structure.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '组织架构',
      parentId: 'OthersMgr'
    }
  },
  {
    path: '/dr/drmgr/competencies',
    name: 'DrMgr.OthersMgr.Competencies',
    component: () => import('@/views/DrMgr/Competencies.vue'),
    meta: {
      icon: 'i-jiqun',
      title: '能力评估',
      parentId: 'OthersMgr'
    }
  },
]

export default {
  path: '/dr/drmgr',
  name: 'DrMgr',
  component: () => import('@/views/DrMgr/index.vue'),
  meta: {
    title: '容灾管理',
    sidebar: [
      {icon: '', name: 'DrMgr.ResourceMgr', id: 'ResourceMgr', meta: {title: '资源管理'}},
      {icon: '', name: 'DrMgr.DemandMgr', id: 'DemandMgr', meta: {title: '需求管理'}},
      {icon: '', name: 'DrMgr.DrMgr', id: 'DrMgr', meta: {title: '灾备管理'}},
      {icon: '', name: 'DrMgr.PlanMgr', id: 'PlanMgr', meta: {title: '预案管理'}},
      {icon: '', name: 'DrMgr.ExerciseMgr', id: 'ExerciseMgr', meta: {title: '演练管理'}},
      {icon: '', name: 'DrMgr.ProcessMgr', id: 'ProcessMgr', meta: {title: '流程管理'}},
      {icon: '', name: 'DrMgr.OthersMgr', id: 'OthersMgr', meta: {title: '其他管理'}},
    ]
  },
  children: [
    ...resourceMgr,
    ...demandMgr,
    ...DrMgr,
    ...planMgr,
    ...ExerciseMgr,
    ...ProcessMgr,
    ...OthersMgr
  ]
}
