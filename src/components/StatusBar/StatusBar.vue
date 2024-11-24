<template>
  <div class="status-bar">
    <div class="time">{{ time }}</div>
    <div class="dian">{{ batteryLevel }}</div>
    <!-- <div class="status-item">{{ networkType }}</div> -->
  </div>
</template>

<script>
export default {
  name: "StatusBar",
  data() {
    return {
      time: "12:34", // 伪数据：默认时间
      batteryLevel: "🔋 85%", // 伪数据：电池电量
      networkType: "📶 4G" // 伪数据：网络类型
    };
  },
  mounted() {
    // 模拟实时时间更新
    this.updateTime();
    setInterval(this.updateTime, 60000); // 每分钟更新一次
  },
  methods: {
    updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      this.time = `${hours}:${minutes}`;
    }
  }
};
</script>

<style scoped>
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px;
  /* background-color: #f5f5f5; 背景颜色 */
  color: #333;
  /* 文字颜色 */
  font-size: 12px;
  padding: 0 10px;
  /* box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1); */
  z-index: 1000;
}

.time {
  margin-left: 10px;


}

.dian {
  position: absolute;
  left: 80%;

}
</style>