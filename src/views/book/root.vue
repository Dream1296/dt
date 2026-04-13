<template>
    <div id="all" @touchstart="startTouch" @touchmove="moveTouch" @touchend="endTouch">

        <!-- 书架 -->
        <div>
            <div class="a" style="height: 120px;">
                <img src="./../../assets/book/shujia1.png">
            </div>

            <div class="a" v-for="a in vData">
                <img src="./../../assets/book/book2.png">
                <div class="b">

                    <div @click="toPage(b.bookId, b.bookName)" v-for="b in a" :class="{ c: b.bookId == '#' }">
                        <img :src="b.src">
                    </div>

                </div>
            </div>

            <div class="a" v-for="a in 3">
                <img src="./../../assets/book/book2.png">
            </div>

        </div>

    </div>
    <div id="di">这里可以加点东西</div>

</template>


<script setup lang="ts">

import { useRouter } from 'vue-router';
const router = useRouter();

// 路由切换
const toPage = (bookid: string, bookName: string) => {
    console.log(bookid);

    if (bookid == '#') {
        return
    }
    dataV.bookId = bookid;
    dataV.bookName = bookName;
    const url = '/book/' + bookid;
    router.replace(url);
}

//页面交换数据
import { bookDatas } from './stores/book';
const dataV = bookDatas();

//获取列表数据
import { getBookList, getImg } from './book';
import { ref } from 'vue';

//视图数据
let vData = ref<D[][]>([]);

//每行最多显示多少个
let max = 3;
getBookList()
    .then((data) => {
        let i = 0;
        let arr = <D[]>[];
        for (let j = 0; j < data.length; j++) {
            arr.push({
                bookId: data[j].id,
                bookName: data[j].name,
                src: getImg(data[j].id),
            })

            if (arr.length == max) {
                vData.value.push([...arr]);
                arr = [];
            }
            else if (j == data.length - 1 && arr.length != 0) {
                vData.value.push([...arr]);
                arr = [];
            }
        }
        let acs = vData.value[vData.value.length - 1].length;
        if (acs < max) {
            for (let i = 0; i < max - acs; i++) {
                vData.value[vData.value.length - 1].push({
                    bookId: '#',
                    bookName: '#',
                    src: '#',
                })
            }
        }



    })


type D = {
    bookId: string,
    bookName: string,
    src: string,
}

const dian = (e: any) => {
    e.preventDefault();
}

let startX: number;
let startY: number;
let startYs: number = 0;
// let page = ref(window.pageYOffset);
let page = 0;
let ydsStart = 0;

function yds(cha: number) {
    let times = +new Date();
    if (times - ydsStart > 16) {
        ydsStart = +new Date();

        window.scrollTo(0, page + cha);
        page = page + cha;
    }


}


function startTouch(e: any) {
    if (e.touches.length == 1) {
        startX = e.touches[0].clientX; // 记录起始触摸点的X坐标  
        startY = e.touches[0].clientY;
    }
}

function moveTouch(e: any) {
    // e.preventDefault(); // 阻止默认行为 
    if (e.touches.length == 1) {
        let moveX = e.touches[0].clientX; // 当前触摸点的X坐标  
        let moveY = e.touches[0].clientY; // 当前触摸点的X坐标  
        let diffX = moveX - startX; // 计算X轴方向上的移动距离  
        let diffY = moveY - startY;

        if (Math.abs(diffY) > Math.abs(diffX)) {
            return
        }
        e.preventDefault();


        // let a = 0;
        // // 下一页
        // let ydnum = 0;
        // ydnum = diffY - startYs;
        // startYs = ydnum;
        // console.log(diffY,startYs);

        // yds(-Math.floor(ydnum / 1.2));
    }
}

function endTouch(e: any) {
    startYs = 0;
}


</script>

<style scoped>
@import './root.css'
</style>
