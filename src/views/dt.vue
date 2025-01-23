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
            <div id="guajian">
                <img src="../assets/img/guajianc.png">
            </div>

        </div>
        <!-- 空白间隔 -->
        <div id="nulls"></div>

        <div id="" v-if="vlist">
            <!-- 系统选项 -->
            <SystemDt @config="configs"></SystemDt>
            <div v-show="!userData.isLogin">
                <login @success="logins"></login>
            </div>





            <div v-for="a in vlist" :key="a.id" ref="dtsDom">
                <div v-if="a.type == 'A'">
                    <dts @showImg="dtsClicks" @showVideo='playVideo' :datas="a"></dts>
                </div>

                <div v-if="a.type == 'dataImg'">
                    <dtForm :datas="a"></dtForm>
                </div>

                <div v-if="a.type == 'mood'">
                    <!-- 心情填报 -->
                    <mood :datas="a"></mood>
                </div>

                <!-- 服务器性能监控 -->
                <div v-if="a.type == 'top'">
                    <Top :datas="a"></Top>
                </div>

            </div>

            <div style="height: 100px;">

            </div>

        </div>

        <!-- end -->
        <div>
            <elf @touchmove="a2"></elf>
        </div>
        <div>
            <configV></configV>
        </div>

    </div>

    <!-- 底部弹出 -->
    <van-popup v-model:show="showBottom" round position="bottom" :style="{ height: '80%' }">
        <h3 id="passwd13H3">
            请输入密码
        </h3>
        <div id="passwd13">
            <van-password-input :value="passwd13" :focused="showKeyboard" @focus="showKeyboard = true" />
        </div>

        <div id="passwd13Inp">
            <!-- 数字键盘 -->
            <van-number-keyboard v-model="passwd13" :show="showKeyboard" @blur="showKeyboard = true" />
        </div>

    </van-popup>




</template>

<script setup lang="ts">
import { dtDataInit, dtData, dtFindData } from '../dtData/getList';
import { VcDataInit, vData } from '../dtData/VcData';
import type { A } from '../type/dtType';
import { nextTick, onMounted, ref, watch, type Ref } from 'vue';
import topDh from '../components/topDh/topDh.vue';
import SystemDt from '../components/SystemDt/SystemDt.vue';
import dts from '@/components/dts/dts.vue';
import { data1 } from '../testData';
import { showTop } from '@/util/dt/dtTopShow';
import { upvideo } from '@/util/dt/dtUtil';
import router from '@/router';
import { config } from 'process';
import { obsDt } from '@/dtData/observerDt';
import login from '@/components/login/login.vue';
import { dtDate, getName, Internet } from '../api/api';
import { token } from '@/api/token';
import { addToken } from '@/api/apiIng';
import { showFailToast, showSuccessToast } from 'vant';
import dtForm from '@/components/dtFrom/dtForm.vue';
import mood from '@/components/mood/mood.vue';
import { viewDataStore } from '@/stores/viewDataStore';
import { userStore } from '@/stores/userStore';
import Top from '@/components/top/top.vue';
import { myEvent } from '@/myEnit';
import elf from '@/components/elf/elf.vue';
import threeView from '@/components/threeView/threeView.vue';
import configV from '@/components/configV/configV.vue';

let viewData = viewDataStore();
let userData = userStore();




let touxianSrc = Internet.url + "/api/userImg?name=yw";

const passwd13Text = '143323';



//视图数据
const vlist = dtData.vlist;


//用户名
let userName = ref('正在加载');


let showBottom = ref(false)

let passwd13 = ref('');
let showKeyboard = ref(true);



watch(() => viewData.loa,
    (newVal, oldValue) => {

        if (token.istoken == 'false') {
            setTimeout(() => {
                viewData.loa = 0;
            }, 300);
            showFailToast('仅在登录后可查看所有内容');
            return
        }

        if (newVal == 0 || newVal == 1) {
            get01(newVal);
        }

        if (newVal == 12) {
            showBottom.value = true;
        }

        
    }
)

function get01(newVal: number) {
    dtDataInit(newVal ? 1 : 0).then((data) => {
        // viewData.loa = data.loa;
        // 切换背景图
        if (newVal == 0) {
            // 页面视图改变
            bgSrc.value = bgSrcCon + newVal + ".webp";
        } else {
            bgSrc.value = bgSrcCon + "1" + ".png";
        }

        myEvent.emit('upDtList');
    })
}

myEvent.on('upDtList', () => {
    obsDt.init();
    vlist.value = [];
    nextTick(() => {
        obsDt.dtAdd(dtsDom);
    })
})

watch(passwd13, (newVal) => {
    if (newVal == passwd13Text) {
        viewData.loa = 13;
        get13();
        showSuccessToast('密码正确');
        showBottom.value = false;
        return
    }
    if (newVal.length == 6) {
        showFailToast('密码错误');
        passwd13.value = '';
    }
});



function get13() {
    //切换背景图片
    bgSrc.value = bgSrcCon + "1" + ".png";

    dtDataInit(13).then((datas) => {
        VcDataInit(datas);
        obsDt.init();
        vlist.value = [];
        obsDt.dtAdd(dtsDom);
    })
}



function a2(e: any) {
    e.preventDefault(); // 防止页面滚动
    const touch = e.touches[0];
    viewData.elfX = touch.clientX;
    viewData.elfY = touch.clientY;
}



//token有效的修改函数
let fnTure = (key: { isLogin: boolean }) => {
    key.isLogin = true;
}
//token无效的修改函数
let fnFalse = (key: { isLogin: boolean }) => {
    key.isLogin = false;
}

// 根据token状态来显示登录页面
addToken(fnTure, fnFalse, userData);






//获取用户名
getName()
    .then(data => {
        if (data.user == "guest") {
            userName.value = '未登录';
            return
        }
        userData.isLogin = true;
        userName.value = data.name;
    })

function logins() {
    //刷新
    location.reload();
}

const bgSrcCon = '/bgImg/bg';
let bgSrc = ref(bgSrcCon + 0 + ".webp");










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



//初始化数据,初始化评论列表
dtDataInit(0)
    .then(datas => {
        VcDataInit(datas);
        obsDt.dtAdd(dtsDom);
    })




defineOptions({
    name: 'DtComponent'  // 为组件设置名称
});




</script>


<style lang="less" scoped>
@import "../assets/css/dt.less";
</style>