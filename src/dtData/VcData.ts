import { ref, watch } from "vue";
import type { DtDataType, As, Dt } from "../types/dtType";

// 处理和存储类别中的选项数据
const VDATA_STORAGE_KEY = "VPLData";

function createVDataItem(id: number): As {
    return {
        id,
        isPlss: false,
        isInput: false,
        plText: "",
    };
}

function canUseLocalStorage() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function loadVDataFromLocalStorage(): As[] {
    if (!canUseLocalStorage()) {
        return [];
    }

    const localValue = localStorage.getItem(VDATA_STORAGE_KEY);
    if (!localValue) {
        return [];
    }

    try {
        const parsedValue = JSON.parse(localValue);
        if (!Array.isArray(parsedValue)) {
            return [];
        }

        return parsedValue
            .map((item) => {
                const id = Number(item?.id);
                if (!Number.isFinite(id)) {
                    return null;
                }

                return {
                    id,
                    isPlss: Boolean(item?.isPlss),
                    isInput: Boolean(item?.isInput),
                    plText: typeof item?.plText === "string" ? item.plText : "",
                };
            })
            .filter((item): item is As => item !== null);
    } catch (error) {
        console.warn("读取评论草稿缓存失败:", error);
        return [];
    }
}

export let vData = ref<As[]>(loadVDataFromLocalStorage());

watch(
    vData,
    () => {
        vDataSave();
    },
    { deep: true }
);

export function VcDataPush(dtData: (Dt)[]) {
    const data: DtDataType[] = [];

    // 只处理普通动态
    for (let a of dtData) {
        if (a.type == 'A') {
            data.push(a);
        }
    }

    const dataMap = new Map(vData.value.map((item) => [item.id, item]));

    // 只补充当前接口返回里新增的动态，不覆盖历史草稿
    for (let a of data) {
        if (!dataMap.has(a.id)) {
            dataMap.set(a.id, createVDataItem(a.id));
        }
    }

    vData.value = Array.from(dataMap.values());
}


export function findvData(id: string | number) {
    id = Number(id);
    let obj = vData.value.find(a => a.id == id);
    if (obj) {
        return obj
    } else {
        let now = createVDataItem(id);
        vData.value.push(now);
        return now;
    }
}



export function vDataSave() {
    if (!canUseLocalStorage()) {
        return;
    }
    localStorage.setItem(VDATA_STORAGE_KEY, JSON.stringify(vData.value));
}

