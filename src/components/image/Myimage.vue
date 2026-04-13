<template>
  <div id="all">
    <img :src="currentSrc" />
  </div>
</template>



<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

// 默认占位图
const imgLog = new URL('../../assets/img/img_load.webp', import.meta.url).href;

const props = defineProps<{
  src: string;
}>();

// 当前实际使用的图片路径（默认是占位图）
const currentSrc = ref(imgLog);

//使用img对象加载图片
const tryLoad = (url: string) => {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = url;
  });
};

// 监听 props.src 变化，尝试加载图片
const loadImage = async (url: string) => {
  const maxRetry = 30; // 最大重试次数
  for (let i = 0; i <= maxRetry; i++) {
    try {
      await tryLoad(`${url}&retry=${Date.now()}_${i}`);
      currentSrc.value = url;
      return;
    } catch (e) {
      if (i === maxRetry) {
        currentSrc.value = imgLog; // fallback
        return;
      }

      // 等待再重试
      await new Promise(r => setTimeout(r, 500 * (i + 1)));
    }
  }
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