<template>
    <div class="panel" :class="{ mobile: !isPc }" :style="panelStyle" v-show="viewData.showV">
        <div v-if="isPc" class="panel-head">
            <div>
                <p class="panel-tag">Quick Actions</p>
                <h3>快捷操作</h3>
            </div>
            <span class="panel-state">{{ viewData.isShowDy ? '动态已展开' : '动态已折叠' }}</span>
        </div>

        <div class="action-list">
            <button class="action-card" type="button" @click="upData">
                <span class="icon-wrap">
                    <img src="../../assets/img/dy.png" v-show="viewData.isShowDy">
                    <img src="../../assets/img/dy0.png" v-show="!viewData.isShowDy">
                </span>
                <span class="action-text">
                    <strong>{{ viewData.isShowDy ? '隐藏动态' : '显示动态' }}</strong>
                    <small>切换首页动态内容展示</small>
                </span>
            </button>

            <button class="action-card" type="button" @click="toTop">
                <span class="icon-wrap">
                    <img src="../../assets/img/ic_回到顶部.png">
                </span>
                <span class="action-text">
                    <strong>回到顶部</strong>
                    <small>平滑返回页面顶部位置</small>
                </span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { viewDataStore } from '@/stores/viewDataStore';
import { dtDataInit } from '@/dtData/getList';
import { myEvent } from '@/myEnit';

const viewData = viewDataStore();

const isPc = computed(() => window.innerWidth >= 768);
const panelLeft = ref(0);
const panelTop = ref(0);
const panelWidth = computed(() => (isPc.value ? 320 : 176));
const panelHeight = computed(() => (isPc.value ? 184 : 72));
const gap = computed(() => (isPc.value ? 18 : 12));

const panelStyle = computed(() => ({
    left: `${panelLeft.value}px`,
    top: `${panelTop.value}px`,
    width: `${panelWidth.value}px`,
}));

function upData() {
    viewData.isShowDy = !viewData.isShowDy;
    dtDataInit(viewData.loa).then(() => {
        myEvent.emit('upDtList');
    });
}

function updatePanelPosition() {
    const margin = 14;
    const preferredLeft = viewData.elfX - panelWidth.value - gap.value;
    const preferredTop = viewData.elfY - panelHeight.value / 2;
    const fallbackRight = viewData.elfX + 40;
    const maxLeft = window.innerWidth - panelWidth.value - margin;
    const maxTop = window.innerHeight - panelHeight.value - margin;

    let nextLeft = preferredLeft;
    if (preferredLeft < margin) {
        nextLeft = fallbackRight;
    }

    panelLeft.value = Math.min(Math.max(nextLeft, margin), maxLeft);
    panelTop.value = Math.min(Math.max(preferredTop, margin), maxTop);
}

function toTop() {
    const duration = 500;
    const start = window.scrollY || window.pageYOffset;
    const startTime = performance.now();

    function animate(currentTime: any) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        window.scrollTo(0, start * (1 - ease));
        myEvent.emit('upLookDtId', -1);
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function handleResize() {
    updatePanelPosition();
}

watch(
    () => [viewData.elfX, viewData.elfY, viewData.showV, viewData.isShowDy, panelWidth.value, panelHeight.value],
    () => {
        updatePanelPosition();
    },
    { immediate: true }
);

onMounted(() => {
    updatePanelPosition();
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});
</script>

<style lang="less" scoped>
@import "./configV.less";
</style>
