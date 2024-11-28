<template>
    <div v-if="Shows">
        <!-- {{ tempStores.imgLog }} -->
        <imgsf v-if="!Shows" :imageSrc="testA"></imgsf>


        <!-- <imgsf v-if="Shows" :imageSrc="imgSrc"></imgsf> -->
    </div>


</template>

<script setup lang="ts">
import { getdt, imgSrcs } from '@/api/api';
import { useRoute } from 'vue-router';
import { dtData } from '@/dtData/getList';
import imgsf from '@/components/imgsf/imgsf.vue';
import { onMounted, ref } from 'vue';
import { tempStore } from '@/stores/tempStore';

let tempStores = tempStore();

let testA = "https://frp-fix.top:20047/api/dtimg?dtid=501&index=0&token=eyJ1c2VyX2lkIjoieXciLCJkYXRlIjoxNzMyNzY2MTY0MTg3LCJ0eXBlIjoicmF0In0=|92768462debbcbd5bfbceb8b38c884673b848b2964037417f384208a285b1143";

let Shows = ref(false);

const route = useRoute();
// let imgSrcArr: string;
let imgSrc = ref('');

let dtid = Number(route.query.dtid);
let index = Number(route.query.index);




onMounted(() => {
    if (!dtid) {
        return imgSrc.value = tempStores.imgSrc;
    }
    imgSrc.value = imgSrcs(dtid, index);
    Shows.value = true;
    fetch(imgSrc.value)
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);  // 创建图片的 URL
            imgSrc.value = url;
            // Shows.value = true;
        })
        .catch(error => {
            console.error('Failed to load image:', error);
        });

})








</script>


<style lang="less" scoped>
@import url('../assets/css/imgs.less');
</style>