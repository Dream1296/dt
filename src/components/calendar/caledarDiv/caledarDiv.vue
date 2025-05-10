<template>
    <div id="block">
        <div id="date">
            <div id="dateNum">
                {{ dateNum }}
            </div>
            <div id="date2Num">
                {{ chineseDate }}
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    date: { y: number, m: number, d: number },
}>();

let dateNum = props.date.d;
let chineseDate = '初三'




</script>


<style lang="less" scoped>
#block {
    width: 13vw;
    height: calc(13vw * 0.75);
    border: 1px solid rgb(242, 242, 242);

}

#date {
    display: flex;
}

#dateNum {
    font-size: 20px;
    font-weight: 600;
    margin-left: 2px;

}

#date2Num {
    font-size: 11px;
    font-weight: 400;
    line-height: 23px;
    margin-left: 5px;
}
</style>