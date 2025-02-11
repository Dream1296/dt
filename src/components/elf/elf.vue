<template>
    <div id="all" :style="{ top: allTop + 'px', left: allLeft + 'px' }" @click="setShowV">
        <img src="../../assets/img/jingling.png">
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { viewDataStore } from '@/stores/viewDataStore';
import { watch } from 'vue';

let viewData = viewDataStore();

let r = ref(50);

let allTop = ref(window.innerHeight - 60);
let allLeft = ref(window.innerWidth - 60);
viewData.elfX = window.innerWidth - 60 + r.value / 2;
viewData.elfY = window.innerHeight - 60 + r.value / 2;


watch(() => {
    return viewData.elfX + viewData.elfY
}, (newVal, oldValue) => {
    if (window.innerHeight <= (viewData.elfY + r.value / 2)) {
        viewData.elfY = window.innerHeight - r.value / 2;
        allTop.value = window.innerHeight - r.value / 2;
    }
    if (viewData.elfY < r.value / 2) {
        viewData.elfY = r.value / 2;
        allTop.value = r.value / 2;
    }
    if (window.innerWidth <= (viewData.elfX + r.value / 2)) {
        viewData.elfX = window.innerWidth - r.value / 2;
        allLeft.value = window.innerWidth - r.value / 2;
    }
    if (viewData.elfX < r.value / 2) {
        viewData.elfX = r.value / 2;
        allLeft.value = r.value / 2;
    }
 
    allTop.value = viewData.elfY - r.value / 2;
    allLeft.value = viewData.elfX - r.value / 2;
    console.log(allTop.value, allLeft.value);


})

function setShowV(){
    viewData.showV = !viewData.showV
}


</script>


<style lang="less" scoped>
#all {
    width: 50px;
    height: 50px;
    position: fixed;
    z-index: 900;

    img {
        width: 100%;
        height: 100%;
    }
}
</style>