<template>
    <div id="all" :style="{ left: allLeft + 'px', top: allTop + 'px' }" v-show="viewData.showV">
        <div class="dy" @click="upData">
            <img src="../../assets/img/dy.png" v-show="viewData.isShowDy">
            <img src="../../assets/img/dy0.png" v-show="!viewData.isShowDy">
        </div>
    </div>

    <div id="alls" :style="{ left: allLefts + 'px', top: allTops + 'px' }" v-show="viewData.showV">
        <div class="dy" @click="upData">
            <img src="../../assets/img/dy.png" v-show="viewData.isShowDy">
            <img src="../../assets/img/dy0.png" v-show="!viewData.isShowDy">
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

function upData(){
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

upV();


watch(() => viewData.elfX + viewData.elfY, (newVal, oldValue) => {
    upV();



})


</script>


<style lang="less" scoped>
#all {
    width: 80vw;
    height: 90px;
    z-index: 900;
    position: fixed;
    background-color: bisque;
    display: flex;
}

img {
    width: 100%;
    height: 100%;
}

.dy {
    width: 30px;
    height: 30px;
}

#alls {
    width: 80vw;
    height: 90px;
    z-index: 900;
    position: fixed;
    background-color: bisque;
    display: flex;
}

.kuai {
    width: 10px;
    height: 10px;
    background-color: aqua;
    margin-left: 10px;

}
</style>