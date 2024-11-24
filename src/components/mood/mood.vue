<template>

<div id="all">
<div class="from">
    <div>开心</div>
    <div>充实</div>
    <div>惊喜</div>
    <div>得意</div>
    <div>暖心</div>
    <div>平静</div>
</div>
<div></div>
</div>

<Line></Line>


</template>


<script setup lang="ts">
import Line from '../fenge/line.vue';


</script>


<style scoped lang="less">
#all{
    width:100vw;
    height: 100px;
    // background-color: aqua;
}
.from{
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin-top: 10px;
    div{
        width: 50px;
        height: 30px;
        margin-left:calc(25vw - 37.5px);
        margin-top: 10px;
        margin-bottom: 10px;
        // margin-top: 30px;
        background-color: rgb(245, 245, 245);
        line-height: 30px;
        text-align: center;
    }
}




</style>