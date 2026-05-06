<template>
    <div id="all" @click="closeContextMenu">
        <div id="root">
            <div
                v-for="value in showFileArr"
                :key="`${value.type}-${value.name}`"
                @contextmenu.prevent.stop="openContextMenu($event, value)"
            >
                <block :src="value.src" :name="value.name" :type="value.type" @click="blockClick(value)"></block>
            </div>
        </div>
        <div
            v-if="contextMenu.visible"
            class="context-menu"
            :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
            @click.stop
            @contextmenu.prevent
        >
            <button
                v-for="option in contextMenuOptions"
                :key="option.key"
                type="button"
                class="context-menu__item"
                @click="handleContextMenuOption(option.key)"
            >
                {{ option.label }}
            </button>
        </div>
    </div>

</template>


<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import block from '../components/listBlock/listBlock.vue';


import { useRoute } from 'vue-router'
import { getListArr, getListFile, getListImg, getListImgT, listVideo } from '@/api/api';
import { listSvgArr } from '../assets/svg/listSvgArr';
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
type contextMenuOption = {
    key: 'open' | 'download' | 'option2' | 'option3',
    label: string,
}

let showFileArr = ref<showFile[]>([]);

let listFileArr: listFile[] = [];

const contextMenuOptions = computed<contextMenuOption[]>(() => [
    contextMenu.value.file?.type == 'dir'
        ? { key: 'open', label: '打开' }
        : { key: 'download', label: '下载' },
    { key: 'option2', label: '选项二' },
    { key: 'option3', label: '选项三' },
]);

const contextMenu = ref<{
    visible: boolean,
    x: number,
    y: number,
    file: showFile | null,
}>({
    visible: false,
    x: 0,
    y: 0,
    file: null,
});


function openContextMenu(event: MouseEvent, file: showFile) {
    const menuWidth = 132;
    const menuHeight = contextMenuOptions.value.length * 36 + 8;
    const maxX = window.innerWidth - menuWidth - 8;
    const maxY = window.innerHeight - menuHeight - 8;

    contextMenu.value = {
        visible: true,
        x: Math.max(8, Math.min(event.clientX, maxX)),
        y: Math.max(8, Math.min(event.clientY, maxY)),
        file,
    };
}

function closeContextMenu() {
    contextMenu.value.visible = false;
}

function handleContextMenuOption(key: contextMenuOption['key']) {
    const file = contextMenu.value.file;
    closeContextMenu();

    if (!file) {
        return;
    }
    if (key == 'open') {
        blockClick(file);
        return;
    }
    if (key == 'download') {
        downloadListFile(file);
    }
}

function getFullPath(file: showFile) {
    return '/' + [...PathArr, file.name].filter(Boolean).join('/');
}

function downloadListFile(file: showFile) {
    if (file.type == 'dir') {
        return;
    }

    const a = document.createElement('a');
    a.href = getListFile(getFullPath(file));
    a.download = file.name;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function blockClick(e: showFile) {
    closeContextMenu();
    if (e.type == 'file') {

    }
    if (e.type == 'dir') {
        let path1 = '/list' + getFullPath(e);
        router.push({ path: path1 });
        return
    }
    if (e.type == 'img') {
        let path2 = getFullPath(e);
        let src = getListImg(path2);
        window.open(src, "_blank");
    }

    if (e.type == 'video') {
        let path2 = getFullPath(e);
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
        closeContextMenu();
        init();
    }
)

onMounted(() => {
    window.addEventListener('resize', closeContextMenu);
    window.addEventListener('scroll', closeContextMenu, true);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', closeContextMenu);
    window.removeEventListener('scroll', closeContextMenu, true);
});

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
    const svgFolder = encodeURIComponent(listSvgArr[index])
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

.context-menu {
    position: fixed;
    z-index: 1000;
    width: 132px;
    padding: 4px;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 10px 24px rgb(0 0 0 / 0.15);
}

.context-menu__item {
    width: 100%;
    height: 36px;
    padding: 0 12px;
    border: 0;
    border-radius: 4px;
    background-color: transparent;
    color: #1f2937;
    cursor: pointer;
    font-size: 14px;
    line-height: 36px;
    text-align: left;
}

.context-menu__item:hover {
    background-color: #f3f4f6;
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
