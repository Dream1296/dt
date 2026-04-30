<template>
    <div class="panel" :class="{ mobile: !isPc }" :style="panelStyle" v-show="viewData.showV">
        <div v-if="isPc" class="panel-head">
            <div>
                <h3>快捷操作</h3>
            </div>
        </div>

        <div class="action-list">
            <button class="action-card" type="button" @click="upData">
                <span class="icon-wrap">
                    <img src="../../assets/img/dy.png" v-show="viewData.isShowDy">
                    <img src="../../assets/img/dy0.png" v-show="!viewData.isShowDy">
                </span>
            </button>

            <button class="action-card" type="button" @click="toTop">
                <span class="icon-wrap">
                    <img src="../../assets/img/ic_回到顶部.png">
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
const panelWidth = computed(() => (isPc.value ? 168 : 132));
const panelHeight = computed(() => (isPc.value ? 108 : 92));
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
    const elfSize = 58;
    const elfHalf = elfSize / 2;
    const preferredLeft = viewData.elfX - panelWidth.value - gap.value - elfHalf;
    const preferredRight = viewData.elfX + elfHalf + gap.value;
    const preferredTop = viewData.elfY - panelHeight.value / 2;
    const maxLeft = Math.max(margin, window.innerWidth - panelWidth.value - margin);
    const maxTop = Math.max(margin, window.innerHeight - panelHeight.value - margin);

    let nextLeft = preferredLeft;
    const canPlaceLeft = preferredLeft >= margin;
    const canPlaceRight = preferredRight <= maxLeft;

    if (!canPlaceLeft) {
        nextLeft = canPlaceRight ? preferredRight : maxLeft;
    }

    if (canPlaceLeft && canPlaceRight) {
        const leftSpace = viewData.elfX - elfHalf - margin;
        const rightSpace = window.innerWidth - viewData.elfX - elfHalf - margin;
        nextLeft = rightSpace > leftSpace ? preferredRight : preferredLeft;
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
