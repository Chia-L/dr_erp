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
      drMgr
    ]
  }
]
