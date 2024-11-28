<template>
  <div v-if="isVisible" class="image-viewer">
    <div class="image-container" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
      <img :src="imageSrc" :style="imageStyle" ref="image" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageSrc: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      scale: 1,
      lastScale: 1,
      startDist: null,
      isVisible: true,
      minScale: 1,
    };
  },
  computed: {
    imageStyle() {
      return {
        transform: scale(${ this.scale }),
        transition: 'transform 0.3s',
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain', // 保持图片的长宽比例
      };
    }
  },
  methods: {
    closeViewer() {
      this.isVisible = false;
    },
    getDistance(touches) {
      const [touch1, touch2] = touches;
      const deltaX = touch1.clientX - touch2.clientX;
      const deltaY = touch1.clientY - touch2.clientY;
      return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    },
    onTouchStart(e) {
      if (e.touches.length === 2) {
        this.startDist = this.getDistance(e.touches);
      }
    },
    onTouchMove(e) {
      if (e.touches.length === 2) {
        const currentDist = this.getDistance(e.touches);
        const newScale = this.lastScale * (currentDist / this.startDist);

        // 限制缩放比例，防止缩得过小
        if (newScale >= this.minScale) {
          this.scale = newScale;
        } else {
          this.scale = this.minScale;
        }
      }
    },
    onTouchEnd() {
      this.lastScale = this.scale;
    },
    updateScale() {
      const imageElement = this.$refs.image;
      const imageWidth = imageElement.naturalWidth;
      const imageHeight = imageElement.naturalHeight;

      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;

      const widthRatio = containerWidth / imageWidth;
      const heightRatio = containerHeight / imageHeight;

      // 选择更小的缩放比率，保证图片能完全显示
      this.minScale = Math.min(widthRatio, heightRatio);
      this.scale = this.minScale;
      this.lastScale = this.minScale;
    }
  },
  mounted() {
    this.updateScale(); // 在挂载后更新图片的初始缩放比例
    window.addEventListener('resize', this.updateScale); // 监听窗口大小变化
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateScale); // 清理事件监听
  }
};
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
  overflow: hidden;
  /* 防止页面滚动 */
  z-index: 9999;
}

.image-container {
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  /* 防止内容超出 */
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