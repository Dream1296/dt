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

// dtData/getList中的dtDataInit函数中，其dtDate函数从后端获取一个需要显示的动态的数组，然后这个数组是有多个类型的，其中A类型对应当前显示的A类型，我们在逐渐将A类型重命名为DtDataType，但后端还没有开始重命名，
// 然后我们主要到dtDataInit函数的最后3行，先将处理后的数组传入到了dtData中，然后又传入到了VcDataInit中，VcDataInit函数时用于创建一个用于试图显示的数据对象，那么，后续已经可以使用vCdataInit进行数据显示了，又将获取的数组传入到dtData中，是否是多余了。结合当前项目代码，分析下是否可以不将dtData进行赋值
   
//过滤掉不显示元素
    filterVisibleData(data)

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

//数据过滤，隐藏抖音视频
function filterVisibleData(data: Dt[]) {
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








