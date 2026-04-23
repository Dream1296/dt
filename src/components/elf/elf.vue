<template>
    <div
        id="all"
        :class="{ dragging: isDragging }"
        :style="{
            top: `${allTop}px`,
            left: `${allLeft}px`,
            width: `${size}px`,
            height: `${size}px`,
        }"
        @click="handleClick"
        @pointerdown="handlePointerDown"
    >
        <div class="elf-shell">
            <div class="elf-core">
                <img src="../../assets/img/jingling.png" alt="elf" draggable="false">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { viewDataStore } from '@/stores/viewDataStore';

const viewData = viewDataStore();

const size = computed(() => 58);
const allTop = ref(0);
const allLeft = ref(0);
const isDragging = ref(false);
const hasMoved = ref(false);
const pointerId = ref<number | null>(null);
const startPointerX = ref(0);
const startPointerY = ref(0);

function clampPosition(x: number, y: number) {
    const half = size.value / 2;
    const maxX = Math.max(half, window.innerWidth - half);
    const maxY = Math.max(half, window.innerHeight - half);

    viewData.elfX = Math.min(Math.max(x, half), maxX);
    viewData.elfY = Math.min(Math.max(y, half), maxY);
}

function syncPosition() {
    allTop.value = viewData.elfY - size.value / 2;
    allLeft.value = viewData.elfX - size.value / 2;
}

function setDefaultPosition() {
    clampPosition(window.innerWidth - 72, window.innerHeight - 86);
    syncPosition();
}

function ensurePosition() {
    if (!viewData.elfX || !viewData.elfY) {
        setDefaultPosition();
        return;
    }

    clampPosition(viewData.elfX, viewData.elfY);
    syncPosition();
}

function updateFromPointer(clientX: number, clientY: number) {
    clampPosition(clientX, clientY);
    syncPosition();
}

function handlePointerMove(e: PointerEvent) {
    if (pointerId.value !== e.pointerId) {
        return;
    }

    e.preventDefault();

    if (!hasMoved.value) {
        const movedX = Math.abs(e.clientX - startPointerX.value);
        const movedY = Math.abs(e.clientY - startPointerY.value);
        if (movedX > 3 || movedY > 3) {
            hasMoved.value = true;
        }
    }

    isDragging.value = true;
    updateFromPointer(e.clientX, e.clientY);
}

function stopPointerTracking() {
    pointerId.value = null;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);

    window.setTimeout(() => {
        isDragging.value = false;
    }, 60);
}

function handlePointerUp(e: PointerEvent) {
    if (pointerId.value !== e.pointerId) {
        return;
    }

    stopPointerTracking();
}

function handlePointerDown(e: PointerEvent) {
    e.preventDefault();
    pointerId.value = e.pointerId;
    hasMoved.value = false;
    isDragging.value = false;
    startPointerX.value = e.clientX;
    startPointerY.value = e.clientY;

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
}

function handleClick() {
    if (hasMoved.value) {
        hasMoved.value = false;
        return;
    }

    viewData.showV = !viewData.showV;
}

function handleResize() {
    ensurePosition();
}

watch(
    () => [viewData.elfX, viewData.elfY, size.value],
    () => {
        ensurePosition();
    },
    { immediate: true }
);

onMounted(() => {
    ensurePosition();
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    stopPointerTracking();
    window.removeEventListener('resize', handleResize);
});
</script>

<style lang="less" scoped>
@import "./elf.less";
</style>
