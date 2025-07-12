<template>
    <div v-html="props.data">

    </div>

</template>


<script setup lang="ts">
import { computed } from 'vue';



const props = defineProps<{
    data: string,
}>();










</script>



<style>

</style>