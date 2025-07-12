<template>
    <div id="all1">

        <div id="logo">
            <img src="../../../assets/img/homePage/text1.png">
        </div>
        <div id="box1"  v-html="svgArr[0]"></div>

        <div id="box2" :style="{left:boxXY[1].x,top:boxXY[1].y}" class="box-z" v-html="svgArr[1]"></div>

        <div id="box3" :style="{left:boxXY[2].x,top:boxXY[2].y}" class="box-z" v-html="svgArr[2]"></div>

        <div id="box4" :style="{left:boxXY[3].x,top:boxXY[3].y}" class="box-z" v-html="svgArr[3]"></div>

        <div id="box5" :style="{left:boxXY[4].x,top:boxXY[4].y}" class="box-z" v-html="svgArr[4]"></div>

    </div>



</template>


<script setup lang="ts">
import { ref } from 'vue';
import { svgArr } from '../../homePage/boxs/svgArr';

//最大位置的值
let boxXY1 = [{ x: 0, y: 58 }, { x: -2, y: 26 }, { x: 21, y: 8 }, { x: 44, y: 10 }, { x: 66, y: 20 }];

//默认值
let boxX2 = ref([{ x: 0, y: 58 }, { x: -2, y: 26 }, { x: 21, y: 8 }, { x: 44, y: 10 }, { x: 66, y: 20 }]);

//当前值
let boxXY = ref([{ x: 0, y: 58 }, { x: -2, y: 26 }, { x: 21, y: 8 }, { x: 44, y: 10 }, { x: 66, y: 20 }
]);











</script>


<style lang="less" scoped>
@import "./boxMo.less";
</style>