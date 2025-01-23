<template>
    <div>
        <!-- 头像 -->
        <div class="touxian">
            <img :src="props.touxianSrc"></img>
        </div>
        <!-- 名字 -->
        <div class="name">
            <span>{{ props.name }} #{{ props.dtid }}</span>
        </div>
    </div>




</template>


<script setup lang="ts">
import type { A } from '@/type/dtType';


//获取父组件传入数据
const props = defineProps<{ touxianSrc:string,name:string,dtid:string }>();

</script>


<style lang="less" scoped>
@import url('./topView.less');

</style>
