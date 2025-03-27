<template>
    <div style="height: 50px;">

    </div>
    <van-field name="switch" label="开关">
        <template #input>
            <van-switch v-model="checked" />
        </template>
    </van-field>

    <van-field name="checkboxGroup" label="复选框组">
        <template #input>
            <van-checkbox-group v-model="groupChecked" direction="horizontal">
                <van-checkbox name="1" shape="square">复选框 1</van-checkbox>
                <van-checkbox name="2" shape="square">复选框 2</van-checkbox>
            </van-checkbox-group>
        </template>
    </van-field>

    <van-radio-group v-model="checkeds" direction="horizontal">
      <van-radio name="0">单选框 1</van-radio>
      <van-radio name="1">单选框 2</van-radio>
    </van-radio-group>


</template>


<script setup lang="ts">
import { ref } from 'vue';


let checked = ref(false);
let groupChecked = ref([]);
let checkeds = ref(0);



</script>



<style lang="less"></style>