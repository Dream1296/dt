<template>
    <div id="all1">
        <div class="img">
            <img :src="props.src"></img>
        </div>
        <div class="name">
            {{ props.name }}
        </div>



    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const props = defineProps<{
    src: string;
    name: string,
}>();




onMounted(() => {
    // randomColor.value = getRandomColor()
})

</script>

<style scoped lang="less">
#all1 {
    width: 100%;
    height: 158px;
    box-sizing: border-box;
    padding: 2%;
    border-radius: 5%;
    // margin: 2px;
    display: inline-block;
    /* 确保 transform 生效 */
    transition: transform 0.3s ease;
    /* 添加平滑过渡效果 */
}
#all1:hover {
  transform: scale(1.1); /* 放大 1.2 倍 */
  background-color: #E9E9EA;
}


.img {
    width: 98%;
    height: 90%;
    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
    position: relative;

}

.img img {
    // width: 100%;
    // height: 100%;
    // object-fit: contain;
    // /* 保持比例完整显示，不拉伸、不裁剪 */
    // object-position: center;
    /* 居中显示 */
    max-width: 100%;
    max-height: 100%;
    border-radius: 5px;
    color: rgb(24, 144, 255);
}

.name {
    width: 100%;
    height: 10%;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 隐藏超出部分 */
    text-overflow: ellipsis;
    /* 超出部分显示省略号（可选） */
}


.name p {
    font-size: 12px;
    overflow: hidden;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>