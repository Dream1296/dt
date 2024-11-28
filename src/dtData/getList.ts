import { dtDate, dtfind } from "../api/api";
import type { A, dataImg } from "../type/dtType";
import { settext, splitContent } from "./dtUtils";
import { VcDataInit } from "./VcData";
import { ref } from 'vue';
import type { Ref } from 'vue';
import { token } from "@/api/token";

type DataL = {

    values: (A | dataImg)[],
    vlist: Ref<(A | dataImg)[]>,
    signal: AbortSignal,
    
    set: (newData: (A | dataImg)[]) => void,
    addVlist: (i: number) => void
    find: (id: number) => A | undefined,
    del: (id: number) => boolean,

}

export let dtData: DataL = {
    //总数据
    values: [],
    //渲染视图数据
    vlist: ref(<(A | dataImg)[]>[]),
    //取消api
    signal:(new AbortController()).signal,
    set: (newData: (A | dataImg)[]) => {
        dtData.values = newData;
    },
    addVlist: (i: number) => {
        dtData.vlist.value.push(dtData.values[i]);
    },
    find: (id: number) => {
        let obj = dtData.values.find(obj => obj.id == id);
        if (obj && obj.type == 'A') {
            return obj;
        } else {
            //后续可以添加单动态查询
            return undefined;
        }
    },
    del: (id: number) => {
        // 删除原始数据中的项
        const valueIndex = dtData.values.findIndex(item => item.id === id);
        if (valueIndex !== -1) {
            dtData.values.splice(valueIndex, 1);
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

export async function dtFindData(qb: string,loa:number) {
    let data = ((await dtfind(qb,loa.toString())) ).data;
    let dataA: A[] = [];
    for (let a of data) {
        if (a.type == 'A') {
            dataA.push(a);
        }
    }
    Asetcl(dataA);

    dtData.set(data);

    VcDataInit(data);

    return data;

}





//获取动态主数据
export async function dtDataInit(loa: string | number,): Promise<(A | dataImg)[]> {
    let data = (await dtDate(loa, 0,dtData.signal)).data;
    let dataA: A[] = [];
    for (let a of data) {
        if (a.type == 'A') {
            dataA.push(a);
        }
    }
    Asetcl(dataA);

    dtData.set(data);

    VcDataInit(data);

    return data;
}

function fns(){
    
}

function Asetcl(data: A[]) {
    //处理正文字符串
    settext('textArr', 'text', data);

}




