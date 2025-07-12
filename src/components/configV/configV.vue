<template>
    <div class="all" :style="{ left: allLeft + 'px', top: allTop + 'px' }" v-show="viewData.showV">
        <div class="dy" @click="upData">
            <img src="../../assets/img/dy.png" v-show="viewData.isShowDy">
            <img src="../../assets/img/dy0.png" v-show="!viewData.isShowDy">
        </div>

        <div class="toTop" @click="toTop">
            <img src="../../assets/img/ic_回到顶部.png">
        </div>


    </div>

    <div class="all" :style="{ left: allLefts + 'px', top: allTops + 'px' }" v-show="viewData.showV">
        <div class="dy" @click="upData">
            <img src="../../assets/img/dy.png" v-show="viewData.isShowDy">
            <img src="../../assets/img/dy0.png" v-show="!viewData.isShowDy">
        </div>

        <div class="toTop" @click="toTop">
            <img src="../../assets/img/ic_回到顶部.png">
        </div>


    </div>

</template>


<script setup lang="ts">
import { watch } from 'vue';
import { ref } from 'vue';
import { viewDataStore } from '@/stores/viewDataStore';
import { dtDataInit } from '@/dtData/getList';
import { myEvent } from '@/myEnit';
let viewData = viewDataStore();
let allLeft = ref(0);
let allTop = ref(0);

let allLefts = ref(0);
let allTops = ref(0);

let widths = window.innerWidth * 0.8;
let heights = 90;

function upData() {
    viewData.isShowDy = !viewData.isShowDy;
    dtDataInit(viewData.loa).then((data) => {
        myEvent.emit('upDtList');
    })
}

function upV() {
    allLeft.value = viewData.elfX - widths;
    allTop.value = viewData.elfY - heights;

    allLefts.value = allLeft.value + window.innerWidth;
    allTops.value = allTop.value;
}

function toTop() {
    // 可设定滚动动画时长（毫秒）
    const duration = 500
    const start = window.scrollY || window.pageYOffset
    const startTime = performance.now()

    function animate(currentTime:any) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3) // easeOutCubic

        window.scrollTo(0, start * (1 - ease))

        if (progress < 1) {
            requestAnimationFrame(animate)
        }
    }

    requestAnimationFrame(animate)
}

upV();


watch(() => viewData.elfX + viewData.elfY, (newVal, oldValue) => {
    upV();



})


</script>


<style lang="less" scoped>
@import "./configV.less";
</style>