<template>
  <div id="all">
    <img :src="currentSrc" />
  </div>
</template>



<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

// 默认占位图
const imgLog = new URL('../../assets/img/img_load.png', import.meta.url).href;

const props = defineProps<{
  src: string;
}>();

// 当前实际使用的图片路径（默认是占位图）
const currentSrc = ref(imgLog);

// 监听 props.src 变化，尝试加载图片
const loadImage = (url: string) => {
  const img = new Image();
  img.src = url;
  img.onload = () => {
    currentSrc.value = url; // 加载成功后切换图片
  };
  img.onerror = () => {
    currentSrc.value = imgLog; // 加载失败仍保持占位图
  };
};

watch(
  () => props.src,
  (newSrc) => {
    loadImage(newSrc);
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
#all {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}
</style>