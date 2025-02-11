<template>
    <div v-if="dtid != '-1'" id="all" ref="allDom">
        <longTextShow :data="data"></longTextShow>

    </div>


</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import longTextShow from '@/components/LongTextShow/longTextShow.vue';
import { getLongText } from '@/api/api';

let dtid = ref("-1");
const route = useRoute();

dtid.value = route.query.id as string;

let allDom = ref<HTMLDivElement>();

let data = ref("<h1>正在加载</h1>");


let redHtml = `
         <!-- 结束标志 -->
  <div class="end-mark_long_text">
    <span>--END--</span>
  </div>`;

if (dtid.value != '-1') {
    getLongText(dtid.value)
        .then(res => {
            if(res.data.type == 'chatgpt' && allDom.value){
                allDom.value.style.padding = '0px';
            }
            data.value = res.data.data + redHtml;
        })
}






















</script>



<style lang="less" scoped>
#all {
    padding: 20px;
    font-family: 'Arial', sans-serif;
    /* 清新的字体 */
    line-height: 1.75;
    /* 更宽松的行间距 */
    background-color: #ffe6f1;
    /* 淡粉色背景 */
    color: #4a2c72;
    /* 深紫色文字，增加对比度 */
    margin: 0;
    box-sizing: border-box;
}
</style>