import { dtDate, dtfind } from "../api/api";
import type { A, dataImg, Dt, Mood, Top } from "../type/dtType";
import { Asetcl, setCom, settext, splitContent } from "./dtUtils";
import { VcDataInit } from "./VcData";
import { ref } from 'vue';
import type { Ref } from 'vue';
import { token } from "@/api/token";
import { viewDataStore } from "@/stores/viewDataStore";
import { dtData } from "./dtList";



//获取动态主数据并对其进行初始化操作后返回
export async function dtDataInit(loa: string | number,): Promise<(Dt)[]> {
    //从网络请求获取数据
    let data = (await dtDate(loa, 0, dtData.signal)).data;


    //过滤掉不显示元素
    guoli(data)

    // A类型数组
    let dataA: A[] = [];

    for (let a of data) {
        if (a.type == 'A') {
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

//数据过滤，隐藏抖音视频
function guoli(data: Dt[]) {
    let viewData = viewDataStore();

    if (viewData.isShowDy) {
        return
    }


    // !!这里要倒着遍历，因为正向遍历时删除操作会影响后续遍历索引
    for (let i = data.length - 1; i >= 0; i--) {
        const a = data[i];

        if (a.type == 'A' && a.keyword?.find(obj => obj.keyword == "抖音")) {
            data.splice(i, 1); // 删除当前项
        }
    }
}








