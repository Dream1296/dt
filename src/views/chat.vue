<template>
    <div id="wenzhang">
        <div v-for="(data, item) in vList" :key="data.id" class="kuai">
            <div v-if="(data.content != ' ' && data.content != '') || isKunjian(data?.id)"
                :class="{ 'user': data.author == 'user', 'assistant': data.author == 'assistant' }">
                <div>
                    {{ data.author }}--{{ showDate(data.date) }} -- {{ data.id }}
                </div>

                <ChatDiv v-if="data" :data="data.content"></ChatDiv>

                <div v-if="isKunjian(data?.id)">

                    <n-tabs type="segment" animated @:value="getNodeIndex(data?.id, 0)"
                        @update:value="(val: string) => updataFn(data.id, val)">
                        <n-tab-pane :name="`${value as number - 1}`" :tab="printxuan(data?.id, value as number)"
                            v-for="value in getNodeIndex(data?.id, 1)">
                        </n-tab-pane>
                    </n-tabs>

                </div>
            </div>

        </div>
        <hr class="myHr">
        <div>
            <div class="note-card">
                <div class="note-ribbon">🌟 小纸条 · Article Note</div>
                <div class="note-content">
                    <div class="note-row">
                        <span class="note-label">🧩 会话ID</span>
                        <span class="note-value"> {{ about?.id }}</span>
                    </div>
                    <div class="note-row">
                        <span class="note-label">📅 写作时间</span>
                        <span class="note-value"> {{ about?.create_time }}</span>
                    </div>
                    <div class="note-row">
                        <span class="note-label">🗂 标签</span>
                        <span class="note-value">{{ about?.tag }}</span>
                    </div>
                    <div class="note-row">
                        <span class="note-label">🧩 账号</span>
                        <span class="note-value"> {{ about?.account }}</span>
                    </div>
                    <div class="note-row">
                        <span class="note-label">🔐 可见性</span>
                        <span class="note-value">仅自己可见</span>
                    </div>
                </div>
            </div>
        </div>
    </div>



</template>

<script setup lang="ts">
import { getChatNode } from '@/api/api';
import ChatDiv from '@/components/chatDiv/chatDiv.vue';
import { computed, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import '@fortawesome/fontawesome-free/css/all.min.css'

const route = useRoute();

type nodeT = {
    id: string,
    parent_id: string,
    author: string,
    content: string,
    date: string,
    model_slug: string,
}

type About = {
    id: string;
    title: string;
    create_time: string;
    update_time: string;
    account: string;
    tag: string;
    nodeList: nodeT[]
}

let about = ref<About>();



let list: nodeT[] = [];
let vList = ref<nodeT[]>([]);

// let rootId = route.query.id as string;

const rootId = computed(() => route.params.id as string).value;




//第1个为当前选择的，第2个为总数
let nodeIndex = new Map<string, {
    index: Ref<number>,
    size: number,
    branchSizes: number[]
}>();

if (rootId) {

    init();
}

function getNodeIndex(id: string, index?: 0 | 1 | 2) {
    if (!nodeIndex.has(id)) {
        console.error('查询到无法查询的节点');
        return undefined;
    }
    if (index == 0) {
        return nodeIndex.get(id)!.index as Ref<number>;
    }
    if (index == 1) {
        return nodeIndex.get(id)!.size as number;
    }
    if (index == 2) {
        return nodeIndex.get(id)!.branchSizes as number[];
    }

    return nodeIndex.get(id) as {
        index: Ref<number>,
        size: number,
        branchSizes: number[]
    }
}

function isKunjian(id: string | undefined) {
    if (!id) {
        return false;
    }
    if (!nodeIndex.has(id)) {
        return false;
    }
    let size = nodeIndex.get(id)!.size;
    if (size > 1) {
        return true;
    }
    return false;

}

function printxuan(id: string, val: number) {
    let numArr = getNodeIndex(id) as {
        index: Ref<number>;
        size: number;
        branchSizes: number[];
    };

    let str = `选择${val}`

    str += `  ${numArr.branchSizes[val - 1]} `
    return str;
}

async function init() {
    let data = await getChatNode(rootId);



    about.value = data;
    document.title = data.title;
    list = data.nodeList;

    vList.value.push(list[0]);

    // nodeIndex.set(rootId, [ref(0), 1]);
    computeBranchSize(rootId);

    xuanran(rootId);
    console.log(nodeIndex);
}

function getFuNode(id: string) {
    let arr = list.filter(obj => obj.parent_id == id);
    return arr;
}

function computeBranchSize(id: string): number {
    let children = getFuNode(id);
    const childCount = children.length;
    if (children.length == 0) {
        // 叶子节点 → 子树大小为 0
        nodeIndex.set(id, {
            index: ref(0),
            size: 0,
            branchSizes: [-1],
        });
        return 0;
    }
    // 对每个子节点递归计算子树大小
    const sizes = children!.map(child => computeBranchSize(child.id));

    // 每个子节点的分支大小 = 子树大小 + 1（加上自己）
    const branchSizes = sizes!.map(s => s + 1);
    // 更新 nodeIndex
    // const currentValue = nodeIndex.get(id);
    nodeIndex.set(id,
        {
            index: ref(0),
            size: childCount,
            branchSizes: branchSizes,
        }
    );

    // 当前节点的子树大小 = 所有子节点的(自身+子树大小)之和
    return branchSizes.reduce((sum: number, n: number) => sum + n, 0);


}



function xuanran(id: string) {

    let list1 = getFuNode(id);

    if (list1.length == 0) {
        return
    }

    if (nodeIndex.has(id)) {
        let index = nodeIndex.get(id)!.index;
        vList.value.push(list1[index.value]);
        xuanran(list1[index.value].id);
    } else {
        nodeIndex.set(id, {
            index: ref(0),
            size: list1.length,
            branchSizes: [-1],
        });
        vList.value.push(list1[0]);
        xuanran(list1[0].id);
    }
}


function updataFn(data: string, val: string) {

    if (!nodeIndex.has(data)) {
        return
    }
    let oldNode = nodeIndex.get(data)!;
    nodeIndex.set(data, {
        index: ref(Number(val)),
        size: oldNode.size,
        branchSizes: oldNode.branchSizes,
    });
    vList.value.length = 0;
    vList.value.push(list[0]);
    xuanran(rootId);

    console.log(data, val);



}


function showDate(date: string) {
    let date1 = new Date(date);
    let str = '';
    str = date1.getFullYear().toString();
    str += '-' + (date1.getMonth() + 1).toString().padStart(2, '0');
    str += '-' + date1.getDate().toString().padStart(2, '0');
    str += ' ' + date1.getHours().toString().padStart(2, '0');
    str += ':' + date1.getMinutes().toString().padStart(2, '0');
    return str;

}



import { onMounted, onBeforeUnmount } from 'vue'

const customViewport = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
const defaultViewport = 'width=device-width, initial-scale=1.0'

onMounted(() => {
    const meta = document.querySelector('meta[name="viewport"]')
    if (meta) {
        meta.setAttribute('content', customViewport)
    }
})

onBeforeUnmount(() => {
    const meta = document.querySelector('meta[name="viewport"]')
    if (meta) {
        meta.setAttribute('content', defaultViewport)
    }
})





</script>

<style scoped>
.kuai {
    /* border: 1px red solid; */
    max-width: 100%;
    /* margin-top: 10px; */
    /* margin-bottom: 20px; */
    margin-left: 10px;
    margin-right: 10px;
}

@media (min-width: 768px) {
    .kuai {}

    #wenzhang {
        margin-top: 3%;
        margin-left: 16%;
        margin-right: 16%;
        margin-bottom: 5%;
        padding: 2%;
        border-radius: 8px;
        -webkit-box-shadow: 0 4px 8px 6px rgba #07111b0f (7, 17, 27, 0.06);
        box-shadow: 0 4px 8px 6px rgba(7, 17, 27, 0.06);
        transition: all 0.5s;
    }

    #wenzhang:hover {
        -webkit-box-shadow: 0 4px 12px 12px rgba(7, 17, 27, 0.15);
        box-shadow: 0 4px 12px 12px rgba(7, 17, 27, 0.15);
    }
}

.myHr {
    position: relative;
    margin: 2rem auto;
    border: 2px dashed #fbcddc;
    width: calc(100% - 4px);
    box-sizing: content-box;
    height: 0;
    overflow: visible;
}

.myHr::before {
    position: absolute;
    top: -10px;
    left: 5%;
    z-index: 1;
    color: #f9b9cf;
    content: '\f0c4';
    font-size: 20px;
    line-height: 1;
    display: inline-block;
    font-weight: 600;
    font-style: normal;
    font-variant: normal;
    font-family: 'Font Awesome 5 Free';
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
}



.user {
    background-color: blanchedalmond;
    padding: 1%;
    border-radius: 2%;
}

.assistant {
    /* background-color: aqua; */
}










.note-card {
    max-width: 600px;
    ;
    margin: 3rem auto 2rem;
    background: #fffdfd;
    border: 2px dashed #ffd3dc;
    border-radius: 16px;
    box-shadow: 0 4px 8px rgba(255, 174, 201, 0.3);
    padding: 1.5rem;
    position: relative;
    font-family: 'Segoe UI', 'Quicksand', sans-serif;
    color: #555;
    transition: transform 0.3s ease;
}



.note-ribbon {
    position: absolute;
    top: -1rem;
    left: 1rem;
    background: #ffb6c1;
    color: white;
    font-size: 13px;
    font-weight: bold;
    padding: 0.3rem 0.8rem;
    border-radius: 10px;
    box-shadow: 1px 2px 5px rgba(255, 192, 203, 0.4);
}

.note-content {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.note-row {
    height: 30px;
    display: flex;
    background: rgba(255, 245, 248, 0.8);
    padding: 0.5rem 1rem;
    border-radius: 10px;
    justify-content: space-between;
}

.note-label {
    font-size: 12px;
    line-height: 30px;
    font-weight: bold;
    color: #d16d8f;
}

.note-value {
    font-size: 12px;
    line-height: 30px;
    font-family: 'Courier New', monospace;
    color: #444;
    text-align: right;
    word-break: break-word;
}
</style>
