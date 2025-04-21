<template>
  <!-- <StatusBar></StatusBar> -->
    <router-view v-slot="{ Component, route }">
      <keep-alive include="DtComponent,DtAllComponent">
        <component :is="Component" />
      </keep-alive>
    </router-view>

    

    

</template>
  



<script setup lang="ts">
import StatusBar from './components/StatusBar/StatusBar.vue';



</script>

<style scoped lang="less">


</style>