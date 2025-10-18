<template>
    <div id="all">
        <div id="root">
            <block v-for="value in showFileArr" :src="value.src" :name="value.name"></block>
        </div>

    </div>



</template>


<script lang="ts" setup>
import { ref } from 'vue';
import block from './block.vue';


import { useRoute } from 'vue-router'
import { getListArr } from '@/api/api';
import { svgArr } from './svgArr';

const route = useRoute()

// 获取完整路径字符串，比如 "root/a/b"
const currentPath = route.params.pathMatch;
let PathArr = Array.isArray(currentPath) ? currentPath.filter(Boolean) : [];

// type 0为文件夹，1为图片, 2为视频， 其他为3
type listFile = {
    name: string,
    type: 0 | 1 | 2 | 3
}
type showFile = {
    name: string,
    src: string,
    isDir: boolean,
}

let showFileArr = ref<showFile[]>([]);

let listFileArr: listFile[] = [];

async function init() {

    if (PathArr) {
        let pathStr = '/' + PathArr.join('/');
        listFileArr = (await getListArr(pathStr)).data;
        for (let file of listFileArr) {
            let a: showFile = {
                name: file.name,
                src: getUrl(1),
                isDir: false,
            }
            if (file.type == 0) {
                a.src = getUrl(0)
                a.isDir = true;
            }
            if (file.type == 3) {
                a.src = getUrl(1)
            }
            showFileArr.value.push(a);
        }
    }
}

init();









function getUrl(index: number) {
    const svgFolder = encodeURIComponent(svgArr[index])
    return `data:image/svg+xml;utf8,${svgFolder}`
}




</script>


<style scoped lang="less">
#all {
    display: flex;
    margin-top: 121px;
    // flex-wrap: wrap;
    justify-content: center;
}

#root {
    width: 940px;
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: center;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
    background-color: white;
    padding: 0.5rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.09), 0 4px 6px -4px rgb(0 0 0 / 0.1);

    --hope-colors-background: #f7f8fa;

}
</style>