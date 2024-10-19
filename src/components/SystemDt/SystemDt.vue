<template>
	<div class="zhu">
		<!-- 头像 -->
		<div class="touxian">
			<img src="https://frp-fix.top:20047/api/userImg?name=xt"></img>
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
						<img v-show="!isdtall" src="../../assets/img/yangjin1.png"></img>
						<img v-show="isdtall" src="../../assets/img/yangjin2.png"></img>
					</div>
				</div>
			</div>
			<div id="find" v-show="showSs">
				<!-- <input v-model="sr" />
				
				<div @click="sousuo">精确搜索</div> -->
				<van-search v-model="sr"  @search="sousuo" placeholder="请输入搜索关键词" />

			</div>
		</div>


		<div class="di">
			<!-- 日期 -->
			<div class="date">
				<text>2024-09-03</text>
			</div>
		</div>
		<hr>
		<div style="height: 10px;">

		</div>

	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	// import { userImg } from '../../api';
	let isdtall = ref(false);
	let fings = ref(false);
	let sr = ref('');
	let showSs = ref(false);
	
	//传递事件
	const emit = defineEmits(['shownewdt','tzs','find','config']);

	function shownewdt(num:number) {
			emit('shownewdt',13);
	}
	function sousuo(){
			emit('find',sr.value);
	}

	function config(){
		emit('config');
	}

	function tzs() {
		emit('tzs',!isdtall.value);
		isdtall.value = !isdtall.value;
	}
</script>

<style scoped lang="less">
@import url('./SystemDt.less');
	
</style>