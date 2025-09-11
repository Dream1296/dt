<template>
    <div v-html="renderedHtml" class="myMd">

    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
    data: string,
}>();


// markdown.ts 或组件中
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
    html: true,        // 支持 HTML 标签
    linkify: true,     // 自动识别链接
    typographer: true, // 替换引号等字符
    breaks: true       // 支持软换行
})


const renderedHtml = md.render(props.data)

</script>

<style>

.myMd {
    font-size:1rem;
     font-family: ui-sans-serif, -apple-system, system-ui, Segoe UI, Helvetica, Apple Color Emoji, Arial, sans-serif, Segoe UI Emoji, Segoe UI Symbol;

}

.myMd blockquote {
    position: relative;
}
 
.myMd hr {
    border-color: #0d0d0d0d;
}

.myMd blockquote::after {
    background-color: #00000026;
    border-radius: 2px;
    content: "";
    position: absolute;
    top: 0;
    width: 4px;
    height: 24px;
    left: -40px;
    border: 0 solid;
    box-sizing: border-box;
}

.myMd ul {
    /* list-style: disc; */
    list-style-type: none
}

.myMd li::before {
    content: "•";
    color: #5d5d5d;
    font-size: 20px;
    margin-right: 10px;
}

</style>
