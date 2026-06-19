<template>

    <div class="zhu">
        <div class="tab-options">
            <n-checkbox v-model:checked="isAllChecked" label="全选" />
            <n-checkbox-group class="tab-options-group" v-model:value="checkedTabs">
                <n-checkbox v-for="item in tabList" :key="item.name" :value="item.name" :label="item.name" />
            </n-checkbox-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import { tabList } from '@/dtData/getList';
import { computed } from 'vue'


const isAllChecked = computed({
    get() {
        return tabList.value.length > 0 && tabList.value.every(item => item.show)
    },
    set(value: boolean) {
        tabList.value.forEach(item => {
            item.show = value
        })
    }
})


const checkedTabs = computed<string[]>({
    get() {
        return tabList.value.filter(item => item.show).map(item => item.name)
    },
    set(value) {
        tabList.value.forEach(item => {
            item.show = value.includes(item.name)
        })
    }
})




</script>



<style scoped lang="less">
@import url('@/assets/css/public.less');
@import "tabOption.less";
</style>
