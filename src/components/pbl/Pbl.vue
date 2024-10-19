<template>
    <div id="y">
        <div id="leftImg" class="x" ref="left">
            <img v-for="a in vL" :src="a">
        </div>

        <div id="rgihtImg" class="x" ref="rgiht">
            <img v-for="a in vR" :src="a">
        </div>
    </div>

</template>



<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';


let left = ref<HTMLDivElement>();
let rgiht = ref<HTMLDivElement>();

const props = defineProps<{
    srcArr: string[],
}>();


onMounted(()=>{
    addVList();

    
})



let vL = ref<string[]>([]);
let vR = ref<string[]>([]);



//将图片按高度添加到左右2边
function addVList(){
    let dom = props.srcArr.pop();
    if(!dom){
        return
    }
    
    
    if(left.value!.clientHeight < rgiht.value!.clientHeight ){
        vL.value.push( dom  );
    }else{
        vR.value.push( dom );
    }
    nextTick(addVList);
}







</script>


<style lang="less" scoped>
@import url(./Pbl.less);
</style>