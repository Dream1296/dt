<template>
	<div id="all">
		<div class="kz_img" :style="{'transform':`translate(${ydsLeft}px)`}" v-show="shows1 && showBg">
			<img src="../../assets/img/ysrYd.gif"></img>
		</div>

		<div class="kz_img2" v-show="shows1 && showBg">
			<img src="../../assets/img/mcFk.gif"></img>
		</div>
		
		
		
		
		

		<text class="kzText" v-show="showBg" >动态</text>

		<div class="dtUpntb" @click="updts" @longpress="changang" v-if="showUpDt">
			<img src=" ../../assets/img/dtadd.png"></img>
		</div>

	</div>
</template>

<script setup lang="ts">
	import { addToken } from '@/api/apiIng';
import {  ref } from 'vue';

	let ydsLeft = ref(0);
	let shows1 = ref(false);

	let showUpDt = ref(false);

	addToken(showUpDt,true);


    //接受父组件传类的参数
    const props = defineProps({
        showBg: Boolean
    })


	//传递点击事件
	const emit = defineEmits(['clicks','longpress1']);
	
	function updts(){
		emit('clicks','');
	}
	function changang(){
		emit('longpress1','');
	}


	//顶部栏移动效果

	// setInterval(() => {
	// 	if (props.showBg) {
	// 		ydsLeft.value += 10;
	// 		if (ydsLeft.value >= 360) {
	// 			shows1.value = false;
	// 			setTimeout(() => {
	// 				shows1.value = true;
	// 			}, 1000);
	// 			ydsLeft.value = -30;

	// 		}
	// 	}
	// }, 1000);
</script>

<style scoped>
@import url('topDh.less');
</style>