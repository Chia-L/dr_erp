/* 动态路由表 */
import drMgr from './drMgr'

export default [
  {
    path: "/dr",
    name: "Dr",
    component: () => import('comps/Base.vue'),
    redirect: "/dr/home",
    children: [
      {
        path: "/dr/home",
        name: "Home",
        component: () => import('@/views/Home.vue'),
        meta: {
          title: "首页"
        }
      },
      drMgr,
      {
        path: "/dr/exercisecenter",
        name: "ExerciseCenter",
        component: () => import('@/views/ExerciseCenter.vue'),
        meta: {
          title: "演练中心"
        }
      },
      {
        path: "/dr/emgcenter",
        name: "EMGCenter",
        component: () => import('@/views/EMGCenter.vue'),
        meta: {
          title: "应急中心"
        }
      },
      {
        path: "/dr/statsreport",
        name: "StatsReport",
        component: () => import('@/views/StatsReport.vue'),
        meta: {
          title: "统计报告"
        }
      },
      {
        path: "/dr/log",
        name: "Log",
        component: () => import('@/views/Home.vue'),
        meta: {
          title: "日志"
        }
      },
      {
        path: "/dr/download",
        name: "Download",
        component: () => import('@/views/Home.vue'),
        meta: {
          title: "下载"
        }
      },
    ]
  }
]
