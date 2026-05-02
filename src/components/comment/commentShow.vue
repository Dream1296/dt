<template>
	<div class="commentShow">
		<!-- 评论显示 -->
		<div class="pl">
			<div class="pls" v-for="pl in props.data">
				<span>
					{{ pl.name }}
				</span>
				<span>:</span>
				<span class="plText">
					{{ pl.content }}
				</span>
				<span v-for="a in pl.imgAllNum" v-if="!props.showImg">
					[图片]
				</span>
				<div id="imgShow" v-if="props.showImg">
					<div v-for="(a, index) in pl.imgAllNum" class="img_item">
						<Myimage :src="getImgSrc(pl.id,a-1)"></Myimage>
					</div>
				</div>

			</div>


		</div>
	</div>

</template>


<script setup lang="ts">
import type { Com } from "@/types/dtType";
import { ref } from "vue";
import Myimage from '@/components/image/Myimage.vue'
import { plPL } from "naive-ui";
import { imgSrc, imgSrcCom } from "@/api/api";


const props = withDefaults(defineProps<{
	data: Com[],
	showImg?: boolean;
	imgSrc?: string[];
}>(), {
	showImg: false,
});

function getImgSrc(comId:number,index: number) {	
	
	
	return imgSrcCom( comId , index, '0');
}



</script>


<style lang="less" scoped>
@import url('./commentShow.less');
</style>
