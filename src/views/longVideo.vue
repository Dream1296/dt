<template>
  <div id="main">
    <div id="title">
      <h1>{{ title }}</h1>
    </div>

    <div id="sp">
      <video v-if="videoSrc" ref="videoPlayer" class="video-js vjs-default-skin" controls preload="auto">
        <source :src="videoSrc" :type="videoType" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>


</template>


<script setup lang="ts">
import { getlvObj ,Internet } from '@/api/api';
import { ref } from 'vue';
import { useRoute } from 'vue-router';



const route = useRoute();
const lvid = Number( route.query.id);

let videoSrc = ref('');
let title = ref('正在加载');
let videoType = 'video/mp4';


getlvObj(lvid).then(data =>{
  videoSrc.value = Internet.url + '/api/lvi?src=' + data.src;
  title.value = data.name;
})




console.log(route.query.name);






</script>


<style scoped lang="less">
#main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
#title{
  width: 100%;
  text-align: center;
}

#sp {
  width: 80%;
  video{
    width: 100%;
    height: 100%;
  }

}
</style>