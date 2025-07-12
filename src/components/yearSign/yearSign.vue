<template>

<div id="allyear">
     <h3>{{ props.year }}</h3>
      <img :src="yearUrl">
</div>

</template>

<script setup lang="ts" >
import { getYearImg } from '@/api/api';
import { ref } from 'vue';

 

const props = defineProps<{ year:number }>();

let yearUrl = ref('../../assets/img/img_load.webp');

yearUrl.value = getYearImg(props.year);

</script>

<style scoped lang="less">
@import './yearSign.less';
</style>