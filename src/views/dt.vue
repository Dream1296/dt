<template>
    <div class="all">


        <!-- 顶部栏 -->
        <div id="kz" :class="{ kzs: showBg }" v-if="!userData.isPc">
            <topDh :showBg='showBg' @clicks="updt" @gologin="gologin"></topDh>
        </div>

        <div v-if="userData.isPc && userData.isLogin" class="userOptions">
            <userOptions></userOptions>
        </div>

        <div id="head" ref="head">
            <div v-if="userData.isPc">
                <homePage ></homePage>
                <!-- <homePageMo13 ></homePageMo13> -->
               
            </div>
            <div v-if="!userData.isPc">
                <homePageMo></homePageMo>
            </div>
        </div>

        <!-- 空白间隔 -->
        <div id="nulls"></div>

        <div v-if="vlist">
            <!-- 系统选项 -->
            <div class="zhujian">
                <SystemDt @config="configs"></SystemDt>
            </div>



            <div class="zhujian" v-show="showLogin">
                <login @success="logins"></login>
            </div>


            <hr>


            <div id="dtArr" ref="dtArr">
                <div v-for="(a, index) in vlist" :key="a.id" ref="dtsDom">
                    <div class="zhujian">
                        <div v-if="a.type == 'A' && !a.KeepRun && !a.KeepBadminton">
                            <dts @showImg="dtsClicks" @showVideo='playVideo' @showOptions="showDtOptions" :datas="a"></dts>
                        </div>

                        <div v-if="a.type == 'A' && a.KeepRun">
                            <KeepRun :datas="a"></KeepRun>
                        </div>

                        <div v-if="a.type == 'A' && a.KeepBadminton">
                            <KeepBadminton :datas="a"></KeepBadminton>
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

                        <div v-if="a.type == 'year'">
                            <YearSign :year="a.year"></YearSign>
                        </div>

                    </div>
                    <div class="line">
                        <Line v-if="index < vlist.length - 1"></Line>
                    </div>

                </div>






            </div>





            <div style="height: 100px;">

            </div>

        </div>

        <!-- end -->
        <div>
            <elf></elf>
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

    <!-- 信息标识 -->

    <div>
        <footers :show_num="footer_show_num"></footers>
    </div>

    <!-- <div id="dtop" v-if="dtOpDtId !== undefined">
        <dtOp :dtId="dtOpDtId" :loa="viewData.loa" @close="closeDtOp"></dtOp>
    </div> -->







</template>

<script setup lang="ts">
import { dtDataInit, dtFindData } from '../dtData/getList';
import { VcDataPush, vData } from '../dtData/VcData';
import type { DtDataType } from '../types/dtType';
import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import topDh from '../components/topDh/topDh.vue';
import SystemDt from '../components/SystemDt/SystemDt.vue';
import dts from '@/components/dts/dts.vue';
import { showTop } from '@/utils/dt/dtTopShow';
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
import Line from '@/components/fenge/line.vue';
import { layoutItemsFnAdd } from '@/utils/dt/layoutItems';
import { useRoute } from 'vue-router';
import KeepRun from '@/components/keepRun/keepRun.vue';
import KeepBadminton from '@/components/KeepBadminton/KeepBadminton.vue';
import homePage from '@/components/homePage/homePage.vue';
import footers from '@/components/footer/footer.vue';
import homePageMo from '@/components/homePageMo/homePageMo.vue';
import { dtData } from '@/dtData/dtList';
import YearSign from '@/components/yearSign/yearSign.vue';
import { routerPush } from '@/utils/dt/routerUtil';
import dtOp from '@/components/dtOp/dtOp.vue';
import userOptions from '@/components/userOptions/userOptions.vue';
import homePageMo13 from '@/components/homepageMo13/homePageMo13.vue';

let viewData = viewDataStore();
let userData = userStore();

const route = useRoute();
let showLogin = ref(false);
//处理路径搜索
let wd = route.query.wd;

// 动态位置
let startId = 0;

// 刷新还是重新打开
let Restart = sessionStorage.getItem('restart');

console.log(token.istoken);


if (route.query.login && route.query.login == 'login') {
    showLogin.value = true;
}
if (route.query.dtId && !isNaN(Number(route.query.dtId)) && Number(route.query.dtId) >= 0) {
    startId = Number(route.query.dtId);
}
console.log(Number(route.query.loa));
console.log(isNaN(Number(route.query.loa)));

if (route.query.loa && !isNaN(Number(route.query.loa)) && Number(route.query.loa) >= 0) {
    console.log(Number(route.query.loa));
    
    viewData.loa = Number(route.query.loa);
}


if(!Restart){
    viewData.loa = 0;
    startId = 0;
    routerPush('loa', '0');
    sessionStorage.setItem('restart','1')
}


myEvent.on('dtFind', (e) => {
    // routerPush('wd', e as string);
})



//视图数据
const vlist = dtData.vlist;


// 底部信息是否显示
const footer_show_num = ref(0);

//用户名
let userName = ref('正在加载');

const dtOpDtId = ref<number>();


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

        if (newVal == -2) {
            showBottom.value = true;
        }

        if (newVal == 1) {
            routerPush('loa', '1');
        }
        if (newVal == 0) {
            routerPush('loa', null);
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
    // nextTick(() => {

    obsDt.init(dtsDom, 0);
    // })
})




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







//单个动态的父组件
const dtArr = ref<HTMLElement>();

//懒加载
const dtsDom = ref<HTMLElement[]>([]);


//页面控制变量 
let showBg = ref(false);
let head = ref<HTMLElement>();

//顶部栏自动显示
onMounted(() => {
    // if (dtArr.value && dtsDom.value) {
    //     layoutItemsFnAdd(dtArr.value, dtsDom.value);
    // }
    window.scrollTo(0, 0);

    if (window.innerWidth < 768) {
        showTop(showBg, head as Ref<HTMLElement>);
    }


    window.addEventListener('keydown', handleGlobalKeydown);
});




// 全局监听键盘事件的回调
const handleGlobalKeydown = (e: KeyboardEvent) => {
    myEvent.emit('onKey', e);
};

myEvent.on('onKey', (e: any) => {
    const key = e.key;
    if (showBottom.value) {
        if (Number(key) < 10 && Number(key) >= 0) {
            passwd13.value += key;
        }

        if (key == 'Backspace') {
            passwd13.value = passwd13.value.slice(0, -1);
        }
    }
})







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
    //打开视频页面
    router.push({ path: '/videoPlay', query: ids });
}

function showDtOptions(dtId: number) {
    dtOpDtId.value = dtId;
}

function closeDtOp() {
    dtOpDtId.value = undefined;
}

function updt() {
    router.push({ path: '/updt' });
}

function gologin() {
    router.push({ path: '/login' });
}

//跳转到设置页
function configs() {
    router.push({ path: '/config' });
}

setTimeout(() => {
    footer_show_num.value += 1;
}, 1500)

let guanbi_footer_show = () => {

    obsDt.guanbi_footer_show = () => {
        setTimeout(() => {
            footer_show_num.value += 1;
            setTimeout(() => {
                footer_show_num.value += 2;
            }, 2000);
        }, 1500)
        obsDt.guanbi_footer_show = () => {
        };
    }

}
obsDt.guanbi_footer_show = guanbi_footer_show;



//初始化数据,初始化评论列表
dtDataInit(viewData.loa)
    .then(datas => {
        VcDataPush(datas);
        obsDt.init(dtsDom, startId);
    })


// 在组件销毁时移除事件监听器
onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleGlobalKeydown);
});


defineOptions({
    name: 'DtComponent'  // 为组件设置名称
});


</script>


<style lang="less" scoped>
@import "../assets/css/dt.less";
</style>
