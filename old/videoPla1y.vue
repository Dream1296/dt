<template>
    <div>
        <video :src="src" controls ref="video"></video>
    </div>


</template>


<script setup lang="ts">

import { useRoute } from 'vue-router';
import { dtData } from '@/dtData/getList';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { dtVideo } from '@/api/api';


const route = useRoute();
let src = ref('');
let video = ref<HTMLVideoElement>();

let dtid = Number(route.query.dtid);
let index = Number(route.query.index);




onMounted(() => {
    src.value = dtVideo(dtid, index);
    setTimeout(()=>{
        video.value?.play();
    })
})




</script>


<style lang="less" scoped>
div {
    width: 100vw;
    height: 100vh;
    display: flex;

}

video {
    width: 100vw;
    height: auto;
}
</style>