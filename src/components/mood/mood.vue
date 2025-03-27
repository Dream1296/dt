<template>

    <div id="all">
        <topView :touxianSrc="getTouxian(data.touxian)" :name="data.name" :dtid="data.id"></topView>
        <div id="froms">
            <van-swipe indicator-color="black">

                <van-swipe-item v-for="i in 3" :key="i">
                    <div class="from">
                        <!-- <div class="Selected">开心</div> -->
                        <div v-for="a in moods[i - 1]" @click="setMood(a)" :class="{ selected: (myMood == a) }">
                            {{ a }}
                        </div>
                    </div>
                </van-swipe-item>

            </van-swipe>

        </div>

        <div id="but" :class="{ selectedBnt: butText != '我的心情是这样' }" @click="moodAdd">
            {{ butText }}
        </div>
    </div>
    <!-- <div id="date">2024-11-28</div> -->



</template>


<script setup lang="ts">
import Line from '../fenge/line.vue';
import { getTouxian, setMood as setMoodApi } from '@/api/api';
import topView from '../TopView/topView.vue';
import { ref, watch } from 'vue';
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant';
import { } from '@/api/api';
import type { Mood } from '@/type/dtType';

let data = ref<Mood>({
    type:'mood',
    id:"999",
    touxian:'xt',
    name:"表单"
});
const props = defineProps<{ datas: Mood | undefined }>();

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




// 定义心情数据
const moods = [
    ['开心', '充实', '惊喜', '得意', '暖心', '平静'],
    ['难过', '烦躁', '迷惘', '孤独', '生气', '尴尬'],
    ['委屈', '甜蜜', '梦境', '疲惫', '逃避', '不知道']
];

let myMood = ref("");

let butText = ref("我的心情是这样");

function setMood(mood: string) {
    myMood.value = mood
    butText.value = "是" + mood + '啊';
}

function moodAdd() {
    if (!myMood.value) {
        return
    }
    showConfirmDialog({
        title: '确定提交',
        message:
            '如果解决方法是丑陋的，那就肯定还有更好的解决方法，只是还没有发现而已。',
    })
        .then(() => {
            setMoodApi(myMood.value).then((data) => {
                if (data.code == 200 && data.tf == 1) {
                    showSuccessToast("提交成功");
                }
            }).catch((error: any) => {
                showFailToast('失败文案');
                console.log(error);
            })
        })
        .catch(() => {

        });
}

</script>


<style scoped lang="less">
@import url('./mood.less');
</style>