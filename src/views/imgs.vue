<template>
    <div>
        <div>
            <imgsf :load="!Shows" :imageSrc="tempStores.imgLog"></imgsf>
        </div>

        <div>
            <imgsf :load="Shows" :imageSrc="imgSrcRef"></imgsf>
        </div>

    </div>


</template>

<script setup lang="ts">
import { getdt, imgSrc } from '@/api/api';
import { useRoute } from 'vue-router';
import { dtData } from '@/dtData/dtList';
import imgsf from '@/components/imgsf/imgsf.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { tempStore } from '@/stores/tempStore';
import { showFailToast, Toast } from 'vant';

let tempStores = tempStore();

let Shows = ref(false);

const route = useRoute();

let dtid = Number(route.query.dtid);
let index = Number(route.query.index);

let imgSrcRef = ref(" ");






onMounted(() => {
    if (isNaN(dtid) || isNaN(index) || dtid === undefined || index === undefined) {
        imgSrcRef.value = tempStores.imgSrc;
    } else {
        imgSrcRef.value = imgSrc(dtid, index,'1');
    }

    const img = new Image();

    img.onload = () => {
        stop(100).then(() => {
            console.log("原图加载完成");
            Shows.value = true;
        })

    };


    img.onerror = (error) => {
        showFailToast('图片原图加载失败');
        Shows.value = false;
    };

    img.src = imgSrcRef.value;

})


function stop(time: Number): Promise<void> {
    return new Promise((rejects, resolve) => {
        setTimeout(() => {
            rejects();
        });
    })
}



onUnmounted(()=>{
    tempStores.imgSrc = "";
    tempStores.imgLog = "";
})




</script>


<style lang="less" scoped>
@import url('../assets/css/imgs.less');
</style>