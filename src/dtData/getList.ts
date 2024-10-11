import { dtDate, dtfind } from "../api/api";
import type { A } from "./dtType";
import { settext, splitContent } from "./dtUtils";
import { VcDataInit } from "./VcData";
import { ref } from 'vue';
import type { Ref } from 'vue';
export let dtData: {
    values: A[],
    vlist: Ref<A[]>,
    set: (newData: A[]) => void,
    addVlist: (i: number) => void
    find: (id: number) => A | undefined,
    del: (id: number) => boolean,
} = {
    values: [],
    vlist: ref(<A[]>[]),
    set: (newData: A[]) => {
        dtData.values = newData;
    },
    addVlist: (i: number) => {
        dtData.vlist.value.push(dtData.values[i]);
    },
    find: (id: number) => {
        let obj = dtData.values.find(obj => obj.id == id);
        if (obj) {
            return obj;
        } else {
            //后续可以添加单动态查询
            return obj;
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

export async function dtFindData(qb: string, token: string) {
    let data = ((await dtfind(token, qb)) as { code: number, data: A[] }).data;
    settext('textArr', 'text', data);
    dtData.set(data);
    VcDataInit(data);



    return data;

}





//获取动态主数据
export async function dtDataInit(loa: string | number, token: string): Promise<A[]> {
    let data = (await dtDate(token, loa, 0) as { code: number, data: A[] }).data;

    //处理图片数据
    // imgs(data);

    //处理视频数据
    // setvideo(data);

    //处理正文字符串
    settext('textArr', 'text', data);
    dtData.set(data);
    VcDataInit(data);


    return data;
}




