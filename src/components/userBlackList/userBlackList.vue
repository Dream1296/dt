<template>
    <div class="zhu" v-if="userList.length > 1">
        <div class="user-options">
            <n-checkbox v-model:checked="isAllChecked" label="全选" />
            <n-checkbox-group class="user-options-group" v-model:value="checkedUsers">
                <n-checkbox v-for="item in userList" :key="item.name" :value="item.name" :label="item.name" />
            </n-checkbox-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import { userList } from '@/dtData/getList';
import { computed } from 'vue'


const isAllChecked = computed({
    get() {
        return userList.value.length > 0 && userList.value.every(item => item.show)
    },
    set(value: boolean) {
        userList.value.forEach(item => {
            item.show = value
        })
    }
})


const checkedUsers = computed<string[]>({
    get() {
        return userList.value.filter(item => item.show).map(item => item.name)
    },
    set(value) {
        userList.value.forEach(item => {
            item.show = value.includes(item.name)
        })
    }
})


</script>



<style scoped lang="less">
@import url('@/assets/css/public.less');
@import "userBlackList.less";
</style>
