<template>
  <div ref="scrollContainer" class="scroll-box">
    <div
      v-for="item in vlist"
      :key="item"
      class="item"
    >
      元素 {{ item }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 列表数组
const vlist = ref<number[]>([])

// 滚动容器引用
// const scrollContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  // 初始化 10~20
  for (let i = 10; i <= 20; i++) {
    vlist.value.push(i)
  }

  // 3秒后在前面插入 5~9（倒序插入）
  setTimeout(() => {
    for (let i = 9; i >= 5; i--) {
      // vlist.value.unshift(i)
    }
    console.log('已插入元素 5~9 到前面')
  }, 3000)
})
</script>

<style scoped>
.scroll-box {
  height: 100%;
  overflow-y: auto;
  border: 1px solid #ccc;
}

.item {
  height: 300px;
  line-height: 300px;
  text-align: center;
  font-size: 20px;
  color: white;
}
.item:nth-child(odd) {
  background-color: #4CAF50;
}
.item:nth-child(even) {
  background-color: #2196F3;
}
</style>
