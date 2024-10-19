<template>

    <div class="all">
        <!-- 顶部栏 -->
        <div id="kz" :class="{ kzs: showBg }">
            <topDh :showBg='showBg' @clicks="updt" @longpress1='upvideo'></topDh>
        </div>

        <!-- 背景图 -->
        <div id="head" ref="head" :style="{ 'background-image': 'url(' + bgSrc + ')' }">
        </div>

        <!-- 背景图山的头像部分 -->
        <div id="touxian">
            <div class="tou">
                <text class="texts"> {{ userName }} </text>
                <img :src=touxianSrc></img>
            </div>

        </div>
        <!-- 空白间隔 -->
        <div id="nulls"></div>

        <div id="" v-if="vlist">
            <!-- 系统选项 -->
            <SystemDt  @shownewdt='shownewdt(13)' @tzs='tzs' @find='dtFind' @config="configs"></SystemDt>
            <div v-show="showLogin">
                <login @success="logins"></login>
            </div>

            <!-- 动态 -->
            <div v-for="a in vlist" :key="a.id" ref="dtsDom">
                <dts @showImg="dtsClicks" @showVideo='playVideo' :datas="a"></dts>
            </div>

        </div>

        <!-- end -->
        <div>

        </div>
    </div>




</template>

<script setup lang="ts">
import { dtDataInit, dtData, dtFindData } from '../dtData/getList';
import { VcDataInit, vData } from '../dtData/VcData';
import type { A } from '../dtData/dtType';
import { nextTick, onMounted, ref, type Ref } from 'vue';
import topDh from '../components/topDh/topDh.vue';
import SystemDt from '../components/SystemDt/SystemDt.vue';
import dts from '@/components/dts/dts.vue';
import { token } from '@/getToken';
import { data1 } from '../testData';
import { showTop } from '@/util/dt/dtTopShow';
import { upvideo } from '@/util/dt/dtUtil';
import router from '@/router';
import { config } from 'process';
import { obsDt } from '@/dtData/observerDt';
import login from '@/components/login/login.vue';
import { getName, Internet } from '../api/api';
import { isToken, verifyToken } from '@/api/token';

let touxianSrc = Internet.url + "/api/userImg?name=yw";


//视图数据
const vlist = dtData.vlist;

let showLogin = ref(false);
let isLogin = false;

//用户名
let userName = ref('正在加载');

showLogin.value = !isToken();


verifyToken().then(data => {

    if (!data) {
        showLogin.value = true;
    }
})


getName().then(data => {
    if (data.user == "guest") {
        userName.value = '未登录';
        return
    }
    isLogin = true;
    userName.value = data.name;
})

function logins() {
    //刷新
    location.reload();
}

//测试数据
// vlist.value.push(data1);
const bgSrcCon = '/bgImg/bg';
let bgId = 0;
let bgSrc = ref(bgSrcCon + bgId + ".png");


//懒加载
const dtsDom = ref<HTMLElement[]>([]);





//页面控制变量 
let showBg = ref(false);
let head = ref<HTMLElement>();

//顶部栏自动显示
onMounted(() => {
    showTop(showBg, head as Ref<HTMLElement>);
});





function dtsClicks(ids: {
    dtid: string,
    index: number,
}) {
    //打开图片页面
    router.push({ path: '/imgs', query: ids });
}

function playVideo(ids: {
    dtid: string,
    index: number,
}) {
    //打开图片页面
    router.push({ path: '/videoPlay', query: ids });
}

function updt() {
    router.push({ path: '/updt' });
}

//跳转到设置页
function configs() {
    router.push({ path: '/config' });
}

//查询
function dtFind(text: string) {
    console.log(text);


    if (text == '' || text == ' ') {
        dtDataInit(0).then(fn);
    } else {
        dtFindData(text).then(fn);
    }

    function fn() {
        obsDt.init();
        vlist.value = [];
        obsDt.dtAdd(dtsDom);

    }
}

//初始化数据,初始化评论列表
dtDataInit(0)
    .then(datas => {
        VcDataInit(datas);
        obsDt.dtAdd(dtsDom);

    })

//切换显示分级
function tzs(num: boolean) {
    dtDataInit(num ? 1 : 0).then(() => {

        //切换背景图
        bgId = Number(num);
        bgSrc.value = bgSrcCon + bgId + ".png";

        obsDt.init();
        vlist.value = [];
        obsDt.dtAdd(dtsDom);
    })
}

//切换显示等级
function shownewdt(num: number) {
    dtDataInit(13).then((datas) => {
        VcDataInit(datas);
        obsDt.init();
        vlist.value = [];
        obsDt.dtAdd(dtsDom);
    })
}






defineOptions({
    name: 'DtComponent'  // 为组件设置名称
});




</script>


<style lang="less" scoped>
@import "../assets/css/dt.less";
</style>