<template>
	<div class="zhu" v-if="data">
		<StyleTop :bgStyle="data.bgStyle"></StyleTop>
		<topView :touxianSrc="getTouxian('yw')" :name="data.name" :dtid="data.id.toString()"></topView>

		<!-- 正文 -->
		<div class="text">
			<template v-for="(a, temp) in data.textArr.slice(0, textLen)">
				<span v-if="a.type == 'text' && a.text != '\n'">{{ a.text }}</span>
				<br v-if="a.type == 'text' && a.text == '\n'">
				<img v-if="a.type == 'emoji' && emojiNamesUrl[emojiNames.findIndex(obj => obj == a.text)]"
					:src="emojiNamesUrl[emojiNames.findIndex(obj => obj == a.text)]" />
			</template>
			<span style="color: blueviolet;" v-if="data.textArr.length > textLen"
				@click="textLen = 10000">。。。(显示更多)</span>
		</div>

		<!-- 图片 -->
		<div class="imgs">
			<div class="image" v-for="(a, temp) in data.imgShowAll" @click="showImg(temp)">
				<Myimage :src='imgSrcsc(temp)'></Myimage>
			</div>
			<div class="imgsAdd" v-if="data.imgShowAll && data.imgShowAll > 6">
				<span>+{{ data.imgAllNum ? data.imgAllNum - 6 : '0' }}</span>
			</div>
		</div>
		<!-- 视频 -->
		<div class="video">
			<div v-for="(a, index) in (data.videoNum ? 1 : 0)" @click="playVideo(index)">
				<img src="../../assets/img/videIon.png">
				<Myimage :src='videoSrc(index)'></Myimage>
			</div>
		</div>
		<van-switch v-if="data.id == 562" v-model="isMo" />

		<div id="thressV" v-if="data.id == 562 && isMo">
			<threeView modelPath="./小凳子.glb"></threeView>

		</div>

		<div class="lvLogos" v-if="data.longVideo">

			<div class="lvLogo" v-for="a in data.longVideo" @click="tzlv(a.id)">
				{{ a.name }}
			</div>

		</div>

		<div class="lvLogos" v-if="data.textTile">

			<div class="lvLogo" @click="tzlt(data.id)">
				{{ data.textTile }}
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

		<!-- <hr> -->
		<!-- <div id="line"></div> -->
		<!-- <div style="height: 20px;"></div> -->
		<Line></Line>

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
import { showSuccessToast, showFailToast, showConfirmDialog } from 'vant';
import { delDts, postCom, getTouxian, getEmoSrc, imgSrc, dtVideoImg, imgSrcs } from '@/api/api';
import { dtData } from '@/dtData/getList';
import router from '@/router';
import { styleText } from 'util';
import Line from '../fenge/line.vue';
import { tempStore } from '@/stores/tempStore';
import topView from '../TopView/topView.vue';
import StyleTop from '../styleTop/styleTop.vue';
import threeView from '@/components/threeView/threeView.vue';
import { token } from '@/api/token';
import { emojiNamesUrl, emojiNames } from '@/util/dt/emoji';

let imgTemp = tempStore();

//获取父组件传入数据
const props = defineProps<{ datas: A | undefined }>();

let data = ref<A>();

let isMo = ref(false);




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
	router.push({ path: '/longText', query: { id: id } });

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
	return imgSrc(dtid, index);
}

function videoSrc(index: number) {
	let dtid = data.value?.id || 0;
	return dtVideoImg(dtid, index);
}

function tzXq(index: number) {
	router.push({ path: '/dts', query: { dtid: index } });
}


function showImg(temp: number) {
	let id = data.value?.id;
	imgTemp.imgLog = imgSrcsc(temp);
	imgTemp.imgSrc = imgSrcs(Number(id), temp);

	router.push({
		path: '/imgs', query: {
			dtid: id,
			index: temp
		}
	});
}

function playVideo(temp: number) {
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
				diId: 0
			})
		} else {
			showFailToast('失败');
		}
	})



}



</script>


<style lang="less" scoped>
@import url('./dts.less');
</style>