<template>
  <div v-if="load" class="image-viewer">
    <div class="image-container" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
      <!-- 使用 ref 来引用图片元素 -->
      <img :src="imageSrc" :style="imageStyle" ref="image" @load="onImageLoad" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed, defineProps, defineEmits } from 'vue';

// 定义接收的 props
const props = defineProps({
  imageSrc: {
    type: String,
    required: true
  },
  load: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits(['imageLoaded']);

// 初始化状态
const scale = ref(1);
const lastScale = ref(1);
const startDist = ref(null);
const isVisible = ref(true);
const minScale = ref(1);
const isImageLoaded = ref(false);

// 引用图片元素
const imageElement = ref(null);

// 计算图片的样式
const imageStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transition: 'transform 0.3s',
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
}));

// 监听 load 变化，控制组件的初始化和渲染
watch(() => props.load, (newVal) => {
  if (newVal) {
    isVisible.value = true; // 显示组件
  } else {
    isVisible.value = false; // 隐藏组件
    isImageLoaded.value = false; // 重置加载状态
  }
});

// 计算缩放比例
const updateScale = () => {
  if (!isImageLoaded.value || !imageElement.value) return; // 确保图片已加载并且引用有效

  const imageWidth = imageElement.value.naturalWidth;
  const imageHeight = imageElement.value.naturalHeight;

  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;

  const widthRatio = containerWidth / imageWidth;
  const heightRatio = containerHeight / imageHeight;

  minScale.value = Math.min(widthRatio, heightRatio);
  scale.value = minScale.value;
  lastScale.value = minScale.value;
};

// 手势缩放相关方法
const onTouchStart = (e) => {
  if (e.touches.length === 2) {
    startDist.value = getDistance(e.touches);
  }
};

const onTouchMove = (e) => {
  if (e.touches.length === 2) {
    const currentDist = getDistance(e.touches);
    const newScale = lastScale.value * (currentDist / startDist.value);

    if (newScale >= minScale.value) {
      scale.value = newScale;
    } else {
      scale.value = minScale.value;
    }
  }
};

const onTouchEnd = () => {
  lastScale.value = scale.value;
};

// 获取触摸点之间的距离
const getDistance = (touches) => {
  const [touch1, touch2] = touches;
  const deltaX = touch1.clientX - touch2.clientX;
  const deltaY = touch1.clientY - touch2.clientY;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
};

// 图片加载完成时的处理
const onImageLoad = () => {
  isImageLoaded.value = true;
  updateScale();
  emit('imageLoaded'); // 触发父组件的事件
};

// 生命周期钩子
onMounted(() => {
  updateScale();
  window.addEventListener('resize', updateScale);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScale);
});

</script>

<style scoped>
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 防止页面滚动 */
  z-index: 9999;
}

.image-container {
  max-width: 100%;
  max-height: 100%;
  overflow: hidden; /* 防止内容超出 */
  display: flex;
  justify-content: center;
  align-items: center;
}

img {
  max-width: 100%;
  max-height: 100%;
  transition: transform 0.3s ease;
}
</style>
