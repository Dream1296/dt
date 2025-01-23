<template>
    <div>
        <div id="bg" v-if="props.bgStyle == 1">
            <img class="bgDi" src="../../assets/img/dtbg.png">
            <img class="bgIco1" src="../../assets/img/Catico.png">
        </div>
        <div id="bg" v-if="props.bgStyle == 2">
            <!-- <img class="bgDi" src="../../assets/img/dtbg.png"> -->
            <img class="bgIco2" src="../../assets/img/sl.png">
        </div>
        <div id="bg" v-if="props.bgStyle == 3">
            <!-- <img class="bgDi" src="../../assets/img/dtbg.png"> -->
            <img class="bgIco3" src="../../assets/img/lanjin.png">
        </div>
        <div id="bg" v-if="props.bgStyle == 4">
            <!-- <img class="bgDi" src="../../assets/img/dtbg.png"> -->
            <img class="bgIco3" src="../../assets/img/pigYellow.png">
        </div>
    </div>




</template>


<script setup lang="ts">
import type { A } from '@/type/dtType';


//获取父组件传入数据
const props = defineProps<{ bgStyle:number }>();

</script>


<style lang="less" scoped>
@import url('./styleTop.less');
</style>
