<template>
    <div id="all" style="">
        <img :src="props.src">
    </div>

</template>

<style lang="less" scoped>
#all {
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* 隐藏超出部分 */
    position: relative;
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 保持纵横比，裁切长边 */
    position: absolute;
    /* 确保图片填充整个容器 */
    top: 0;
    left: 0;

}
</style>


<script setup lang="ts">
import { watch } from 'fs';


const props = defineProps<{
    src: string,
}>();




</script>