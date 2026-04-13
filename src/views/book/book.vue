<template>
    <div id="all" @click.prevent="dian" @touchstart="startTouch" @touchmove="moveTouch" @touchend="endTouch">

        <!-- 上页面 -->
        <div class="content" v-show="!showUp">
            <div style="height: 30px;"></div>
            <div class="d" v-for=" a in setData(start - 21)">
                <span :class="{ f: b == ' ', e: a.id_up == playId && b != ' ' }" v-for="b in a.text">{{ b }}</span>

            </div>
        </div>


        <!-- 下一页 -->
        <div class="content" v-show="showUp">
            <div style="height: 30px;"></div>
            <div class="d" v-for=" a in setData(start + 21)">
                <span :class="{ f: b == ' ', e: a.id_up == playId && b != ' ' }" v-for="b in a.text">{{ b }}</span>
            </div>

        </div>
        <!-- 显示页面 -->
        <!-- :style="{ opacity: tmd }" -->
        <div class="content" :style="{ 'transform': `translate(${yd}%, -50%)` }">
            <div style="height: 30px;"> {{ dataV.bookName }} </div>
            <div class="d" v-for=" a in setData(start)">
                <span :class="{ f: b == ' ', e: a.id_up == playId && b != ' ' }" v-for="b in a.text">{{ b }}</span>
               
            </div>
        </div>


        <!-- 页数信息 -->
        <div id="bo">
            {{ getPage() + 1 }} /{{ Math.floor(vData.length / max) + 1 }} ({{ (((getPage() + 1) /
                (Math.floor(vData.length / max) + 1)) * 100).toFixed(2) }}%)
        </div>

        <div id="date">
            {{ time_h }}:{{ time_min }}
        </div>

    </div>
    
    <div id="ac" v-show="showkz" :style="{ top: acTop + '%' }">
        <!-- 看书状态 -->
        <div class="acc" v-show="!isAuPlay">

            <div class="acs" @click="cc">
                <div v-html="tingshuSvg"></div>
                <div>听书</div>
            </div>

            <div class="acs" @click="showfy = true; showkz = false">
                <div v-html="fangshuSvg"></div>
                <div>翻书</div>
            </div>

            <div class="acs" style=" width: 100px;background-color: snow;">
                <div class="tu">
                    <img src="../../assets/book/readBook1.gif">
                </div>
            </div>


            <div class="acs" @click="toPage('/bookShelf')">
                <div v-html="exitSvg"></div>
                <div>离开</div>
            </div>

            <div class="acs">
                <div v-html="fangshuSvg"></div>
                <div>看书</div>
            </div>
        </div>

        <!-- 听书状态 -->
        <div class="acc" v-show="isAuPlay">

            <div class="acs" @click="acc">
                <div v-html="tingshuSvg"></div>
                <div style=" font-size: 12px;">回到播放页</div>
            </div>

            <div class="acs" @click="bfup">
                <div v-html="fangshuSvg"></div>
                <div>上一段</div>
            </div>

            <div class="acs" style=" width: 100px;background-color: snow;">
                <div class="tu" style="    margin-top: 40%;">
                    <img src="../../assets/book/auPlay.gif">
                </div>
            </div>


            <div class="acs" style=" font-size: 12px;" @click="exitCC">
                <div v-html="exitSvg"></div>
                <div>退出听书</div>
            </div>

            <div class="acs" @click="bfbo">
                <div v-html="fangshuSvg"></div>
                <div>下一段</div>
            </div>
        </div>
    </div>

    <!-- 翻书 -->
    <div id="fangshu" v-show="showfy">
        <div id="fangshuQie">
            <div>
                跳转
            </div>
            <div>
                目录
            </div>
            <div>
                书签
            </div>
        </div>
        <div id="inputs">
            <input v-model="fpage">
            <button @click="jpage(fpage)">跳转</button>
            <div class="anjian">
                <div v-for="a in jianpan" @click="bnts(a)">
                    {{ a }}
                </div>
            </div>
        </div>


    </div>




</template>
<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';



let vData:B[] = [];

//当前页面最上显示行数id
let start = ref<number>(0);

//页面交换数据
import { bookDatas } from '../../stores/book';
const dataV = bookDatas();

// 从qury中的/book/:id中的：id中获取id数据
import { useRoute } from 'vue-router';
const route = useRoute();
let bookId = route.params.id as string;
dataV.bookId = bookId;



// //当前页面数
// let page = ref(0);

//最大页数
// let pageMax = 0;

//一页显示的最多行数
let max = 21;

//是否为播放状态
let isAuPlay = ref(false);

//音频数据
import { AuData } from './AuData';

AuData.bookId = dataV.bookId;

//图标
import { tingshuSvg, fangshuSvg, exitSvg } from './svgArr';

//数据类型
import { type A, type B } from './type';

//获取数据
import { getData } from './getBookText';
// let datas = <B[]>[];
getData(dataV.bookId)
    .then(data => {
        // datas = data
        // console.log(datas);
        
        // vData.push(...data)
        data.forEach((e)=>{
            vData.push(e)
        })
        start.value++;
        start.value--;

    })


const au = new Audio(); 

import { useRouter } from 'vue-router';
const router = useRouter();

// 路由切换
const toPage = (url: string) => {
    router.replace(url);
}



type L = {
    bookId: string,
    start: number,
}

// //获取本地存储的数据
// if (localStorage.getItem('start')) {
//     let dataLo: L[] = JSON.parse(localStorage.getItem('start') as string);
//     dataLo.forEach(e => {
//         if (e.bookId == dataV.bookId) {
//             start.value = e.start;
//         }
//     })
// }
//从服务器获取进度
import { getJd } from './book';
getJd(dataV.bookId, '-1')
    .then(data => {
        start.value = Number(data);
    })





//获取页数
function getPage() {
    return Math.floor(start.value / max);
}

let jianpan = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '<-'
]

//翻页
let showfy = ref(false);
let fpage = ref(0);
const bnts = (num: string) => {
    if (num == '*' ) {
        return
    }
    if(num == '<-'){
        if( fpage.value > 10){
            fpage.value =Math.floor( fpage.value / 10);
        }
        return
    }

    fpage.value = fpage.value * 10 + Number(num);
}

const tz = (num: number) => {
    start.value = num * max;
}




//跳转页数
function jpage(num: number) {
    if (num > (Math.floor(vData.length / max) + 1)) {
        return fpage.value = 0;
    }
    start.value = (num - 1) * max;
}


//跳转到正常播放的页面
function acc() {

    let a = vData.find(obj => obj.id_up == playId.value)?.id;
    if (!a) {
        return
    }

    start.value = Math.floor(a / max) * max;
}



//上一页
const up = () => {
    if (start.value - max < 0) {
        return
    }
    start.value -= max;
}
//下一页
const bu = () => {
    if (start.value + max > vData.length) {
        return
    }
    start.value += max;
}

// watch(start, (newQuestion, oldQuestion) => {
//     let a = <L[]>[];

//     if (localStorage.getItem('start')) {
//         a = JSON.parse(localStorage.getItem('start') as string);
//     } else {
//         a = [{
//             bookId: dataV.bookId,
//             start: newQuestion,
//         }]
//     }

//     if (a.length == 0) {

//         a = [{
//             bookId: dataV.bookId,
//             start: newQuestion,
//         }]
//     }
//     console.log(a);

//     let isFind = false;
//     for (let i = 0; i < a.length; i++) {
//         if (a[i].bookId == dataV.bookId) {
//             isFind = true;
//             a[i].start = newQuestion;
//         }
//     }
//     if (!isFind) {
//         a.push({
//             bookId: dataV.bookId,
//             start: newQuestion,
//         });
//     }

//     localStorage.setItem('start', JSON.stringify(a));
// }
// )

//防抖
let jdSet: any;
//时间间隔
const jdTime = 1 * 1000;
watch(start, (newQuestion, oldQuestion) => {
    if (jdSet) {
        clearTimeout(jdSet);
    }
    jdSet = setTimeout(() => {
        getJd(dataV.bookId, newQuestion.toString())
    }, jdTime)
})




let ydA: any;


//控制组件
let showkz = ref(false);
let acTop = ref(50);
let acTopmin = 66;



const dian = (e: any) => {
    // e.preventDefault(); // 阻止默认行为 
    //判断是否显示
    if (acTop.value != 100) {
        acTop.value = 100;
        setTimeout(() => {
            showkz.value = false;
        }, 310);
        return
    }

    if (showfy.value) {
        showfy.value = false;
    }


    if (e.pageX < 60) {
        showUp.value = false;
        if (ydA) {
            clearInterval(ydA);
            yd.value = -50;
        }
        yd.value = -50;
        ydA = setInterval(() => {
            if (yd.value == 50) {
                clearInterval(ydA);
                yd.value = -50;
                up();
                return
            }
            yd.value += 10;
        }, 33);
    }
    if (e.pageX > 280) {
        showUp.value = true;
        if (ydA) {
            clearInterval(ydA);
            yd.value = 50;
        }
        yd.value = -50;
        ydA = setInterval(() => {
            if (yd.value == -150) {
                clearInterval(ydA);
                yd.value = -50;
                bu();
                return
            }
            yd.value -= 10;
        }, 33);
    }
    if (!(e.pageX < 60) && !(e.pageX > 280)) {
        showkz.value = true;

        setTimeout(() => {
            acTop.value = acTopmin;
        }, 0);
    }

}

const setData = (a: number) => {
    return vData.slice(a, a + max);
}










let startX: number;
let isLR = '';
//当前页面透明度
// let tmd = ref(1);
let yd = ref(-50);
let showUp = ref(true);

function startTouch(e: any) {
    if (e.touches.length == 1) {
        startX = e.touches[0].clientX; // 记录起始触摸点的X坐标  
    }
}

//防抖
let timestart = +new Date();
let time2 = 16 * 1;
function moveTouch(e: any) {
    e.preventDefault(); // 阻止默认行为 
    if ((+new Date()) - timestart >= time2) {
        moveTouchs(e);
        timestart = +new Date();
    }
}

function moveTouchs(e: any) {

    if (e.touches.length == 1) {
        let moveX = e.touches[0].clientX; // 当前触摸点的X坐标  
        let diffX = moveX - startX; // 计算X轴方向上的移动距离  
        let a = 0;
        // 下一页
        if (diffX < 0) {

            // 0  - 100
            //  -50  -150
            showUp.value = true;
            if (diffX <= -100) {
                yd.value = -150;
            } else {
                yd.value = -50 + diffX;
            }

        }
        // 上一页
        if (diffX > 0) {
             
            showUp.value = false;
            if (diffX >= 100) {
                yd.value = 150;
            }
            yd.value = -50 + diffX
        }


        isLR = '';
        if (diffX < -45) {
            isLR = 'R';
        }
        if (diffX > 45) {
            isLR = 'L';
        }




    }
}

function endTouch(e: any) {


    if (isLR == 'R') {
        bu();
    }
    if (isLR == 'L') {
        up();
    }

    // tmd.value = 1;
    yd.value = -50;

    //判断是否显示
    if (acTop.value != 100 && (isLR == 'R' || isLR == 'L')) {
        acTop.value = 100;
        setTimeout(() => {
            showkz.value = false;
        }, 310);
        return
    }

    isLR = '';




}

//当前播放的段落id
let playId = ref(-1);

//开始播放，从本页开始。
async function cc() {
    //切换为听书状态
    {
        isAuPlay.value = true;
    }

    //关闭控制栏
    {
        acTop.value = 100;
        setTimeout(() => {
            showkz.value = false;
        }, 310);
    }
    playId.value = vData[start.value].id_up;
    const url = (await AuData.getAuData(playId.value)).url;

    au.src = url;
    au.play();
    au.onended = async () => {
        playId.value++;
        const url = (await AuData.getAuData(playId.value)).url;
        au.src = url;
        au.play();

        isfy();
    }
}

const exitCC = () => {
    isAuPlay.value = false;
    au.pause();
    playId.value = -1;
}

const bfbo = async () => {
    playId.value++;
    const url = (await AuData.getAuData(playId.value)).url;
    au.src = url;
    au.play();

    isfy();
}

const bfup = async () => {
    if (playId.value == 1) {
        return
    }
    playId.value--;
    const url = (await AuData.getAuData(playId.value)).url;
    au.src = url;
    au.play();

    isfy();
}

//判断是否翻页
const isfy = () => {

    let arr = vData.find(obj => obj.id_up == playId.value) as B;
    let min = arr.id;
    if (arr.text = ' ') {
        min++;
    }

    if (min >= start.value + max) {
        bu();
    }
}










//状态栏时间
let time_min = ref('');
let time_h = ref('');
time_h.value = (new Date).getHours().toString();
time_min.value = (new Date).getMinutes().toString();
if ((new Date).getMinutes() < 10) {
    time_min.value = '0' + time_min.value;
}
let timedhl = setInterval(() => {
    time_h.value = (new Date).getHours().toString();
    time_min.value = (new Date).getMinutes().toString();
    if ((new Date).getMinutes() < 10) {
        time_min.value = '0' + time_min.value;
    }
    
}, 1000);


//退出
onUnmounted(()=>{
    clearInterval(timedhl);
    au.pause();
    au.src = '';
    


})



</script>



<style scoped>
@import './app.css';
</style>
