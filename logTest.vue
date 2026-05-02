<template>

  <div class="list" v-for="a in vlist" ref="listDom">
    <div>
      {{ a }}
    </div>
  </div>

  <div id="config">
    <button @click="add">+</button>
  </div>


</template>


<script setup lang="ts">
import { nextTick, onMounted } from 'vue';
import { ref } from 'vue';

let data: number[] = [];
let listDom = ref<HTMLElement[]>([]);
for (let i = 1; i <= 60; i++) {
  data.push(i);
}

let vlist = ref<number[]>([]);
let index = 0;
let observer: IntersectionObserver | null = null;
onMounted(() => {
  add();
})



function add() {
  for (let i = index; i < index + 6; i++) {
    vlist.value.push(data[i]);
  }
  index += 6;

  nextTick(() => {
    // 如果 observer 已经存在，断开之前的观察
    if (observer) {
      observer.disconnect();
    }
    if(index >= 60) return;

    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        add()
      }
    });
    observer.observe(listDom.value[index - 3]);
  })


}







</script>


<style lang="less" scoped>
.list {
  width: 100%;
  height: 300px;
  background-color: #f00;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  align-content: center;

  div {
    display: inline-block;
    font-size: 36px;
  }
}

#config {
  width: 50px;
  height: 50px;
  position: fixed;
  left: 10px;
  top: 50px;
  background-color: aqua;
}
</style>