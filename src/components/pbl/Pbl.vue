<template>
    <div id="y">
        <div id="leftImg" class="x" ref="left">
            <img v-for="a in vL" :src="a" @click="tzImg(a)">
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
let rgiht = ref<HTMLDivElement>();
//传递事件
const emit = defineEmits(['img']);

const props = defineProps<{
    srcArr: string[],
    dtid: number,
}>();



onMounted(() => {
    imgSrc = props.srcArr;
    addVList();


})



let vL = ref<string[]>([]);
let vR = ref<string[]>([]);

function tzImg(src: string) {
    emit('img',src.split('&index=')[1]);
}


//将图片按高度添加到左右2边
function addVList() {
    let dom = imgSrc.shift();
    if (!dom) {
        return
    }


    if (left.value!.clientHeight < rgiht.value!.clientHeight) {
        vL.value.push(dom);
    } else {
        vR.value.push(dom);
    }
    nextTick(() => setTimeout(addVList,100));
}







</script>


<style lang="less" scoped>
@import url(./Pbl.less);
</style>