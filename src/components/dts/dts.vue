<template>
	<div class="zhu" v-if="data">
		<!-- 顶部小样式 -->
		<StyleTop :bgStyle="data.bgStyle"></StyleTop>
		<!-- 头像与名字 -->
		<topView :touxianSrc="getTouxian('yw')" :name="data.name" :dtid="data.id.toString()"></topView>

		<!-- 正文 -->
		<div class="text">
			<template v-for="(a, temp) in (data.textArr.slice(0, textLen))">
				<span v-if="a.type == 'text' && a.text != '\n'">{{ a.text }}</span>
				<br v-if="a.type == 'text' && a.text == '\n'">
				<img v-if="a.type == 'emoji'" :src="getEmojiSrc(a.text)" />
			</template>
			<span style="color: blueviolet;" v-if="data.textArr?.length > textLen"
				@click="textLen = 10000">。。。(显示更多)</span>
		</div>

		<!-- 图片 -->
		<div class="imgs" :class="['imgs', `imgs${data.imgShowAll + data.videoShowAll}`]">
			<div :class="['image', `image${data.imgShowAll + data.videoShowAll}`]"
				:style="{ aspectRatio: data.imgShowProportion[temp] }"
				v-for="(a, temp) in (data.imgShowAll + data.videoShowAll)"
				@click="showImg(data.imgShowAll, data.videoShowAll, temp)">

				<div class="imgCover" v-if="temp < data.imgShowAll">
					<Myimage :src='imgSrcsc(temp)'></Myimage>
				</div>

				<div class="videoCover" v-if="temp >= data.imgShowAll">
					<Myimage :src='videoSrc(temp - data.imgShowAll)'></Myimage>
					<img class="videoLogo" src="../../assets/img/videIon.png">
				</div>

			</div>

			<!-- <div class="imgsAdd" v-if="data.imgShowAll && data.imgShowAll > 6">
				<span>+{{ data.imgAllNum ? data.imgAllNum - 6 : '0' }}</span>
			</div> -->
			<!-- <div class="video" v-for="(a, index) in (data.videoNum ? 1 : 0)" @click="playVideo(index)">
				<img class="videoCover" src="../../assets/img/videIon.png">
				<Myimage :src='videoSrc(index)'></Myimage>
			</div> -->
		</div>
		<!-- 视频 -->
		<!-- <div class="video">
			<div v-for="(a, index) in (data.videoNum ? 1 : 0)" @click="playVideo(index)">
				<img src="../../assets/img/videIon.png">
				<Myimage :src='videoSrc(index)'></Myimage>
			</div>
		</div> -->
		<van-switch v-if="data.id == 562" v-model="isMo" />

		<div id="thressV" v-if="data.id == 562 && isMo">
			<!-- <threeView modelPath="./小凳子.glb"></threeView> -->

		</div>

		<div class="lvLogos" v-if="data.longVideo">

			<div class="lvLogo" v-for="a in data.longVideo" @click="tzlv(a.id)">
				{{ a.name }}
			</div>

		</div>

		<!-- 长文本显示 -->
		<div class="lvLogos" v-if="data.text.length > textLen">
			<div class="lvLogo" @click="tzlt(data.id)">
				在长文本中查看动态
			</div>
		</div>

		<div class="lvLogos" v-for="(longText, temp) in data.longText" :id="longText.id.toString()">
			<div class="lvLogo" @click="tzlongtext(data.id, temp)">
				{{ longText.tetile }}
			</div>
		</div>

		<div class="lvLogos" v-for="(chat, temp) in data.chatRoot" :id="chat.rootId.toString()">
			<div class="lvLogo" @click="tzChat(chat.rootId)">
				{{ chat.name }}
			</div>
		</div>




		<div class="lvLogos" v-if="data.File">

			<div class="lvLogo" @click="dowFile(data.File.fileId)">
				{{ data.File.name }}
			</div>

		</div>

		<div class="di">
			<!-- 日期 -->
			<div class="date" @click="showX">
				<span>{{ data.date.slice(0, 10) }}</span>
			</div>

			<!-- 选项 -->
			<div class="xuan" v-show="getV()?.isPlss">
				<img @click.stop="getV()!.isInput = !getV()!.isInput" src="../../assets/img/pl.png"
					style="width: 30px;height: 30px; margin-left: 6px;"></img>
				<img @click.stop="isDels()" src="../../assets/img/del.png" style="width: 30px;height: 30px;    left: 20px;
				position: relative;"></img>
				<img @click.stop="tzXq(data.id)" src="../../assets/img/xq.png" style="width: 30px;height: 30px;    left: 36px;
				position: relative;"></img>
			</div>
		</div>
		<!-- 评论输入 -->
		<div class="shhuru" @click.stop='nulls' v-show="getV()!.isInput">
			<textarea ref="textarea" @input="textInputHeightAuto" v-model="getV()!.plText"
				@click.stop='nulls'></textarea>
			<van-button @click.stop="setPls()" type="primary">发送</van-button>
		</div>

		<div v-if="data.com && data.com.length > 0">
			<CommentShow :data="data.com"></CommentShow>
		</div>


		<!-- <hr> -->
		<!-- <div id="line"></div> -->
		<!-- <div style="height: 20px;"></div> -->

		<div class="ding" v-show="data.po != 0">
			<img src="../../assets/img/ding.png">
		</div>

	</div>
</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue';
import { type A } from '../../type/dtType';
import Myimage from '../image/Myimage.vue';
import { findvData } from '@/dtData/VcData';
import { showSuccessToast, showFailToast, showConfirmDialog, Toast, Dialog, showToast } from 'vant';
import { delDts, postCom, getTouxian, getEmoSrc, imgSrc, dtVideoImg, dtFileDow, Internet } from '@/api/api';
import { dtData } from '@/dtData/dtList';
import router from '@/router';
import { styleText } from 'util';
import Line from '../fenge/line.vue';
import { tempStore } from '@/stores/tempStore';
import topView from '../TopView/topView.vue';
import StyleTop from '../styleTop/styleTop.vue';
import threeView from '@/components/threeView/threeView.vue';
import { token } from '@/api/token';
import { emojiNamesUrl, emojiNames, getEmojiSrc } from '@/util/dt/emoji';
import axios from 'axios';
import { userStore } from '@/stores/userStore';
import CommentShow from '../comment/commentShow.vue';


let imgTemp = tempStore();

//获取父组件传入数据
const props = defineProps<{ datas: A | undefined }>();

let data = ref<A>();

let isMo = ref(false);

const textarea = ref<HTMLTextAreaElement>();

const userStoreData = userStore();






let textLen = ref(60);

let vData: {
	id: number;
	isPlss: boolean;
	isInput: boolean;
	plText: string;
};

function tzlv(id: number) {
	router.push({ path: '/Lvi', query: { id: id } });
}

function tzlt(id: number) {
	router.push({ path: '/longText/b/' + id, });
}


function tzlongtext(id: number, index: number) {
	router.push({ path: '/longText/a/' + id });
}

function tzChat(id: string) {
	router.push({ path: '/chat/' + id });
}


function dowFile(id: string) {
	showConfirmDialog({
		title: '确定要下载吗？',
		message:
			'如果解决方法是丑陋的，那就肯定还有更好的解决方法，只是还没有发现而已。',
	})
		.then(() => {
			dtFileDow(id)
		})
		.catch(() => {
			showSuccessToast('用户取消');
		});

}





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



const emit = defineEmits(['clicks', 'showImg', 'showVideo']);



function emosrc(name: string) {
	// emojiNamesUrl.
	// return getEmoSrc(name);
}

function imgSrcsc(index: number) {
	let dtid = data.value?.id || 0;
	return imgSrc(dtid, index, '0');
}

function videoSrc(index: number) {
	let dtid = data.value?.id || 0;
	return dtVideoImg(dtid, index);
}

function tzXq(index: number) {
	router.push({ path: '/dts/' + index });
}


function showImg(imgNum: number, videoNum: number, temp: number) {
	if (temp >= imgNum) {
		playVideo(temp - imgNum);
		return
	}
	let id = data.value?.id;
	imgTemp.imgLog = imgSrc(Number(id), temp, '0');
	imgTemp.imgSrc = imgSrc(Number(id), temp, '1');
	if (userStoreData.isPc) {
		window.open(imgTemp.imgSrc, '_blank');
		return
	}


	// router.push({
	// 	path: '/imgs', query: {
	// 		dtid: id,
	// 		index: temp
	// 	}
	// });

	router.push({
		path: '/imgs/' + id + '/' + temp,

	});
}

function playVideo(temp: number) {
	let url = Internet.url;
	let a = `${url}/api/dtvideo?dtid=${data.value?.id}&index=${temp}&token=${token.tempToken}`;
	if (userStoreData.isPc) {
		window.open(a, '_blank');
		return
	}


	let id = data.value?.id;
	emit('showVideo', {
		dtid: id,
		index: temp,
	});
}

// 自动调整 textarea 高度
const textInputHeightAuto = () => {
	const textareas = textarea.value;
	if (textareas == null) {
		return
	}
	// 重置高度以便重新计算
	textareas.style.height = 'auto';
	// 设置新的高度，确保文本框不小于最小高度
	textareas.style.height = Math.max((textareas.scrollHeight + 40), 150) + 'px';

};


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

	if (token.istoken == 'false') {
		showFailToast('拒绝操作');
		return
	}

	showConfirmDialog({
		title: '确认删除',
		message:
			'如果解决方法是丑陋的，那就肯定还有更好的解决方法，只是还没有发现而已。',
	})
		.then(() => {
			let id = data.value!.id;
			delDts(String(id)).then((res: any) => {
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

	if (token.istoken == 'false') {
		showFailToast('拒绝操作');
		return
	}
	postCom(uptext, String(id)).then((res: any) => {
		if (res.tf == 1) {
			showSuccessToast('成功文案');
			data.value?.com.push({
				name: '不爱吃糖',
				content: uptext,
				commentsUser: '',
				date: '',
				dtId: 0,
				imgAllNum: 0,
				id: -1,
			})
		} else {
			showFailToast('失败');
		}
	})



}



</script>


<style lang="less" scoped>
@import url('@/assets/css/public.less');
@import url('./dts.less');
</style>