<template>
    <div class="shhuru">
        <textarea ref="textarea" v-model="textareaValue" @input="textInputHeightAuto"></textarea>
        <van-button @click.stop="up" type="primary" :disabled="disabled">发送</van-button>
    </div>

</template>


<script setup lang="ts">
import { computed, ref } from 'vue';


const textarea = ref<HTMLTextAreaElement>();
let textareaValue = ref('');
const emit = defineEmits(['up'])


const props = defineProps<{
    disabled?: boolean,
}>();

const disabled = computed(() => props.disabled ?? false);



// 自动调整 textarea 高度
const textInputHeightAuto = () => {
    const textareas = textarea.value;
    if (textareas == null) {
        return
    }
    // 重置高度以便重新计算
    textareas.style.height = 'auto';
    // 设置新的高度，确保文本框不小于最小高度
    textareas.style.height = Math.max((textareas.scrollHeight + 40), 150) + 'px';
};

function up() {
    emit('up', textareaValue.value);
}




</script>


<style scoped lang="less">
@import url('./commentInput.less');
</style>