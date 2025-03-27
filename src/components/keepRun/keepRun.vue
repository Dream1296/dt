<template>
    <div id="main">
        <div id="top">跑步 #{{ props.datas?.id }}</div>
        <div id="juli">
            <span class="num">{{ data?.juli }}</span>
            <span class="km">KM</span>
        </div>
        <hr>

        <div id="box">
            <div class="time">
                <div>训练时长:</div>
                <div>{{ data?.time_m }}</div>
            </div>

            <div class="time">
                <div>平均配速:</div>
                <div>{{ data?.peishu }}</div>
            </div>

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





            <!-- <div id="xl_pj" class="xl">
                <div class="xl_pj_img" :style="{ opacity: `${xl_pj_num}` }">
                    <img src="../../assets/img/xl.png" />
                </div>
                <div id="xl_pj_num">182</div>
            </div>

            <div id="xl_max" class="xl">
                <div class="xl_pj_img" :style="{ opacity: `${xl_max_num}` }">
                    <img src="../../assets/img/xl.png" />
                </div>
                <div id="xl_max_num">200</div>
            </div>

            <div class="xg">
                <div>xl</div>
                <div>4.0</div>
            </div>

            <div class="xg">
                <div>xl</div>
                <div>2.1</div>
            </div> -->






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

let data = props.datas?.KeepRun;




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
@import url("./keepRun.less");
</style>