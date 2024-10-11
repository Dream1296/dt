<template>
    
    <div>
        
        
    </div>


</template>


<script setup lang="ts">
import { getdt } from '@/api/api';
import { useRoute } from 'vue-router';
import { token } from '@/getToken';
import { dtData } from '@/dtData/getList';
import imgsf from '@/components/imgsf/imgsf.vue';

const route = useRoute();

let dtid = Number(route.query.dtid);
let tokens = Number(route.query.token);







</script>


<style lang="less" scoped>
@import url('../assets/css/dtOne.less');
</style>