<template>
    <div v-if="dtid != '-1'" id="all">
        <longTextShow :dtid="dtid"></longTextShow>
    </div>


</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import longTextShow from '@/components/LongTextShow/longTextShow.vue';

let dtid = ref("-1");
const route = useRoute();

dtid.value = route.query.id as string;

















</script>



<style lang="less" scoped>
#all {
    padding: 20px;
    font-family: 'Arial', sans-serif; /* 清新的字体 */
    line-height: 1.75; /* 更宽松的行间距 */
    background-color: #ffe6f1; /* 淡粉色背景 */
    color: #4a2c72; /* 深紫色文字，增加对比度 */
    margin: 0;
    box-sizing: border-box;
}

</style>