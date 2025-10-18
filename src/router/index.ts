import { createRouter, createWebHashHistory, createWebHistory, type RouteRecordRaw } from 'vue-router';
import dt from '../views/dt.vue';
// import imgs from '../views/imgs.vue';
// import test from '../views/text.vue';
// import dtOne from '../views/dtOne.vue';
// import videoPlay from '../views/videoPlay.vue';
// import config from '../views/config.vue';
// import updt from '../views/updt.vue';
// import dtAll from '@/views/dtAll.vue';
// import longText from '@/views/longText.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: dt
  },
  {
    path:'/dl',
    component: () => import('../views/login.vue'),
  },
  {
    path: '/imgs/:dtid/:index',
    // component: imgs,
    component: () => import('../views/imgs.vue'), // 懒加载
  },
  {
    path:'/dtoVo',
    // component:dtOne,
    component : () => import('../views/dtOne.vue')
  },
  {
    path: '/test',
    // component: test,
    component : () => import('../views/test.vue')
  },
  {
    path:'/videoPlay',
    // component:videoPlay,
    component : () => import('../views/videoPlay.vue')
  },
  {
    path:'/config',
    // component:config,
    component : () => import('../views/config.vue')
  },
  {
    path:'/updt',
    // component:updt,
    component : () => import('../views/updt.vue')
  },
  {
    path:'/dts/:dtid',
    // component:dtAll,
    component : () => import("@/views/dtAll.vue")
  },{
    path:'/Lvi',
    // component:longVideo,
    component : () => import('@/views/longVideo.vue')
  },{
    path:'/longText/:type/:id',
    // component:longVideo,
    component : () => import('@/views/longText.vue')
  },{
    path:'/date',
    component : () => import('@/views/calendarV.vue')
  },{
    path:'/chat/:id',
    component : () => import('@/views/chat.vue')
  },{
    path:'/list:pathMatch(.*)*',
    component :() => import('@/views/list/list.vue')
  }

];

const router = createRouter({
  // history: createWebHashHistory(),  // 改为 hash 模式
  history: createWebHistory(),
  routes
});

export default router;

