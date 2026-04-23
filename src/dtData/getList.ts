import { dtDate, dtfind } from "../api/api";
import type { DtDataType, dataImg, Dt, Mood, Top } from "../types/dtType";
import { Asetcl, settext, splitContent } from "./dtUtils";
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
    filterVisibleData(data)
    console.log(data.length);
    
    console.log(data.length);
    
    // DtDataType类型数组，用于分离出主动态数据
    let dataA: DtDataType[] = [];

    // 将动态数据中type为"A"的元素分离出来，存入dataA数组中
    for (let a of data) {
        if (a.type == 'A') {
            dataA.push(a);
        }
    }

    // 将文本和表情包分离
    Asetcl(dataA);

    //将主数据改为带修改数据
    dtData.set(data);
    VcDataInit(data);
    return data;
}






//关键词查询
export async function dtFindData(qb: string, loa: number) {
    let data = ((await dtfind(qb, loa.toString()))).data;

    let dataA: DtDataType[] = [];
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

let SHOWDTNUM = import.meta.env.VITE_SHOWDTNUM != -1 ? import.meta.env.VITE_SHOWDTNUM : -1;

//数据过滤，隐藏抖音视频
function filterVisibleData(data: Dt[]) {
    let viewData = viewDataStore();

    // 如果未登陆，显示的动态数量由环境变量控制
    if (!token.token && SHOWDTNUM != -1) {
        data.splice(SHOWDTNUM);
    }

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








