module.exports = [
  {
    url: '/api/auth/token/',
    type: 'POST',
    response: req => {
      return {
        r: 0,
        e: '',
        data: {
          global_public_key: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCoM3uc0N3shJjQNlUhmfWZJIwsCi9RQj7nsIiMEG9ZjrrcdAKgp5RI57N+Qfk5/SGLLOGuXOcXbp1tJ0/ayQVhpywZfoVwiyGudBNfz1BGiK+3hX3xNorseNgNak4ZOQ3NQY/+jHnsJwJz9O9oJkgXOoq0dHIoz3X2bmJpOACnxwIDAQAB',
          public_key: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDcFGYvfskG+jEmJTrcybPzNLeouw7dRcc5N0Nic3F4hWplREcQFIVX3vdS7VONRR++mS8HMQ35xmIMLOQFJqZfVM+BmAB22ObLfrR89ufFfvWxXZPvlnbBivKc6Df2/WjA8f1QvtaJPq1JKx957nvkUnWW2Ulj9THOjdw/cm6yQIDAQAB',
          salt: '1675859220'
        }
      }
    }
  },
  {
    url: '/api/auth/login/',
    type: 'POST',
    response: req => {
      return {
        r: 0,
        e: '',
        data: {
          change_pwd: {
            policy: 'low',
            pwd_length: 1,
            change_flog: 0,
            roles: 'aa'
          }
        }
      }
    }
  },
  {
    url: '/api/menu/fetch/',
    type: 'POST',
    response: req => {
      return {
        r: 0,
        e: '',
        data: {
          buttons: ['DrMgr.ResourceMgr.DataCenter.new.display', 'DrMgr.ResourceMgr.DataCenter.new.disabled'],
          routes: [
            'Home', 'DrMgr', 'DrMgr.ResourceMgr', 'DrMgr.ResourceMgr.DataCenter', 'DrMgr.ResourceMgr.Drstructure',
            'DrMgr.DemandMgr', 'DrMgr.DemandMgr.DrLevel', 'DrMgr.DemandMgr.DrDemand','DrMgr.DrMgr','DrMgr.DrMgr.DrStrategy',
            'DrMgr.DrMgr.DrExecution', 'DrMgr.DrMgr.DrPlan', 'DrMgr.DrMgr.TaskMgr', 'DrMgr.PlanMgr','DrMgr.PlanMgr.PlanManage',
            'DrMgr.PlanMgr.ScriptStore', 'DrMgr.ExerciseMgr', 'DrMgr.ExerciseMgr.ExerciseProject', 'DrMgr.ExerciseMgr.ExercisePlan',
            'DrMgr.ExerciseMgr.ExerciseTasks', 'DrMgr.ExerciseMgr.ExerciseEvaluation', 'DrMgr.ExerciseMgr.ExerciseImprovement',
            'DrMgr.ProcessMgr', 'DrMgr.ProcessMgr.ApprovalControl', 'DrMgr.ProcessMgr.EMGProcedures', 'DrMgr.OthersMgr',
            'DrMgr.OthersMgr.BaseData', 'DrMgr.OthersMgr.KnowledgeBase', 'DrMgr.OthersMgr.Structure', 'DrMgr.OthersMgr.Competencies',
            'ExerciseCenter', 'EMGCenter', 'StatsReport', 'Log', 'Download'
          ]
        }
      }
    }
  },
  {
    url: '/api/account/forget_password/',
    type: 'POST',
    response: req => {
      return {
        r: 0,
        e: '',
        data: {}
      }
    }
  },
  {
    url: '/api/account/change_password/',
    type: 'POST',
    response: req => {
      return {
        r: 0,
        e: '',
        data: {}
      }
    }
  },
  {
    url: '/api/account/get_pwd_tactic/',
    type: 'POST',
    response: req => {
      return {
        r: 0,
        e: '',
        data: {
          policy: 'high',
          pwd_length: 8
        }
      }
    }
  },
  {
    url: '/api/account/logout/',
    type: 'POST',
    response: req => {
      return {
        r: 0,
        e: '',
      }
    }
  }
]
