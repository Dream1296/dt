<template>
    <div id="main">
        <div id="top">羽毛球 #{{ props.datas?.id }}</div>
        <div id="juli">
            <span class="num">{{ data?.time_m }}</span>
            <span class="km"></span>
        </div>
        <hr>

        <div id="box">
            <div class="time">
                <div>训练时长:</div>
                <div>{{ data?.time_m }}</div>
            </div>

            <!-- <div class="time">
                <div>平均配速:</div>
                <div>{{ data?.peishu }}</div>
            </div> -->

            <div class="time">
                <div>平均心率:</div>
                <div>{{ data?.xinlv }}</div>
            </div>


            <div class="time">
                <div>最大心率:</div>
                <div>{{ data?.xinlv_max }}</div>
            </div>


            <div class="time">
                <div>训练有氧效果:</div>
                <div>{{ data?.xunlanxiaoguo_you }}</div>
            </div>


            <div class="time">
                <div>训练无氧效果:</div>
                <div>{{ data?.xunlanxiaoguo_wu }}</div>
            </div>


        </div>

        <div id="date">
            {{ data?.date.slice(0, 16) }}
        </div>


    </div>
</template>



<script setup lang="ts">
import type { A } from "@/type/dtType";
import type { Ref } from "vue";
import { computed, ref } from "vue";

//获取父组件传入数据
const props = defineProps<{ datas: A | undefined }>();

let data = props.datas?.KeepBadminton;




let xl_pj_num = ref("1");
let xl_max_num = ref('1');







// xlNum(xl_pj_num, "170");
// xlNum(xl_max_num, "200");







function xlNum(xl_max_num_v: Ref<string>, xl_num: string) {
    let a = Math.floor(1000 / ((Number(xl_num) / 60) * 2));
    setInterval(() => {
        if (xl_max_num_v.value == "1") {
            xl_max_num_v.value = "0";
            return;
        }
        xl_max_num_v.value = "1";
    }, a);
}
</script>



<style scoped>
@import url("./KeepBadminton.less");
</style>