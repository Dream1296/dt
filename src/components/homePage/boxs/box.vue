<template>
    <div id="all1">
        <div id="box">
            <!-- 大盒子 -->
            <div id="box1"  v-html="svgArr[0]"></div>

            <div id="box2" class="box-z" :style="{'transform':`translateY(${heArr[0]}%)`}" v-html="svgArr[1]"></div>

            <div id="box3" class="box-z" :style="{'transform':`translateY(${heArr[1]}%)`}" v-html="svgArr[2]"></div>

            <div id="box4" class="box-z" :style="{'transform':`translateY(${heArr[2]}%)`}" v-html="svgArr[3]"></div>

            <div id="box5" class="box-z" :style="{'transform':`translateY(${heArr[3]}%)`}" v-html="svgArr[4]"></div>



        </div>


    </div>

</template>


<script setup lang="ts">
import { ref } from 'vue';
import { svgArr } from './svgArr';


let heArr = ref([0,0,0,0]);
let heEndArr = [239,122,192,168];


// setInterval(()=>{
//     for(let i = 0; i < 4; i++){
//         if(heArr.value[i] < heEndArr[i]){
//             heArr.value[i] += 2;
//         }
//     }
// },200);






</script>


<style lang="less" scoped>
@import "./box.less";
</style>