import { defineStore } from 'pinia';
import { ref, computed } from 'vue'


export const viewDataStore = defineStore('viewData', {
  state: () => ({
    loa:0,
    isShowDy:false,
    elfX:0,
    elfY:0,
    showV:false,


  }),
  actions: {

  },
  getters: {
        
  },
});
