<template>
    <router-view v-slot="{ Component, route }">
      <keep-alive include="DtComponent,DtAllComponent">
        <component :is="Component" />
      </keep-alive>
    </router-view>

</template>
  



<script setup lang="ts">




</script>

<style scoped lang="less"></style>