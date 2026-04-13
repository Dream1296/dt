<template>
    <div id="all">
        <div id="bg"></div>

        <div id="text1">
             <!-- 一个小盒子的主页 -->
            <div v-html="svgArr[0]"></div>
        </div>

        <div id="boxs">
            <!-- 右边的盒子 -->
            <box></box>
        </div>

        <div id="text2">
             <div v-html="svgArr[1]"></div>
        </div>


        <div id="wl">
            <!-- <img src="../../assets/img/homePage/in.png"> -->
             <user-in></user-in>
        </div>


        <a target="_blank" class="hover:text-primary transition-colors" href="https://beian.miit.gov.cn/">ICP备案号：豫ICP备2025111164号</a>
        <div id="fk">内容反馈，请发送到：dream1296@outlook.com ，将在24小时内删除违规内容</div>



    </div>

</template>


<script setup lang="ts">
import box from './boxs/box.vue';
import { svgArr } from './svgArr';
import userIn from './userIn/userIn.vue';




</script>


<style lang="less" scoped>
@import "./homepage.less";
</style>