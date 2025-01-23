<template>

    <div id="top">
        <button @click="fh">← 返回</button>
        <h1 @click="showBottom2 = true">动态详情</h1>
        <button @click="showShare = true">分享</button>
    </div>

    <!-- 内容区 -->
    <div class="content" v-if="data">
        <div class="text" v-if="data">
            <template v-for="a in data.textArr">
                <span v-if="a.type == 'text' && a.text != '\n'">{{ a.text }}</span>
                <br v-if="a.type == 'text' && a.text == '\n'">
                <img v-if="a.type == 'emoji'" :src="emosrc(a.text)" />
            </template>
        </div>
        <hr>
        <!-- 时间和地点 -->
        <div class="config" v-if="data">
            <p>{{ data.date.slice(0, 10) + " " + data.date.slice(11, 16) }}</p>
            <!-- <p>地点：平顶山</p> -->
        </div>

        <!-- 展示图片区 -->
        <div class="imgShow">
            <div v-for="(a, index) in srcShow" @click="GetImg({ dtid: data.id.toString(), index: index })">
                <Myimage :src="a"></Myimage>
            </div>

            <div class="showVideo" v-for="(a, index) in srcVideoImg.slice(0, 1)"
                @click="Getvideo({ dtid: data.id.toString(), index: index })">
                <Myimage :src="a"></Myimage>
                <img src="../assets/img/videIon.png">
            </div>
        </div>

        <div id="keyword" @click="addKeyworld">
            <div v-for="a in data.keyword">
                {{ a.keyword }}
            </div>
        </div>

        <div style="height: 10px;">
        </div>


        <!-- 全部图片区 -->
        <!-- <p @click="isAllsho">全部图片</p> -->
        <div class="imgalllogo">
            <img v-if="data.imgAllNum" @click="isAllsho('img')" src="../assets/img/imgall.png">
            <img v-if="data.videoNum && data.videoNum > 1" @click="isAllsho('video')" src="../assets/img/videoA.png">
        </div>
        <div class="imgAll" v-if="isShowType != ''" v-show="isShowImg">
            <!-- 图片 -->
            <div v-if="isShowType == 'img'">
                <Pbl :srcArr="srcAll" :dtid="dtid" @img="getImgs"></Pbl>
            </div>

            <!-- 视频 -->
            <div v-if="isShowType == 'video'">
                <Pbl :srcArr="srcAll" :dtid="dtid" @img="getvideos"></Pbl>
            </div>


        </div>

        <!-- 评论显示 -->
        <div class="pl">
            <div class="pls" v-for="pl in data.com">
                <span>
                    {{ pl.name }}
                </span>
                <span>:</span>
                <span>
                    {{ pl.content }}
                </span>
            </div>
        </div>
    </div>

    <!-- 圆角弹窗（底部） -->
    <van-popup v-model:show="showBottom" round position="bottom" :style="{ height: '50%' }">
        <div class="addW">
            <h4>添加新的标签，更快速的检索</h4>
            <van-cell-group inset>
                <van-field v-model="newKeyWorld" label="新标签" placeholder="请输入标签名" />
            </van-cell-group>
            <div class="tijiao" @click="dtindextijiao">
                <img src="../assets/img/addKeyWorldBu.png">
            </div>
        </div>

    </van-popup>


    <!-- 圆角弹窗（底部） -->
    <van-popup v-model:show="showBottom2" round position="bottom" :style="{ height: '80%' }">
        <h1>样式{{ groupChecked }}</h1>
        <van-radio-group v-model="groupChecked" direction="horizontal">
            <van-radio name="0">null</van-radio>
            <van-radio name="1">蓝色渐变-猫羽雫</van-radio>
            <van-radio name="2">月色森林</van-radio>
            <van-radio name="3">蓝鲸</van-radio>
            <van-radio name="4">大黄</van-radio>
        </van-radio-group>

        <h1>Loa {{ newLoa }}</h1>
        <van-radio-group v-model="newLoa" direction="horizontal">
            <van-radio name="0">0</van-radio>
            <van-radio name="1">1</van-radio>
            <van-radio name="13">13</van-radio>
        </van-radio-group>

        <div style="height: 20px;"></div>
        <h4>DateTime {{ nowDate }} - {{ nowTime }}</h4>
        <input type="date" v-model="nowDate">
        <input type="time" v-model="nowTime">

        <div style="height: 50px;"></div>
        <div style="margin: 16px;" @click="setBg">
            <van-button round block type="primary" native-type="submit">
                提交
            </van-button>
        </div>


    </van-popup>


    <van-share-sheet v-model:show="showShare" title="立即分享给好友" :options="options" @select="onSelect" />


</template>


<script setup lang="ts">
import { addDtindex, dtVideoImg, getdt, getEmoSrc, getShare, imgSrc, setDtBgStyle, setDtData, setShare } from '@/api/api';
import { useRoute } from 'vue-router';
import Myimage from '../components/image/Myimage.vue';
import Pbl from '@/components/pbl/Pbl.vue';
import type { A } from '@/type/dtType';
import { ref, watch } from 'vue';
import { splitContent } from '@/dtData/dtUtils';
import router from '@/router';
import { showFailToast, showSuccessToast, showToast, type ToastOptions } from 'vant';
import { dtData } from '@/dtData/getList';
import { viewDataStore } from '@/stores/viewDataStore';
import { token } from '@/api/token';

let viewData = viewDataStore();
const route = useRoute();
let dtid = Number(route.query.dtid);
let share = route.query.share;
let srcShow = ref<string[]>([]);
let srcVideoImg = ref<string[]>([]);

let srcAll = ref<string[]>([]);

let nowDate = ref<string>("");
let nowTime = ref<string>("");

let showShare = ref(false);
const options = [
    { name: '复制链接', icon: 'link' },
    // { name: '二维码', icon: 'qrcode' },
];
const onSelect = (option: { name: string | ToastOptions | undefined; }) => {
    if (option.name == '复制链接') {
        setShare(dtid.toString())
            .then(res => {
                let text = `https://frp-fix.top:20047/dts/#/dts?dtid=${dtid}&share=${res.token}`;
                console.log(text);
                navigator.clipboard.writeText(text)
                    .then(() => {
                        showSuccessToast('文本已成功复制到剪贴板');
                    })
                    .catch(err => {
                        showSuccessToast('复制失败');
                    });

            })
    }


    showShare.value = false;
};

// let isImgAll = ref(false);
let isShowType = ref<'img' | 'video' | ''>('');

let isShowImg = ref(true);

let data = ref<A>();


let showBottom = ref(false);
let showBottom2 = ref(false);
let groupChecked = ref('0');
let newLoa = ref('0');
let newKeyWorld = ref('');

init();

function init() {
    if (!dtid) {
        showFailToast('参数错误');
    }

    if (share) {
        getShare(share.toString())
            .then(data => {
                token.token = data.token;
                token.istoken = 'true';
                token.tempToken = data.token;
                token.isTempToken = 'true';
            })
            .then(() => {
                getdts().then(fn)
            })
    } else {
        getdts().then(fn);
    }

    function fn(){
        if(!data.value){
            return
        }
        imgShow(data.value);
        newLoa.value = data.value.loa.toString();
        groupChecked.value = data.value.bgStyle.toString();
        parseISO8601ToDateTimeWithDelimiters(data.value.date);
        if(!data.value.keyword){
            data.value.keyword = [
                {
                    keyword: 'null',
                    isAi: 0
                }
            ]
        }
        return
    }
}




function getdts() {
    return new Promise<void>(( resolve,reject )=>{
        let obj = dtData.values.find(res => res.id == dtid);
    if (obj && obj.type == 'A') {
        data.value = obj;
        resolve()
        return
        
    }
    getdt(dtid, viewData.loa).then(res => {
        data.value = res;
        res.textArr = splitContent(res.text);
        resolve()
        return
    })
    })
}




watch(() => route.query, () => {
    if (route.path != '/dts' || Number(route.query.dtid) == dtid) {
        return
    }
    dtid = Number(route.query.dtid);
    share = route.query.share;
    isShowType.value = '';
    isShowImg.value = true;
    showBottom.value = false;
    newKeyWorld.value = '';
    srcShow.value = [];
    srcVideoImg.value = [];
    srcAll.value = [];
    init();
    // getdt(dtid).then(res => {
    //     data.value = res;
    //     res.textArr = splitContent(res.text);
    //     imgShow(res);
    // })
});

function getImgs(index: string) {
    GetImg({ dtid: dtid.toString(), index: Number(index) });
}
function getvideos(index: string) {
    Getvideo({ dtid: dtid.toString(), index: Number(index) });
}


function emosrc(name: string) {
    return getEmoSrc(name);
}

function setBg() {
    let dtid = data.value?.id
    let bgN = groupChecked.value;
    let date = combineToISO8601ForMySQL(nowDate.value, nowTime.value);

    if (dtid && bgN && groupChecked.value != '0') {
        setDtData(dtid.toString(), newLoa.value, groupChecked.value, date)
            .then((datas) => {
                if (datas.tf == 1) {
                    showSuccessToast('修改成功');
                    showBottom2.value = false;
                } else {
                    showFailToast('错误');
                }
            })
    }
}


let src = '../../public/bgImg/bg0.png';



function imgShow(res: A) {
    if (!res.imgShowAll) {
        res.imgShowAll = 0;
    }
    for (let i = 0; i < res.imgShowAll; i++) {
        srcShow.value.push(imgSrc(res.id, i));
    }

    if (!res.videoNum) {
        res.videoNum = 0;
    }




    for (let i = 0; i < res.videoNum; i++) {

        srcVideoImg.value.push(dtVideoImg(res.id, i));
    }
}


function dtindextijiao() {
    addDtindex(dtid, newKeyWorld.value)
        .then((res: any) => {
            if (res.tf == 1) {
                showBottom.value = false;
                alert('成功');
                data.value?.keyword.push({
                    keyword: newKeyWorld.value,
                    isAi: 0,
                })
            }

        })
}

function isAllsho(types: 'video' | 'img') {
    if (isShowType.value == types) {
        return isShowType.value = '';
    }
    isShowType.value = types;
    if (types == 'img') {
        if (!data.value?.imgAllNum) {
            return
        }
        for (let i = 0; i < data.value.imgAllNum; i++) {
            srcAll.value.push(imgSrc(dtid, i));
        }
    }
    if (types == 'video') {
        if (!data.value?.videoNum || data.value.videoNum <= 1) {
            return;
        }
        for (let i = 0; i < data.value.videoNum; i++) {
            srcAll.value.push(dtVideoImg(dtid, i));
        }
    }





    isShowType.value = types;
}

function addKeyworld() {
    showBottom.value = true;
}

function fh() {
    router.back();
}


function GetImg(ids: {
    dtid: string,
    index: number,
}) {
    //打开图片页面
    router.push({ path: '/imgs', query: ids });
}

function Getvideo(ids: {
    dtid: string,
    index: number,
}) {
    //打开图片页面
    router.push({ path: '/videoPlay', query: ids });
}



function combineToISO8601ForMySQL(dateStr: string, timeStr: string): string {
    // 检查日期和时间是否为空
    if (!dateStr || !timeStr) {
        return "";
    }

    // 解析日期和时间字符串
    const dateParts = dateStr.split('-').map(Number);
    const timeParts = timeStr.split(':').map(Number);

    // 创建一个 Date 对象（注意：这里假设时间是 24 小时制的，并且不考虑时区偏移）
    // 由于我们不需要时区信息，我们可以简单地使用 Date 构造函数，而不是 Date.UTC
    // 但是，为了保持一致性（即日期部分使用 UTC），我们仍然可以使用 Date.UTC 来设置时间部分
    // 然后我们可以将这些 UTC 值转换为一个 Date 对象（这将隐式地设置为本地时间，但我们可以忽略这一点）
    // 然而，由于我们只需要 YYYY-MM-DD HH:MM:SS 格式，并且假设输入是 UTC（或不需要时区转换）
    // 我们可以直接拼接字符串而不需要创建一个完整的 Date 对象（这样做更高效）

    // 但为了保持函数的一致性（尽管不是最高效），我们还是使用 Date 对象，只是不设置时区
    // 并确保在格式化输出时不包含时区信息
    const year = dateParts[0];
    const month = String(dateParts[1]).padStart(2, '0'); // 确保月份是两位数
    const day = String(dateParts[2]).padStart(2, '0'); // 确保日期是两位数
    const hours = String(timeParts[0]).padStart(2, '0'); // 确保小时是两位数
    const minutes = String(timeParts[1]).padStart(2, '0'); // 确保分钟是两位数
    const seconds = String(timeParts[2] || 0).padStart(2, '0'); // 如果没有秒，则默认为0，并确保是两位数

    // 拼接成 MySQL DATETIME 格式的字符串
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function parseISO8601ToDateTimeWithDelimiters(isoString: string) {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1); // 月份从0开始，需要加1
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    nowDate.value = `${year}-${month}-${day}`;
    nowTime.value = `${hours}:${minutes}:${seconds}`;
}

function padZero(num: number) {
    return num < 10 ? '0' + num : num.toString();
}


defineOptions({
    name: 'DtAllComponent'  // 为组件设置名称
});


</script>



<style lang="less" scoped>
@import url('../assets/css/dts.less');
</style>