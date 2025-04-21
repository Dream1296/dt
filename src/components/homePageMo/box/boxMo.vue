<template>
    <div id="all1">

        <div id="logo">
            <img src="../../../assets/img/homePage/text1.png">
        </div>
        <div id="box1" v-html="svgArr[0]"></div>

        <div id="box2" class="box-z" v-html="svgArr[1]"></div>

        <div id="box3" class="box-z" v-html="svgArr[2]"></div>

        <div id="box4" class="box-z" v-html="svgArr[3]"></div>

        <div id="box5" class="box-z" v-html="svgArr[4]"></div>

    </div>



</template>


<script setup lang="ts">
import { ref } from 'vue';
import { svgArr } from '../../homePage/boxs/svgArr';











</script>


<style lang="less" scoped>
@import "./boxMo.less";
</style>