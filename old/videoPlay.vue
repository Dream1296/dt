<template>
  <div
    class="video-player"
    @click="handleClick"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <video
      :src="src"
      ref="video"
      @timeupdate="updateProgress"
      @loadedmetadata="initVideo"
      @ended="handleEnded"
    ></video>
    <div class="controls">
      <div class="time-info">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>
      <div class="progress-container" @click="seek">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        <input
          type="range"
          class="progress-slider"
          min="0"
          max="100"
          step="0.1"
          v-model="progress"
          @input="dragSeek"
        />
      </div>
      <div class="buttons">
        <button class="play-pause" @click="togglePlay">
          {{ isPlaying ? "❚❚" : "►" }}
        </button>
        <button class="fullscreen" @click="toggleFullscreen">⛶</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { dtVideo } from '@/api/api';
import { ref, onMounted } from 'vue';

const route = useRoute();
const src = ref('');
const video = ref<HTMLVideoElement>();

const dtid = Number(route.query.dtid);
const index = Number(route.query.index);

const isPlaying = ref(false);
const progress = ref(0);
const duration = ref(0); // 视频总时长
const currentTime = ref(0); // 当前播放时间
const fastPlayTimeout = ref<NodeJS.Timeout | null>(null); // 长按超时控制
const isTouchingProgress = ref(false); // 是否正在操作进度条

onMounted(() => {
  src.value = dtVideo(dtid, index);
  setTimeout(() => {
    video.value?.play();
    isPlaying.value = true;
  });
});

// 播放/暂停切换
const togglePlay = () => {
  const videoElement = video.value!;
  if (videoElement.paused) {
    videoElement.play();
    isPlaying.value = true;
  } else {
    videoElement.pause();
    isPlaying.value = false;
  }
};

// 点击屏幕切换播放/暂停
const handleClick = (event: MouseEvent | TouchEvent) => {
  // 防止误触进度条容器的点击事件
  if ((event.target as HTMLElement).classList.contains('progress-container')) return;
  togglePlay();
};

// 更新播放进度和当前时间
const updateProgress = () => {
  const videoElement = video.value!;
  if (!isTouchingProgress.value) {
    currentTime.value = videoElement.currentTime;
    progress.value = (videoElement.currentTime / videoElement.duration) * 100;
  }
};

// 拖动进度条更新
const dragSeek = () => {
  isTouchingProgress.value = true;
  const videoElement = video.value!;
  videoElement.currentTime = (progress.value / 100) * videoElement.duration;
};

// 结束拖动时恢复播放更新
const stopDragSeek = () => {
  isTouchingProgress.value = false;
};

// 点击进度条跳转
const seek = (event: MouseEvent) => {
  const videoElement = video.value!;
  const container = event.currentTarget as HTMLElement;
  const rect = container.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const newTime = (offsetX / container.offsetWidth) * videoElement.duration;
  videoElement.currentTime = newTime;
};

// 初始化视频时长
const initVideo = () => {
  const videoElement = video.value!;
  duration.value = videoElement.duration;
  progress.value = 0;
  currentTime.value = 0;
};

// 视频播放结束
const handleEnded = () => {
  isPlaying.value = false;
  progress.value = 0;
  currentTime.value = 0;
};

// 长按屏幕2倍速播放逻辑
const handleTouchStart = (event: TouchEvent) => {
  // 仅在触摸视频元素时触发
  if (event.target !== video.value) return;
  event.preventDefault(); // 阻止默认行为
  fastPlayTimeout.value = setTimeout(() => {
    const videoElement = video.value!;
    videoElement.playbackRate = 2; // 设置为2倍速
  }, 500); // 长按500ms触发
};

const handleTouchEnd = (event: TouchEvent) => {
  if (fastPlayTimeout.value) {
    clearTimeout(fastPlayTimeout.value);
    fastPlayTimeout.value = null;
  }
  const videoElement = video.value!;
  videoElement.playbackRate = 1; // 恢复正常速度
};

// 桌面端长按
const handleMouseDown = (event: MouseEvent) => {
  if (event.target !== video.value) return;
  fastPlayTimeout.value = setTimeout(() => {
    const videoElement = video.value!;
    videoElement.playbackRate = 2;
  }, 500);
};

const handleMouseUp = () => {
  if (fastPlayTimeout.value) {
    clearTimeout(fastPlayTimeout.value);
    fastPlayTimeout.value = null;
  }
  const videoElement = video.value!;
  videoElement.playbackRate = 1;
};

// 格式化时间
const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// 全屏切换
const toggleFullscreen = () => {
  const videoElement = video.value!;
  if (!document.fullscreenElement) {
    videoElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
};
</script>

<style lang="less" scoped>

.video-player {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: black;
    overflow: hidden;
  }
  
  video {
    width: 100%;
    height: auto;
    flex: 1;
    cursor: pointer;
  }
  
  .controls {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  
  .time-info {
    color: white;
    font-size: 0.8rem;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  
  .progress-container {
    position: relative;
    height: 10px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    cursor: pointer;
  }
  
  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: #4caf50;
    border-radius: 5px;
    transition: width 0.2s;
  }
  
  .progress-slider {
    position: absolute;
    top: -5px;
    left: 0;
    width: 100%;
    height: 20px;
    -webkit-appearance: none;
    background: transparent;
    pointer-events: none;
  }
  
  .progress-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    background: white;
    border-radius: 50%;
    pointer-events: auto;
    cursor: pointer;
  }
  
  .progress-slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    background: white;
    border-radius: 50%;
    pointer-events: auto;
    cursor: pointer;
  }
  
  .buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .play-pause,
  .fullscreen {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }
</style>
