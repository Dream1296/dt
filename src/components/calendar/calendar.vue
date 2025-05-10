<template>
  <div id="all">
    <div id="head">
      2025年4月
    </div>




    <div id="top">
      一二三
    </div>

    <div id="tab">
      <virtual-scroller :items="dateData" :item-height="40" class="virtual-scroller">
        <!-- 使用插槽渲染每个日期 -->
        <template #default="{ item }">
          <caledarDiv :date="item" />
        </template>
      </virtual-scroller>
    </div>



  </div>



</template>

<script setup lang="ts">
import { ref } from 'vue'
import caledarDiv from './caledarDiv/caledarDiv.vue';
// import { VirtualScroller } from 'vue-virtual-scroller';

let dateData = ref<{ y: number, m: number, d: number }[]>([]);

for (let i = 0; i < 60; i++) {
  dateData.value.push({
    y: 2025,
    m: 4,
    d: i + 1
  })
}


</script>

<style lang="less" scoped>
#all {
  width: 100%;
  height: 100%;
}

#tab {
  height: 90vh;
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
