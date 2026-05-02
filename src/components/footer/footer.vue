<template>
    <div class="footer-info" v-if="!isPc && a" :style="{ bottom: `${butt}%` }"    >
        <p>
            <span>ICP备案号：<a href="https://beian.miit.gov.cn" target="_blank">豫ICP备2025111164号</a></span>
        </p>
        <!-- <p> -->
            <!-- <span>萌国ICP备案号：<a href="https://icp.gov.moe" target="_blank">20250247</a></span> -->
            <!-- <span><a href="https://icp.gov.moe/?keyword=20250217" target="_blank">萌ICP备20250217号</a></span> -->
        <!-- </p> -->

        <p>
            <span  class="feedback-link">内容反馈邮箱：dream1296@outlook.com </span> 
            <!-- <span>运行时长：<span id="run-time"></span></span> | -->
            <!-- <span>总访问：<span id="total-visits"></span></span> |
            <span>今日访问：<span id="daily-visits"></span></span> -->
        </p>
        <p>© 2024-2025</p>
    </div>

    <div class="footer-info-pc">
        <span>ICP备案号：<a href="https://beian.miit.gov.cn" target="_blank">豫ICP备2025111164号</a></span>
        <span></span>
    </div>

</template>


<script setup lang="ts">
import { ref } from 'vue';
import { userStore } from '@/stores/userStore';
import { watch } from 'vue';

let userStoreData = userStore();

let isPc = ref(true);

let butt = ref(0);
let a = ref(true);


if (userStoreData.isPc === false) {
    isPc.value = false;
}

const props = defineProps<{
    show_num: number,
}>();

watch(props, (oldValue, newVal) => {
    if (newVal.show_num == 1) {
        butt.value = -25;
    }
    if(newVal.show_num == 2){
        butt.value = -25;
        a.value =false;
    }

})



</script>


<style lang="less" scoped>
@import "./footer.less";
</style>