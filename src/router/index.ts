import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import dt from '../views/dt.vue';
import imgs from '../views/imgs.vue';
import test from '../views/text.vue';
import dtOne from '../views/dtOne.vue';
import videoPlay from '../views/videoPlay.vue';
import config from '../views/config.vue';
import updt from '../views/updt.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: dt
  },
  {
    path: '/imgs',
    component: imgs,
  },
  {
    path:'/dtoVo',
    component:dtOne,

  },
  {
    path: '/test',
    component: test,
  },
  {
    path:'/videoPlay',
    component:videoPlay,
  },
  {
    path:'/config',
    component:config,
  },
  {
    path:'/updt',
    component:updt,
  }
];

const router = createRouter({
  history: createWebHashHistory(),  // 改为 hash 模式
  routes
});

export default router;

