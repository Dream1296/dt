import { createRouter, createWebHashHistory, createWebHistory, type RouteRecordRaw } from 'vue-router';
import dt from '../views/dt.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: dt
  },
  {
    path:'/login',
    component: () => import('../views/login.vue'),
  },
  {
    path:'/book/:id',
    component : () => import('../views/book/book.vue'),
  },
    {
    path:'/bookshelf',
    component : () => import('../views/book/root.vue'),
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
    path:'/dtShow/:dtid',
    // component:dtAll,
    component : () => import("@/views/dtShow.vue")
  },{
    path:'/Lvi',
    // component:longVideo,
    component : () => import('@/views/longVideo.vue')
  },{
    path:'/longText/:type/:id',
    // component:longVideo,
    component : () => import('@/views/longText.vue')
  },{
    path:'/chat/:id',
    component : () => import('@/views/chat.vue')
  },{
    path:'/list:pathMatch(.*)*',
    component :() => import('@/views/list.vue')
  },{
    path:'/zhuce',
    component: () => import('@/views/zhuce.vue')
  }

];

const router = createRouter({
  // history: createWebHashHistory(),  // 改为 hash 模式
  history: createWebHistory(),
  routes
});

export default router;

