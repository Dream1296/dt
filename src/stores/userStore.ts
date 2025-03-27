import { defineStore } from 'pinia';
import { ref, computed } from 'vue'


export const userStore = defineStore('user', {
  state: () => ({
    username:'正在获取',
    isLogin:false,
    isPc : false,
  }),
  actions: {
    isPcFn() {
      this.isPc = !(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))
    }
  },
  getters: {
    
  },
});
