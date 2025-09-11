<template>
    <div v-if="text != '' &&  textType == 'text'" id="all">
        <longTextShow :data="text" :title='title'></longTextShow>
    </div>

    <div v-if="text != '' && textType == 'html'">
        <LongHtmlShow :data="text" ></LongHtmlShow>
    </div>

    <div v-if="text != '' && textType == 'chatgpt'">
        <LongChatShow :data="text" :title="title"></LongChatShow>
    </div>


</template>


<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import longTextShow from '@/components/LongTextShow/longTextShow.vue';
import { getdt, getLongText } from '@/api/api';
import LongHtmlShow from '@/components/LongTextShow/longHtmlShow.vue';
import LongChatShow from '@/components/LongTextShow/longChatShow.vue';
import { viewDataStore } from '@/stores/viewDataStore';
// import { get } from 'node_modules/axios/index.cjs';

const route = useRoute();
const type = computed(() => route.params.type as string);
const id = computed(() => route.params.id as string);
const viewData = viewDataStore();

let text = ref('');
let textType = ref('');
let title = ref('');


console.log(type,id);

if(type.value == 'a'){
    getLongTextFn();
}

if(type.value == 'b'){
    lookTextLong();
}


let all = ref<HTMLDivElement>();


function getLongTextFn(){
        getLongText(id.value)
        .then(res => {
                // document.title = `📖${res.title}`;
                setDoTitle(res.title,res.type)
                text.value = res.data;
                title.value = res.title;
                textType.value = res.type;
                if(textType.value == 'chatgpt' && all.value){
                all.value.style.padding = '0px';
            }
        })
}

function lookTextLong(){
    getdt(id.value, viewData.loa)
        .then(res => { 

            document.title = '正在查看动态' + res.data.id;
            title.value = '#' + res.data.id;
            text.value = textAddBr( res.data.text);
            textType.value = 'text';

        })
}

function setDoTitle(title:string,type:string){
    let doTitle = title;
    if(type == 'text'){
        doTitle = '📖 ' + title;
    }
    if(type == 'html'){
        doTitle = '📄 ' + title;
    }
    if(type == 'chatgpt'){
        doTitle = '💬 ' + title;
    }


    document.title = doTitle;
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

function textAddBr(text:string){
    let res = '';
    for(let z of text.split('\n')){
        res += '&nbsp&nbsp&nbsp&nbsp' + z + '<br>';
    }
    return res;
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