<template>
<div class="zhu" v-if="data" >
		<!-- 头像 -->
		<div class="touxian">
			<img :src="getTouxian('yw')"></img>
		</div>
		<!-- 名字 -->
		<div class="name">
			<span>{{ data.name }} {{ data.id }}</span>
		</div>
		<!-- 正文 -->
		<div class="text">
		</div>

		<!-- 图片 -->
		<div class="imgs">
			
		</div>
		

		<div class="di">
			<!-- 日期 -->
			<div class="date" >
				<span>{{ data.date.slice(0,10) }}</span>
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
import type { A } from '@/dtData/dtType';
import { ref, watch } from 'vue';
import Myimage from '../image/Myimage.vue';
import { findvData } from '@/dtData/VcData';
import { showSuccessToast, showFailToast, showConfirmDialog } from 'vant';
import { delDts, postCom, getTouxian, getEmoSrc, imgSrc,dtVideoImg } from '@/api/api';
import { dtData } from '@/dtData/getList';
import router from '@/router';
import { styleText } from 'util';


//获取父组件传入数据
const props = defineProps<{ datas: A | undefined }>();

let vData: {
	id: number;
	isPlss: boolean;
	isInput: boolean;
	plText: string;
};

let data = ref<A>();
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




</style>