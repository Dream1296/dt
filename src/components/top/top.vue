<template>
    <div class="zhu">
        <topView :dtid="data.id" :touxian-src="getTouxian('xt')" :name="data.name"></topView>
        <div id="biaodan">
            <div class="circle">
                <div>
                    <van-circle :current-rate="cpuTemperature" :rate="rate" layer-color="#ebedf0" :color="color1"
                        :text="temperatureText()" />
                </div>
                <div>
                    <van-circle :current-rate="cpuUsage" :rate="rate" layer-color="#ebedf0" :color="color2"
                        :text="cpuUsageText()" />
                </div>
            </div>

            <div id="fensan" @click="setFans">
                <img :class="{ zhuan: fenSanNum == 1 }" src="../../assets/img/fengsan.png">
            </div>


        </div>


    </div>
    <div class="di">
        <!-- 日期 -->
        <div class="date">
            <span>2024-11-29</span>
        </div>


    </div>



</template>


<script setup lang="ts">

import { getXN, login, setFan } from '@/api/api';
import { showFailToast, showSuccessToast } from 'vant';
import { ref } from 'vue';
import Line from '../fenge/line.vue';
import { getTouxian } from '@/api/api';
import topView from '../TopView/topView.vue';
import { watch } from 'vue';
import type { Top } from '@/types/dtType';
import { token } from '@/api/token';


let data = ref<Top>({
    type: 'top',
    id: "999",
    touxian: 'xt',
    name: "访问"
});
const props = defineProps<{ datas: Top | undefined }>();

// 监听props.datas的变化
watch(
    () => props.datas,
    (newVal) => {
        if (newVal !== undefined) {
            data.value = newVal;
        }
    },
    { immediate: true } // 当props.datas初始值为undefined时，immediate确保一开始就会执行
);


let cpuTemperature = ref(0);
let cpuUsage = ref(0);
let temperatureText = () => {
    return "CPU温度" + cpuTemperature.value;
}
let cpuUsageText = () => {
    return "CPU负载" + cpuUsage.value;
}
let rate = ref(30);
let color1 = ref('#3fecff');
let color2 = ref('#3fecff')

let fenSanNum = ref(0);

let eventSource = getXN();
type Events = { cpuTemperature: number, gpuTemperature: number, sddisk: string, ssddisk: string, cpuUsage: number, memoryUsage: string, fenSanNun: Number };

function setFans() {



    if (token.istoken == 'false') {
        showFailToast('拒绝操作');
        return
    }
    let setFanNum = fenSanNum.value == 1 ? 0 : 1;
    setFan(setFanNum).then((data) => {
        if (data.code != 200) {
            return
        }
        fenSanNum.value = data.fan;
    })
}

eventSource.addEventListener('message', (event: any) => {
    let data = JSON.parse(event.data) as Events;

    if (Number(data.fenSanNun) != fenSanNum.value) {
        fenSanNum.value = Number(data.fenSanNun);
    }

    cpuTemperature.value = Math.floor(Number(data.cpuTemperature));
    cpuUsage.value = Math.floor(Number(data.cpuUsage));

    color1.value = cpuTemperature.value >= 50 ? 'red' : '#3fecff';
    color2.value = cpuUsage.value >= 50 ? 'red' : '#3fecff';
})




</script>

<style scoped lang="less">
@import url('@/assets/css/public.less');
@import url('./top.less');
</style>