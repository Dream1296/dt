<template>
    <div id="all2">
        <div id="user" class="block" v-html="svgArr[0]"></div>
        <div id="Internet" class="block" v-html="svgArr[1]"></div>
        <div id="orangepi5" class="block">
            <div v-html="svgArr[2]"></div>
            <div id="drop1" class="drop" v-show="ledArr[0]"></div>
            <div id="drop2" class="drop" v-show="ledArr[1]"></div>
            <div id="drop3" class="drop" v-show="ledArr[2]"></div>
            <div id="drop4" class="drop" v-show="ledArr[3]"></div>
            <div id="drop5" class="drop" v-show="ledArr[4]"></div>
            <div id="drop6" class="drop" v-show="ledArr[5]"></div>
        </div>

        <div id="arrowA" class="block" v-html="svgArr[3]"></div>
        <div id="arrowB" class="block" v-html="svgArr[3]"></div>

        <div id="socker" class="block" v-html="svgArr[4]"></div>


    </div>
</template>



<script setup lang="ts">
import { ref } from 'vue';
import { svgArr } from './svgArr';

let isLed = ref(true);

let ledArr = ref([true,true,true,true,true,true])

// 随机闪烁函数
const randomToggle = () => {
  const randomIndex = Math.floor(Math.random() * ledArr.value.length);
  ledArr.value[randomIndex] = !ledArr.value[randomIndex];
};
setInterval(() => {
    randomToggle();
    // let i = Math.floor(Math.random() * 2 + 1)
    // for(let j = 0; j < i; j++){
    //     let index = Math.floor(Math.random() * 6);
    //     ledArr.value[index] = !ledArr.value[index];
    // }

  
}, 500);




</script>


<style lang="less" scoped>
@import "./userIn.less";
</style>