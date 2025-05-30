import { defineStore } from 'pinia';
import { ref, computed } from 'vue'
import { isHomeFn, testNw } from '../api/api';


export const userStore = defineStore('user', {
  state: () => ({
    username: '正在获取',
    isLogin: false,
    isPc: false,
    isHome: false,
  }),
  actions: {
    isPcFn() {
      this.isPc = !(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))
    },
    isHomeFn: async function () {
      if ((await isHomeFn())) {
        this.isHome = true
      }
    }

  },
  getters: {

  },
});
