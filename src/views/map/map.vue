<template>
	<div id="map">
		<div id="map_img"><img src="../../assets//img/map_img1.png"></div>
		<div id="nei">
			<div class="path-point-container" v-for="value in pathPointArr" :key="value.x + '-' + value.y"
				:style="{ left: value.x + '%', top: value.y + '%' }">
			</div>

			<!-- <div class="path-point-container">
			</div> -->
		</div>


	</div>
</template>


<script setup lang="ts">
import { getKeepMapGps } from '@/api/api';
import { ref } from 'vue';

let pathPointArr = ref<{ x: number; y: number }[]>([]);

const config = {
	xScale: 2013.085052843747,

	offsetX: 24.301,

	offsetY: 30.663706862147624,

	
}


getKeepMapGps(1)
	.then(res => {
		let project = createProjector(res, config);

		let data: { x: number; y: number }[] = [];
		for (let i = 0; i < res.length;) {
			// data.push(project(res[i]));
			data.push(lngLatToPixel(res[i].E, res[i].N));
			i = i + 30;
		}
		console.log(data);
		pathPointArr.value = data;
	})





function lngLatToPixel(E: number, N: number) {
    return {
        x: E * 2013.085053 - 245692.01,
        y: N * -4555.711983 + 139398.29
    };
}




interface ProjectConfig {

	// 每度经度对应多少像素
	xScale: number;

	// 偏移
	offsetX: number;
	offsetY: number;
}
function createProjector(
	points: {
		time: number;
		E: number;
		N: number;
	}[],
	config: ProjectConfig
) {

	const centerE =
		(Math.min(...points.map(p => p.E))
			+
			Math.max(...points.map(p => p.E)))
		/ 2;


	const centerN =
		(Math.min(...points.map(p => p.N))
			+
			Math.max(...points.map(p => p.N)))
		/ 2;



	// 纬度中心
	const lat =
		centerN * Math.PI / 180;



	// 经纬度实际比例修正
	const cos =
		Math.cos(lat);

	console.log(centerE, centerN, cos);




	return function (point: { time: number; E: number; N: number }) {

		let x =
			(point.E - centerE)
			*
			config.xScale;


		let y =
			-(point.N - centerN)
			*
			config.xScale
			/
			cos;


		//地图偏移
		x += config.offsetX;
		y += config.offsetY;


		return {
			x,
			y
		};
	}

}

</script>



<style lang="less" scoped>
@import url('./map.less');

#map {
	width: 100vw;
	height: 100vh;
	background-color: rgb(171, 137, 137);
	position: relative;
}

@mapPadding: 2.5%;

#nei {
	width: calc(100% - @mapPadding * 2);
	height: calc(100% - @mapPadding * 2);
	left: @mapPadding;
	top: @mapPadding;
	// background-color: rgb(131, 47, 47);
	// transform: scale(1.2);
	position: relative;
}

#map_img {
	width: calc(100% - @mapPadding * 2);
	height: calc(100% - @mapPadding * 2);
	left: @mapPadding;
	top: @mapPadding;
	// background-color: rgb(131, 47, 47);
	position: absolute;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}

@mapPathSize: 5px;

.path-point-container {
	width: @mapPathSize;
	height: @mapPathSize;
	background-color: rgb(128, 0, 0);
	left: 0%;
	top: 0%;
	position: absolute;
}
</style>