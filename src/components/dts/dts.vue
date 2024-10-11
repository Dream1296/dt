<template>
	<div class="zhu" v-if="data" >
		<!-- 头像 -->
		<div class="touxian">
			<img :src="getTouxian('yw')"></img>
		</div>
		<!-- 名字 -->
		<div class="name">
			<span>{{ data.name }}</span>
		</div>
		<!-- 正文 -->
		<div class="text">
			<template v-for="a in data.textArr">
				<span v-if="a.type == 'text' && a.text != '\n'">{{ a.text }}</span>
				<br v-if="a.type == 'text' && a.text == '\n'">
				<img v-if="a.type == 'emoji'" :src="emosrc(a.text)" />
			</template>
		</div>

		<!-- 图片 -->
		<div class="imgs">
			<div class="image" v-for="(a, temp) in data.imgShowAll" @click="showImg(temp)">
				<Myimage :src='imgSrcs(temp)'></Myimage>
			</div>
			<div class="imgsAdd" v-if="data.imgShowAll && data.imgShowAll > 6">
				<span>+{{ data.imgAllNum ? data.imgAllNum - 6 : '0' }}</span>
			</div>
		</div>
		<!-- 视频 -->
		<div  class="video" >
			 <div v-for="(a,index) in data.videoNum" @click="playVideo(index)">
				<img src="../../assets/img/videIon.png">
				<Myimage :src='videoSrc(index)'></Myimage>
			 </div>
		</div>

		<div class="di">
			<!-- 日期 -->
			<div class="date" @click="showX">
				<span>2024-9-3</span>
			</div>

			<!-- 选项 -->
			<div class="xuan" v-show="getV()?.isPlss">
				<img @click.stop="getV()!.isInput = !getV()!.isInput" src="../../assets/img/pl.png"
					style="width: 30px;height: 30px; margin-left: 6px;"></img>
				<img @click.stop="isDels()" src="../../assets/img/del.png" style="width: 30px;height: 30px;    left: 20px;
				position: relative;"></img>
			</div>
		</div>
		<!-- 评论输入 -->
		<div class="shhuru" @click.stop='nulls' v-show="getV()!.isInput">
			<textarea v-model="getV()!.plText" @click.stop='nulls'></textarea>
			<van-button @click.stop="setPls()" type="primary">发送</van-button>
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

		<hr>
		<div style="height: 20px;">

		</div>

	</div>
</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue';
import { type A } from '../../dtData/dtType';
import Myimage from '../image/Myimage.vue';
import { findvData } from '@/dtData/VcData';
import { showSuccessToast, showFailToast, showConfirmDialog } from 'vant';
import { delDts, postCom, getTouxian, getEmoSrc, imgSrc,dtVideoImg } from '@/api/api';
import { token } from '@/getToken';
import { dtData } from '@/dtData/getList';




//获取父组件传入数据
const props = defineProps<{ datas: A | undefined }>();

let data = ref<A>();

setTimeout(()=>{
	// console.log(data);
})




let vData: {
	id: number;
	isPlss: boolean;
	isInput: boolean;
	plText: string;
};






// 监听props.datas的变化
watch(
	() => props.datas,
	(newVal) => {
		if (newVal !== undefined) {
			data.value = newVal;
		}
	},
	{ immediate: true } // 当props.datas初始值为undefined时，immediate确保一开始就会执行
);



const emit = defineEmits(['clicks', 'showImg','showVideo']);



function emosrc(name: string) {
	return getEmoSrc(name);
}

function imgSrcs( index:number){
	let dtid = data.value?.id || 0;
	return imgSrc(dtid,index);
}

function videoSrc(index:number){
	let dtid = data.value?.id || 0;
	return dtVideoImg(dtid,index);
}

function showImg(temp: number) {
	let id = data.value?.id;
	emit('showImg', {
		dtid: id,
		index: temp,
	});
}

function playVideo(temp:number){
	let id = data.value?.id;
	emit('showVideo', {
		dtid: id,
		index: temp,
	});
}



function getV() {
	if (vData) {
		return vData;
	}
	let id = data.value?.id;
	if (id) {
		vData = findvData(id);
		return vData;
	}
}

//删除动态
function isDels() {
	let id = data.value?.id;
	if (!id) {
		return
	}

	showConfirmDialog({
		title: '确认删除',
		message:
			'如果解决方法是丑陋的，那就肯定还有更好的解决方法，只是还没有发现而已。',
	})
		.then(() => {
			let id = data.value!.id;
			delDts(String(id), token).then((res: any) => {
				if (res.tf == 1) {
					showSuccessToast('成功文案');
					dtData.del(id);
				}
			})
		})
		.catch(() => {
			showSuccessToast('删除失败');
		});

}

//显示与隐藏选项
function showX() {
	getV()!.isPlss = !getV()!.isPlss;
	if (getV()!.isInput && !getV()!.isPlss) {
		getV()!.isInput = false
	}
}

function nulls() {

}

function setPls() {
	//调用提交接口
	// ----
	let uptext = getV()!.plText;
	let id = data.value!.id;
	postCom(uptext, String(id), token).then((res: any) => {
		if (res.tf == 1) {
			showSuccessToast('成功文案');
			data.value?.com.push({
				name: '不爱吃糖',
				content: uptext,
				commentsUser: '',
				date: '',
				diId: 0
			})
		} else {
			showFailToast('失败')
		}
	})



}



</script>


<style lang="less" scoped>
@import url('./dts.less');
</style>