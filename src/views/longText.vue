<template>
    <div v-if="text != ''" id="all">
        <longTextShow :data="text" :title='title'></longTextShow>
    </div>


</template>


<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import longTextShow from '@/components/LongTextShow/longTextShow.vue';
import { getdt, getLongText } from '@/api/api';
// import { get } from 'node_modules/axios/index.cjs';

const route = useRoute();
const type = computed(() => route.params.type as string);
const id = computed(() => route.params.id as string);

let text = ref('');
let title = ref('');


console.log(type,id);

if(type.value == 'a'){
    getLongTextFn();
}

if(type.value == 'b'){
    lookTextLong();
}





function getLongTextFn(){
        getLongText(id.value)
        .then(res => {
            document.title = res.title;
            text.value = res.data;
            title.value = res.title;
           

        })
}

function lookTextLong(){
    getdt(id.value, 1)
        .then(res => { 
            document.title = '正在查看动态' + res.data.id;
            title.value = '#' + res.data.id;
            text.value = res.data.text;

        })
}




// let allDom = ref<HTMLDivElement>();

// let data = ref("<h1>正在加载</h1>");






// if (dtid.value != '-1') {
    // getLongText(dtid.value)
    //     .then(res => {
    //         if(res.code == 400){
    //             data.value = "<h1>403</h1>" + redHtml;
    //         }
    //         if(res.data.type == 'chatgpt' && allDom.value){
    //             allDom.value.style.padding = '0px';
    //         }
    //         data.value = res.data.data + redHtml;
    //     })
        
// }






















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