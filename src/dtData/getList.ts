import { dtDate, dtfind } from "../api/api";
import type { A, dataImg, Mood, Top } from "../type/dtType";
import { Asetcl, setCom, settext, splitContent } from "./dtUtils";
import { VcDataInit } from "./VcData";
import { ref } from 'vue';
import type { Ref } from 'vue';
import { token } from "@/api/token";
import { viewDataStore } from "@/stores/viewDataStore";
import { dtData } from "./dtList";



//获取动态主数据并对其进行初始化操作后返回
export async function dtDataInit(loa: string | number,): Promise<(A | dataImg)[]> {
    let data = (await dtDate(loa, 0, dtData.signal)).data;
    let datas = [...data];
    let dataA: A[] = [];
    for (let a of datas) {
        if (a.type == 'A') {
            if (!guoli(a)) {
                let index = data.findIndex(obj => obj.id == a.id);
                if (index != -1) {
                    data.splice(index, 1);
                }
                continue;
            }
            dataA.push(a);
        }
    }
    Asetcl(dataA);
    setCom(dataA);
    //将主数据改为带修改数据
    dtData.set(data);
    VcDataInit(data);
    return data;
}






//关键词查询
export async function dtFindData(qb: string, loa: number) {
    let data = ((await dtfind(qb, loa.toString()))).data;

    let dataA: A[] = [];
    for (let a of data) {
        if (a.type == 'A') {
            dataA.push(a);
        }
    }

    //对a类型进行处理
    Asetcl(dataA);

    dtData.set(dataA);

    VcDataInit(dataA);

    return dataA;

}

//数据便签过滤
function guoli(a: A) {
    let viewData = viewDataStore();
    if (!viewData.isShowDy) {
        if (a.keyword && a.keyword.find(obj => obj.keyword == "抖音")) {
            return false
        }
    }
    return true
}








