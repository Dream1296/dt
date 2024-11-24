<template>

    <div id="top">
        <button @click="fh">← 返回</button>
        <h1 @click="showBottom2 = true">动态详情</h1>
        <button>分享</button>
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
    <van-popup v-model:show="showBottom2" round position="bottom" :style="{ height: '60%' }">
        <h1>样式{{ groupChecked }}</h1>
        <van-radio-group v-model="groupChecked" direction="horizontal">
            <van-radio name="0">null</van-radio>
            <van-radio name="1">蓝色渐变-猫羽雫</van-radio>
            <van-radio name="2">月色森林</van-radio>
            <van-radio name="3">蓝鲸</van-radio>
            <van-radio name="4">大黄</van-radio>
        </van-radio-group>

        <div style="height: 50px;"></div>
        <div style="margin: 16px;" @click="setBg">
            <van-button round block type="primary" native-type="submit">
                提交
            </van-button>
        </div>


    </van-popup>








</template>


<script setup lang="ts">
import { addDtindex, dtVideoImg, getdt, getEmoSrc, imgSrc, setDtBgStyle } from '@/api/api';
import { useRoute } from 'vue-router';
import Myimage from '../components/image/Myimage.vue';
import Pbl from '@/components/pbl/Pbl.vue';
import type { A } from '@/type/dtType';
import { ref, watch } from 'vue';
import { splitContent } from '@/dtData/dtUtils';
import router from '@/router';
import { showFailToast, showSuccessToast } from 'vant';
import { dtData } from '@/dtData/getList';

const route = useRoute();
let dtid = Number(route.query.dtid);
let srcShow = ref<string[]>([]);
let srcVideoImg = ref<string[]>([]);

let srcAll = ref<string[]>([]);

// let isImgAll = ref(false);
let isShowType = ref<'img' | 'video' | ''>('');

let isShowImg = ref(true);

let data = ref<A>();

let showBottom = ref(false);
let showBottom2 = ref(false);
let groupChecked = ref('0');
let newKeyWorld = ref('');



getdt(dtid).then(res => {
    data.value = res;
    res.textArr = splitContent(res.text);
    imgShow(res);
})


watch(() => route.query, () => {
    if (route.path != '/dts' || Number(route.query.dtid) == dtid) {
        return
    }
    dtid = Number(route.query.dtid);
    isShowType.value = '';
    isShowImg.value = true;
    showBottom.value = false;
    newKeyWorld.value = '';
    srcShow.value = [];
    srcVideoImg.value = [];
    srcAll.value = [];
    getdt(dtid).then(res => {
        data.value = res;
        res.textArr = splitContent(res.text);
        imgShow(res);
    })
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
    if (dtid && bgN) {
        setDtBgStyle(dtid, Number(bgN))
            .then((datas) => {
                if (datas.tf == 1) {
                    showSuccessToast('修改成功');
                    let c = dtData.find(dtid);
                    if (c && c.bgStyle) {
                        c.bgStyle = Number(bgN);
                    }
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



defineOptions({
    name: 'DtAllComponent'  // 为组件设置名称
});


</script>



<style lang="less" scoped>
@import url('../assets/css/dts.less');
</style>