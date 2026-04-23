<template>
	<div class="zhu">

		<!-- 顶部栏 -->
		<topView :touxianSrc="getTouxian('xt')" name="系统" dtid="999"></topView>

		<!-- 正文 -->
		<div class="text">
			<div class="bntx">
				<div id="xuanx2" @click="shownewdt(13)">
					<img src="../../assets/img/ah_x.png"></img>
				</div>

				<div id="xuanx4" @click="config()">
					<img src="../../assets/img/configs.png"></img>
				</div>

				<div id="xuanx3" @click="showSs = !showSs">
					<img src="../../assets/img/sousuo.png"></img>
				</div>

				<div id="xuanx1" @click="tzs()">
					<img v-show="viewData.loa != 1" src="../../assets/img/yangjin1.png"></img>
					<img v-show="viewData.loa == 1" src="../../assets/img/yangjin2.png"></img>
				</div>




			</div>

			<div class="bntx">

				<div id="alist" :class="{ disabled: !userData.isHome }" @click="openAlist()">
					<div v-html="svgArr[0]">
					</div>
				</div>

				<div class="unX">
					<div v-html="svgArr[1]">
					</div>
				</div>

				<div class="unX">
					<div v-html="svgArr[2]">
					</div>
				</div>

				<div class="unX">
					<div v-html="svgArr[3]">
					</div>
				</div>
			</div>
			<div id="find" v-show="showSs">
				<!-- <input v-model="sr" />
				
				<div @click="sousuo">精确搜索</div> -->
				<van-search v-model="sr" ref="searchRef" @search="dtFind" :autocomplete="'off'"
					placeholder="请输入搜索关键词" />

			</div>
		</div>


		<div class="di">
			<!-- 日期 -->
			<div class="date">
				<text>2024-09-03</text>
			</div>
		</div>
		<!-- <hr> -->
		<!-- <div style="height: 10px;"></div> -->

		<div class="ding">
			<img src="../../assets/img/ding.png">
		</div>

	</div>
	<!-- <Line></Line> -->

</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import Line from '../fenge/line.vue';
import { viewDataStore } from '@/stores/viewDataStore';
import { userStore } from '@/stores/userStore';
import { Internet } from '@/api/api';
import { dtDataInit, dtFindData } from '@/dtData/getList';
import { obsDt } from '@/dtData/observerDt';
import { myEvent } from '@/myEnit';
import topView from '@/components/TopView/topView.vue';
import { getTouxian, login } from '@/api/api';
import { token } from '@/api/token';
import { showFailToast } from 'vant';
import { svgArr } from './svgArr';
import { dtData } from '@/dtData/dtList';
import router from '@/router';
import type { SearchInstance } from 'vant'
// import process from 'process';
const viewData = viewDataStore();
const userData = userStore();
//视图数据
const vlist = dtData.vlist;

// import { userImg } from '../../api';

let fings = ref(false);
const searchRef = ref<SearchInstance | null>(null)

let userImg = ref(Internet.url + "/api/userImg?name=xt");


let sr = ref('');
let showSs = ref(false);

//传递事件
const emit = defineEmits(['shownewdt', 'tzs', 'config']);

function shownewdt(num: number) {
	// 将viewData.loa设置为-2，表示显示新建弹窗

	viewData.loa = -2;
}

function config() {
	if (token.istoken == 'false') {
		showFailToast('仅用于内部维护使用');
		return
	}
	emit('config');
}

function tzs() {
	if (viewData.loa == 0) {
		viewData.loa = 1;
	} else {
		viewData.loa = 0;
	}
}

function openAlist() {
	// if (!userData.isHome) {
	// 	showFailToast('仅在内网可用');
	// 	return
	// }
	// let url = 'http://dlhe.top:5244';
	// window.open(url, '_blank');

	router.push({ path: '/list/' });

}
//查询事件监听
myEvent.on('dtFind', (e) => {
	showSs.value = true;
	sr.value = e as string;

	if (token.istoken == 'false') {
		showFailToast('仅用于内部维护使用');
		return
	}
	if (sr.value == '' || sr.value == ' ') {
		dtDataInit(0).then(() => {
			myEvent.emit('upDtList');
		});
	} else {
		dtFindData(sr.value, viewData.loa).then(() => {
			myEvent.emit('upDtList');
		});
	}

})
function dtFind() {
	myEvent.emit('dtFind', sr.value);
}
//监听键盘输入
myEvent.on('onKey', async (a: any) => {
	let e: KeyboardEvent = a;
	const key = e.key;
	console.log(key);

	// 判断是否搜索
	if (e.ctrlKey && key === '/') {
		e.preventDefault();
		if (showSs.value) {
			await nextTick();
			searchRef.value?.blur();
			showSs.value = false;
		} else {
			showSs.value = true;
			await nextTick();
			searchRef.value?.focus();
		}
	}
	//是否确定搜索
	if (e.altKey && key == 'q') {
		e.preventDefault();
		dtFind();
	}
	//切换分级
	if (e.altKey) {
		if (key == '1') {
			viewData.loa = 0;
		}
		if (key == '2') {
			viewData.loa = 1;
		}
	}

})


</script>

<style scoped lang="less">
@import url('@/assets/css/public.less');
@import url('./SystemDt.less');
</style>