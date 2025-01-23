<template>
    <div v-if="dtid != '-1'">
        <longTextShow :dtid="dtid"></longTextShow>
    </div>


</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import longTextShow from '@/components/LongTextShow/longTextShow.vue';

let dtid = ref("-1");
const route = useRoute();

dtid.value = route.query.id as string;

















</script>



<style lang="less" scoped></style>