<template>
	<div class="zhu">
		<!-- 头像 -->
		<div class="touxian">
			<img :src="userImg"></img>
		</div>
		<!-- 名字 -->
		<div class="name">
			<text>系统</text>
		</div>
		<!-- 正文 -->
		<div class="text">
			<div id="bntx">
				<div id="bntxs">
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
			</div>
			<div id="find" v-show="showSs">
				<!-- <input v-model="sr" />
				
				<div @click="sousuo">精确搜索</div> -->
				<van-search v-model="sr" @search="dtFind" :autocomplete="'off'" placeholder="请输入搜索关键词" />

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
	<!-- <div id="line"></div> -->
	<Line></Line>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import Line from '../fenge/line.vue';
import { viewDataStore } from '@/stores/viewDataStore';
import { Internet } from '@/api/api';
import { dtData, dtDataInit, dtFindData } from '@/dtData/getList';
import { obsDt } from '@/dtData/observerDt';
import { myEvent } from '@/myEnit';
const viewData = viewDataStore();
//视图数据
const vlist = dtData.vlist;

// import { userImg } from '../../api';

let fings = ref(false);

let userImg = ref(Internet.url + "/api/userImg?name=xt");


let sr = ref('');
let showSs = ref(false);

//传递事件
const emit = defineEmits(['shownewdt', 'tzs', 'config']);

function shownewdt(num: number) {
	viewData.loa = 12;
}

function config() {
	emit('config');
}

function tzs() {
	if (viewData.loa == 0) {
		viewData.loa = 1;
	} else {
		viewData.loa = 0;
	}
}
//查询
function dtFind() {
	if (sr.value == '' || sr.value == ' ') {
		dtDataInit(0).then(() => {
			myEvent.emit('upDtList');
		});
	} else {
		dtFindData(sr.value, viewData.loa).then(() => {
			myEvent.emit('upDtList');
		});
	}
}
</script>

<style scoped lang="less">
@import url('./SystemDt.less');
</style>