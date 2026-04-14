<template>
<div class="zhu" v-if="data" >
		<topView :dtid="dtid" :touxian-src="getTouxian('yw')" :name="data.name"></topView>
		<!-- 正文 -->
		<div class="text">
		</div>

		<!-- 图片 -->
		<div class="imgs">
			<div class="image">
				<img :src="src">
			</div>
		</div>
		
		
		<div class="di">
			<!-- 日期 -->
			<div class="date" >
				<span>2024-01-21</span>
			</div>

			<!-- 选项 -->
			<div class="xuan" v-show="getV()?.isPlss">
				<img @click.stop="getV()!.isInput = !getV()!.isInput" src="../../assets/img/pl.png"
					style="width: 30px;height: 30px; margin-left: 6px;"></img>
				<img  src="../../assets/img/del.png" style="width: 30px;height: 30px;    left: 20px;
				position: relative;"></img>
				<img  src="../../assets/img/xq.png" style="width: 30px;height: 30px;    left: 36px;
				position: relative;"></img>
			</div>
		</div>
		
        
	</div>


</template>


<script setup lang="ts">
import type { A, dataImg } from '@/types/dtType';
import { ref, watch } from 'vue';
import Myimage from '../image/Myimage.vue';
import { findvData } from '@/dtData/VcData';
import { showSuccessToast, showFailToast, showConfirmDialog } from 'vant';
import { delDts, postCom, getTouxian, getEmoSrc, imgSrc,dtVideoImg, Internet } from '@/api/api';
import { dtData } from '@/dtData/dtList';
import router from '@/router';
import { styleText } from 'util';
import Line from '../fenge/line.vue';
import topView from '../TopView/topView.vue';



//获取父组件传入数据
const props = defineProps<{ datas: dataImg | undefined }>();

let dtid = ref("999");


let vData: {
	id: number;
	isPlss: boolean;
	isInput: boolean;
	plText: string;
};

let data = ref<dataImg>();
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

// let src = ref("https://frp-fix.top:20047/api/dtDataImg?year=2024");
let src = ref(Internet.url + "/api/dtDataImg?year=2026");




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


</script>



<style lang="less" scoped>
@import url('@/assets/css/public.less');
@import url('./dtForm.less');
</style>