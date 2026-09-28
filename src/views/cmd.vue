<template>
        <n-switch v-model:value="upDtImgTempT" :rail-style="railStyle">
            <template #checked>
                当前: 覆盖
            </template>
            <template #unchecked>
                当前: 追加
            </template>


        </n-switch>
        <n-button type="primary" :disabled="upDtImgTempRend" @click="updateCache">
            更新缓存目录列表
        </n-button>


</template>



<script setup lang="ts">
import { ref } from "vue";
import { upDtImgTemp } from "@/api/api";
import type { CSSProperties } from "vue";
let upDtImgTempRend = ref(false);
let upDtImgTempT = ref(false);


function updateCache() {
    upDtImgTempRend.value = true;
    let t = upDtImgTempT.value ? "0" : "1";
    upDtImgTemp(t as "0" | "1");
}

function railStyle({
  focused,
  checked
}: {
  focused: boolean
  checked: boolean
}) {
  const style: CSSProperties = {}
  if (checked) {
    style.background = '#d03050'
    if (focused) {
      style.boxShadow = '0 0 0 2px #d0305040'
    }
  }
  else {
    style.background = '#2080f0'
    if (focused) {
      style.boxShadow = '0 0 0 2px #2080f040'
    }
  }
  return style
}








</script>




<style lang="less"></style>