<template>

    <div id="top">
        <button >← 返回</button>
        <h1>动态详情</h1>
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
            <div v-for="(a,index) in srcShow" @click="GetImg({dtid:data.id.toString(),index:index})">
                <Myimage  :src="a"></Myimage>
            </div>

            <div class="showVideo" v-for="(a,index) in srcVideoImg" @click="Getvideo({dtid:data.id.toString(),index:index})">
                <Myimage  :src="a"></Myimage>
                <img src="../assets/img/videIon.png">
            </div>


        </div>

        <div style="height: 100px;">

        </div>
        <!-- 全部图片区 -->
        <p @click="isAllsho">全部图片</p>
        <div class="imgAll" v-if="isImgAll" v-show="isShowImg">
            <Pbl :srcArr="srcAll"></Pbl>
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










</template>


<script setup lang="ts">
import { getdt, getEmoSrc } from '@/api/api';
import { useRoute } from 'vue-router';
import Myimage from '../components/image/Myimage.vue';
import Pbl from '@/components/pbl/Pbl.vue';
import type { A } from '@/dtData/dtType';
import { ref } from 'vue';
import { splitContent } from '@/dtData/dtUtils';
import router from '@/router';

const route = useRoute();
let dtid = Number(route.query.dtid);
let srcShow = ref<string[]>([]);
let srcVideoImg = ref<string[]>([]);

let srcAll = ref<string[]>([]);

let isImgAll = ref(false);
let isShowImg = ref(true);

let data = ref<A>();

getdt(dtid).then(res => {
    data.value = res;
    console.log(res);
    res.textArr = splitContent(res.text);
    imgShow(res);
    // imgAll(res);



})

function emosrc(name: string) {
    return getEmoSrc(name);
}

let src = '../../public/bgImg/bg0.png';

function imgAll(res: A) {
    let srcs = 'https://frp-fix.top:20047/api/dtimg?dtid=' + res.id + '&index=';
    if (!res.imgAllNum) {
        return
    }
    for (let i = 0; i < res.imgAllNum; i++) {
        srcAll.value.push(srcs + i);
    }
    isImgAll.value = true;
}

function imgShow(res:A){
    let srcs = 'https://frp-fix.top:20047/api/dtimg?dtid=' + res.id + '&index=';
    let videoImgSrc = 'https://frp-fix.top:20047/api/dtvideoImg?dtid=' + res.id + '&index=';
    if (!res.imgShowAll) {
        res.imgShowAll = 0;
    }
    for (let i = 0; i < res.imgShowAll; i++) {
        srcShow.value.push(srcs + i);
    }

    if(!res.videoNum){
        res.videoNum = 0;
    }


    

    for(let i = 0; i < res.videoNum; i++){
        
        srcVideoImg.value.push(videoImgSrc + i);
    }

    


}

function isAllsho(){
    if(!isImgAll.value){
        imgAll(data.value!);
        return
    }
    isShowImg.value = !isShowImg.value;
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




</script>



<style lang="less" scoped>
@import url('../assets/css/dts.less');
</style>