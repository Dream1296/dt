<template>
    <div class="dt-op">
        <transition name="dt-op-toast">
            <div v-if="toastText" class="dt-op__toast">
                {{ toastText }}
            </div>
        </transition>

        <n-spin :show="loading || saving" class="dt-op__spin">
            <div class="dt-op__container">
                <n-card size="small" :bordered="false" class="dt-op__header">
                    <div class="dt-op__header-row">
                        <div class="dt-op__window-actions">
                            <button class="dt-op__action dt-op__action--close" type="button" title="关闭" @click="emit('close')">
                                <span>×</span>
                            </button>
                            <button class="dt-op__action dt-op__action--min" type="button" title="最小化" @click="emit('minimize')">
                                <span>−</span>
                            </button>
                            <button class="dt-op__action dt-op__action--full" type="button" title="全屏" @click="handleFullscreenClick">
                                <span>+</span>
                            </button>
                        </div>
                        <div class="dt-op__header-main">
                            <div class="dt-op__title">动态管理</div>
                            <div class="dt-op__subtitle">ID #{{ props.dtId }}</div>
                        </div>
                        <n-button size="tiny" secondary :disabled="loading || saving" @click="loadData">
                            刷新
                        </n-button>
                    </div>
                </n-card>

                <n-result
                    v-if="errorText"
                    status="error"
                    title="数据加载失败"
                    :description="errorText"
                    class="dt-op__result"
                >
                    <template #footer>
                        <n-button size="tiny" @click="loadData" :disabled="saving">重新加载</n-button>
                    </template>
                </n-result>

                <template v-else-if="data">
                    <div class="dt-op__grid">
                        <n-card title="loa" size="small" class="dt-op__card">
                            <n-radio-group
                                v-model:value="editLoa"
                                name="loa"
                                size="small"
                                :disabled="loading || saving"
                                @update:value="handleLoaChange"
                            >
                                <n-space size="small">
                                    <n-radio :value="0">0</n-radio>
                                    <n-radio :value="1">1</n-radio>
                                    <n-radio :value="13">13</n-radio>
                                    <n-radio :value="12">12</n-radio>
                                </n-space>
                            </n-radio-group>
                        </n-card>

                        <n-card title="dtStyle" size="small" class="dt-op__card">
                            <n-select
                                :value="editBgStyle"
                                :options="dtStyleOptions"
                                size="small"
                                :disabled="loading || saving"
                                @update:value="handleBgStyleChange"
                            />
                        </n-card>

                        <n-card title="date" size="small" class="dt-op__card dt-op__card--full">
                            <n-input
                                :value="editDate"
                                type="datetime-local"
                                size="small"
                                :disabled="loading || saving"
                                @blur="handleDateCommit"
                                @update:value="handleDateInput"
                            />
                        </n-card>

                        <n-card title="text" size="small" class="dt-op__card dt-op__card--full">
                            <n-input
                                v-model:value="editText"
                                type="textarea"
                                size="small"
                                :autosize="{ minRows: 3, maxRows: 4 }"
                                :disabled="loading || saving"
                                @blur="handleTextCommit"
                            />
                        </n-card>

                        <n-card title="counts" size="small" class="dt-op__card dt-op__card--full">
                            <div class="dt-op__counts-grid">
                                <div class="dt-op__field">
                                    <span class="dt-op__field-label">imgShowAll</span>
                                    <n-input-number
                                        :value="data.imgShowAll"
                                        size="small"
                                        :min="0"
                                        :disabled="loading || saving"
                                        @update:value="(value) => handleNumberChange('imgShowAll', value)"
                                    />
                                </div>
                                <div class="dt-op__field">
                                    <span class="dt-op__field-label">imgAllNum</span>
                                    <n-input-number
                                        :value="data.imgAllNum"
                                        size="small"
                                        :min="0"
                                        :disabled="loading || saving"
                                        @update:value="(value) => handleNumberChange('imgAllNum', value)"
                                    />
                                </div>
                                <div class="dt-op__field">
                                    <span class="dt-op__field-label">videoShowAll</span>
                                    <n-input-number
                                        :value="data.videoShowAll"
                                        size="small"
                                        :min="0"
                                        :disabled="loading || saving"
                                        @update:value="(value) => handleNumberChange('videoShowAll', value)"
                                    />
                                </div>
                                <div class="dt-op__field">
                                    <span class="dt-op__field-label">videoNum</span>
                                    <n-input-number
                                        :value="data.videoNum"
                                        size="small"
                                        :min="0"
                                        :disabled="loading || saving"
                                        @update:value="(value) => handleNumberChange('videoNum', value)"
                                    />
                                </div>
                            </div>
                        </n-card>
                    </div>
                </template>
            </div>
        </n-spin>
    </div>
</template>

<script setup lang="ts">
import { getdt, setDt } from '@/api/api';
import type { DtDataType, setDtDataT } from '@/types/dtType';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{ dtId: number, loa: number }>();
const emit = defineEmits<{
    close: [];
    minimize: [];
}>();

const loading = ref(true);
const saving = ref(false);
const data = ref<DtDataType>();
const errorText = ref('');
const toastText = ref('');
const editLoa = ref<number>(0);
const editBgStyle = ref<number>(0);
const editText = ref('');
const editDate = ref('');
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const dtStyleOptions = [
    { value: 0, label: '0 - 占位1' },
    { value: 1, label: '1 - 占位2' },
    { value: 2, label: '2 - 占位3' },
    { value: 3, label: '3 - 占位4' },
    { value: 4, label: '4 - 占位5' },
    { value: 5, label: '5 - 占位6' },
    { value: 6, label: '6 - 占位7' },
    { value: 7, label: '7 - 占位8' },
];

function showToast(text: string) {
    toastText.value = text;
    if (toastTimer) {
        clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(() => {
        toastText.value = '';
        toastTimer = null;
    }, 1200);
}

function handleFullscreenClick() {
    showToast('无法全屏');
}

function syncEditors(dt: DtDataType) {
    editLoa.value = dt.loa;
    editBgStyle.value = dt.bgStyle;
    editText.value = dt.text;
    editDate.value = formatDateForInput(dt.date);
}

async function loadData() {
    loading.value = true;
    errorText.value = '';
    try {
        const res = await getdt(props.dtId, props.loa);
        if (res.code === 200 && res.data) {
            data.value = res.data;
            syncEditors(res.data);
        } else {
            errorText.value = `接口返回异常，code: ${res.code}`;
        }
    } catch (error) {
        errorText.value = error instanceof Error ? error.message : '未知错误';
    } finally {
        loading.value = false;
    }
}

async function submitPatch(patch: setDtDataT, rollback: () => void, applyLocal: () => void) {
    saving.value = true;
    try {
        const res = await setDt(props.dtId, patch);
        if (res.code === 200) {
            applyLocal();
            return;
        }
        rollback();
    } catch {
        rollback();
    } finally {
        saving.value = false;
    }
}

async function handleLoaChange(value: number) {
    if (!data.value) return;
    const previous = data.value.loa;
    if (value === previous) return;
    editLoa.value = value;
    await submitPatch({ loa: value }, () => { editLoa.value = previous; }, () => {
        if (data.value) data.value = { ...data.value, loa: value };
    });
}

async function handleBgStyleChange(value: number) {
    if (!data.value) return;
    const previous = data.value.bgStyle;
    if (value === previous) return;
    editBgStyle.value = value;
    await submitPatch({ bgStyle: value } as setDtDataT, () => { editBgStyle.value = previous; }, () => {
        if (data.value) data.value = { ...data.value, bgStyle: value } as DtDataType;
    });
}

async function handleNumberChange(key: 'imgShowAll' | 'imgAllNum' | 'videoShowAll' | 'videoNum', value: number | null) {
    if (!data.value || value === null) return;
    const previous = data.value[key];
    const nextValue = Number(value);
    if (nextValue === previous) return;
    await submitPatch({ [key]: nextValue }, () => {
        if (data.value) data.value = { ...data.value, [key]: previous };
    }, () => {
        if (data.value) data.value = { ...data.value, [key]: nextValue };
    });
}

function handleDateInput(value: string) {
    editDate.value = value;
}

async function handleDateCommit() {
    if (!data.value) return;
    const nextValue = formatDateForSubmit(editDate.value);
    const previous = data.value.date;
    if (!nextValue || nextValue === previous) {
        editDate.value = formatDateForInput(previous);
        return;
    }
    await submitPatch({ date: nextValue }, () => {
        editDate.value = formatDateForInput(previous);
    }, () => {
        if (data.value) {
            data.value = { ...data.value, date: nextValue };
            editDate.value = formatDateForInput(nextValue);
        }
    });
}

async function handleTextCommit() {
    if (!data.value) return;
    const previous = data.value.text;
    const nextValue = editText.value;
    if (nextValue === previous) return;
    await submitPatch({ text: nextValue }, () => {
        editText.value = previous;
    }, () => {
        if (data.value) data.value = { ...data.value, text: nextValue };
    });
}

function formatDateForInput(date: string) {
    if (!date) return '';
    if (date.length >= 16) return `${date.slice(0, 10)}T${date.slice(11, 16)}`;
    return date.replace(' ', 'T').slice(0, 16);
}

function formatDateForSubmit(date: string) {
    if (!date) return '';
    return date.replace('T', ' ') + ':00';
}

watch(() => [props.dtId, props.loa], () => {
    loadData();
});

onMounted(() => {
    loadData();
});

onBeforeUnmount(() => {
    if (toastTimer) {
        clearTimeout(toastTimer);
    }
});
</script>

<style lang="less" scoped>
@import url('./dtOp.less');
</style>
