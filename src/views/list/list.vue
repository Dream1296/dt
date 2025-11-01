<template>
    <div id="all">
        <div id="root">
            <div v-for="value in showFileArr">
                <block :src="value.src" :name="value.name" :type="value.type" @click="blockClick(value)"></block>
            </div>


        </div>
    </div>



</template>


<script lang="ts" setup>
import { ref, watch } from 'vue';
import block from './block.vue';


import { useRoute } from 'vue-router'
import { dtVideo, getListArr, getListImg, getListImgT, Internet, listVideo } from '@/api/api';
import { svgArr } from './svgArr';
import router from '@/router';
import { userStore } from '@/stores/userStore';

const route = useRoute()

const userStoreData = userStore();


let PathArr: string[] = [];

// type 0为文件夹，1为图片, 2为视频， 其他为3
type listFile = {
    name: string,
    type: 0 | 1 | 2 | 3,
    hash: string,
}
type showFile = {
    name: string,
    src: string,
    type: 'dir' | 'img' | 'video' | 'file'
}

let showFileArr = ref<showFile[]>([]);

let listFileArr: listFile[] = [];





function blockClick(e: showFile) {
    if (e.type == 'file') {

    }
    if (e.type == 'dir') {
        let path1 = '/list/' + PathArr.join('/') + `/${e.name}`;
        router.push({ path: path1 });
        return
    }
    if (e.type == 'img') {
        let path2 = '/' + PathArr.join('/') + '/' + e.name;
        let src = getListImg(path2);
        window.open(src, "_blank");
    }

    if (e.type == 'video') {
        let path2 = '/' + PathArr.join('/') + '/' + e.name;
        // encodeURIComponent

        let src = listVideo(path2);
        if (userStoreData.isPc) {
            window.open(src, '_blank');
            return
        }
        router.push({
            path: '/videoPlay', query: {
                dtid: -2,
                index: encodeURIComponent(src)
            }
        });
    }

}

watch(
    () => route.params.pathMatch, // 监听 params 的 pathMatch
    (newPath) => {
        init();
    }
)

async function init() {
    PathArr = Array.isArray(route.params.pathMatch) ? route.params.pathMatch.filter(Boolean) : [];
    showFileArr.value.length = 0;
    listFileArr.length = 0;
    if (PathArr) {
        let pathStr = '/' + PathArr.join('/');
        listFileArr = (await getListArr(pathStr)).data;
        for (let file of listFileArr) {
            let a: showFile = {
                name: file.name,
                src: getUrl(1),
                type: 'file',
            }
            if (file.type == 0) {
                a.src = getUrl(0)
                a.type = 'dir';
            }
            if (file.type == 3) {
                a.src = getUrl(1)
                a.type = 'file';
            }
            if (file.type == 1) {
                a.src = getListImgT(pathStr, file.hash);
                a.type = 'img';
            }
            if (file.type == 2) {
                a.src = getListImgT(pathStr, file.hash);
                a.type = 'video';
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

#videoIco {
    width: 100%;
    height: 100%;
    position: absolute;

    img {
        width: 100%;
        height: 100%;
    }
}
</style>