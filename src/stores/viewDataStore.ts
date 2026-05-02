import { defineStore } from 'pinia';
import { ref, computed } from 'vue'


export const viewDataStore = defineStore('viewData', {
  state: () => ({
    loa: 0,
    elfX: 0,
    elfY: 0,
    showV: false,
  }),
  actions: {

  },
  getters: {

  },
  // persist: {
  //   enabled: true,
  //   strategies: [
  //     {
  //       key: 'user-store',
  //       storage: localStorage, // 也可以是 sessionStorage
  //       paths: ['isShowDy'], // 指定要持久化的字段
  //     },
  //   ],
  // }
});
