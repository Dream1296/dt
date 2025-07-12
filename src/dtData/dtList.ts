import type { A, dataImg, Dt, Mood, Top } from "@/type/dtType";
import { ref, type Ref } from "vue";



export type dtList = {

    list: (Dt)[],
    vlist: Ref<(Dt)[]>,
    signal: AbortSignal,

    set: (newData: (Dt)[]) => void,
    addVlist: (i: number) => void
    find: (id: number) => A | undefined,
    del: (id: number) => boolean,

}

// 核心数据存储列表
export let dtData: dtList = {
    //总数据
    list: [],
    //渲染视图数据
    vlist: ref(<(Dt)[]>[]),
    //取消api
    signal: (new AbortController()).signal,
    //更新总数据
    set: (newData: (Dt)[]) => {
        dtData.list = newData;
    },
    //将总数据中第i位添加到渲染视图数据中
    addVlist: (i: number) => {
        dtData.vlist.value.push(dtData.list[i]);
    },
    //查询数据
    find: (id: number) => {
        let obj = dtData.list.find(obj => obj.id == id);
        if (obj && obj.type == 'A') {
            return obj;
        } else {
            //后续可以添加单动态查询
            return undefined;
        }
    },
    del: (id: number) => {
        // 删除原始数据中的项
        const valueIndex = dtData.list.findIndex(item => item.id === id);
        if (valueIndex !== -1) {
            dtData.list.splice(valueIndex, 1);
        }

        // 删除视图数据中的项
        const vlistIndex = dtData.vlist.value.findIndex(item => item.id === id);
        if (vlistIndex !== -1) {
            dtData.vlist.value.splice(vlistIndex, 1);
            return true;
        }
        return false
    }
};