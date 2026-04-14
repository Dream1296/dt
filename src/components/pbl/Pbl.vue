<template>
    <div id="y" :class="{ 'cols-3': props.columns === 3 }">
        <div id="leftImg" class="x" ref="left">
            <img v-for="a in vL" :src="a" @click="tzImg(a)">
        </div>

        <div id="midImg" class="x" ref="mid" v-if="props.columns === 3">
            <img v-for="a in vM" :src="a" @click="tzImg(a)">
        </div>

        <div id="rgihtImg" class="x" ref="rgiht">
            <img v-for="a in vR" :src="a" @click="tzImg(a)">
        </div>
    </div>

</template>



<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';

let imgSrc: string[] = [];
let left = ref<HTMLDivElement>();
let mid = ref<HTMLDivElement>();
let rgiht = ref<HTMLDivElement>();
//传递事件
const emit = defineEmits(['img']);

const props = defineProps<{
    srcArr: string[],
    dtid: number,
    columns?: number,
}>();



onMounted(() => {
    imgSrc = props.srcArr;
    addVList();


})



let vL = ref<string[]>([]);
let vM = ref<string[]>([]);
let vR = ref<string[]>([]);

function tzImg(src: string) {
    let num = Number( extractIndexFromString(src) );
    emit('img', num );
}


//将图片按高度添加到左右（及中间）列
function addVList() {
    let dom = imgSrc.shift();
    if (!dom) {
        return
    }

    const lH = left.value!.clientHeight;
    const rH = rgiht.value!.clientHeight;

    if (props.columns === 3 && mid.value) {
        const mH = mid.value.clientHeight;
        const minH = Math.min(lH, mH, rH);
        if (minH === lH) {
            vL.value.push(dom);
        } else if (minH === mH) {
            vM.value.push(dom);
        } else {
            vR.value.push(dom);
        }
    } else {
        if (lH < rH) {
            vL.value.push(dom);
        } else {
            vR.value.push(dom);
        }
    }

    nextTick(() => setTimeout(addVList,100));
}


// 提取url中的index值
function extractIndexFromString(input: string): string {
    // 定义正则表达式来匹配 index= 后面的数字
    const regex = /index=(\d+)/;
    const match = input.match(regex);

    // 如果匹配成功，返回匹配的数字部分
    if (match && match.length > 1) {
        return match[1]; // match[1] 是第一个捕获组，即数字部分
    } else {
        return "0"; // 如果没有匹配到，返回 null
    }
}




</script>


<style lang="less" scoped>
@import url(./Pbl.less);
</style>
