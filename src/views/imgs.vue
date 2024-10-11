<template>
    <div>
        <imgsf :imageSrc="imgSrc"></imgsf>
    </div>


</template>

<script setup lang="ts">
import { getdt, imgSrcs } from '@/api/api';
import { useRoute } from 'vue-router';
import { token } from '@/getToken';
import { dtData } from '@/dtData/getList';
import imgsf from '@/components/imgsf/imgsf.vue';
import { onMounted, ref } from 'vue';


const route = useRoute();
// let imgSrcArr: string;
let imgSrc = ref('');

let dtid = Number(route.query.dtid);
let index = Number(route.query.index);

onMounted(()=>{
    imgSrc.value = imgSrcs(dtid,index);
})






</script>


<style lang="less" scoped>
@import url('../assets/css/imgs.less');
</style>