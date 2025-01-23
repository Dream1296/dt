<template>
    <div v-html="data">

    </div>

</template>


<script setup lang="ts">
import { getLongText } from '@/api/api';
import { ref } from 'vue';


let data = ref("<h1>正在加载</h1>");

const props = defineProps<{
    dtid: string,
}>();


getLongText(props.dtid)
    .then(res => {
        data.value = res.data.data;
    })






</script>



<style lang="less" scoped></style>