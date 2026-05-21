<template>

    <div class="zhu">
        <n-checkbox-group v-model:value="cities">
            <n-space item-style="display: flex;">
                <n-checkbox value="Beijing" label="视频" />
                <n-checkbox value="Shanghai" label="日常" />
                <!-- <n-checkbox value="Guangzhou" label="广州" /> -->
                <!-- <n-checkbox value="Shenzhen" label="深圳" /> -->
            </n-space>
        </n-checkbox-group>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const cities = ref(null)


</script>



<style scoped lang="less">
@import url('@/assets/css/public.less');
@import "tabOption.less";
</style>