import { dtDate, dtfind, userIndex } from "../api/api";
import type { DtDataType, dataImg, Dt, Mood, Top } from "../types/dtType";
import { Asetcl, settext, splitContent } from "./dtUtils";
import { VcDataPush } from "./VcData";
import { ref } from 'vue';
import type { Ref } from 'vue';
import { token } from "@/api/token";
import { viewDataStore } from "@/stores/viewDataStore";
import { dtData } from "./dtList";
import { watch } from "vue";
import { myEvent } from "@/myEnit";






//获取动态主数据并对其进行初始化操作后返回
export async function dtDataInit(loa: string | number): Promise<(Dt)[]> {
    //从网络请求获取数据
    let data = (await dtDate(loa, 0, dtData.signal)).data;

    for (let a of data) {
        if (a.type == 'A') {
            if (!a.keyword) {
                a.keyword = [];
            }
        }
    }

    //过滤掉不显示元素
    filterVisibleData(data);


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
    VcDataPush(data);
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

    VcDataPush(dataA);

    return dataA;

}

let SHOWDTNUM = import.meta.env.VITE_SHOWDTNUM != -1 ? import.meta.env.VITE_SHOWDTNUM : -1;


export let tabList: Ref<{ name: string, show: boolean }[]> = ref(
    [
        { name: "#!正在加载", show: true },
    ]
)

userIndex()
    .then(data => {

        let a: { name: string, show: boolean }[] = [];
        for (let b of data) {
            a.push({
                name: b,
                show: true,
            })
        }
        console.log(data);
        
        console.log(a);
        
        tabList.value = a;
    })


watch(tabList, () => {
    myEvent.emit('upDtList', -1)
}, { deep: true })


//数据过滤，隐藏抖音视频
function filterVisibleData(data: Dt[]) {
    let viewData = viewDataStore();

    // 如果未登陆，显示的动态数量由环境变量控制
    if (!token.token && SHOWDTNUM != -1) {
        data.splice(SHOWDTNUM);
    }

    // !!这里要倒着遍历，因为正向遍历时删除操作会影响后续遍历索引
    for (let i = data.length - 1; i >= 0; i--) {
        const a = data[i];

        if (a.type == 'A' && a.keyword?.find(obj => obj.keyword == "抖音")) {
            data.splice(i, 1); // 删除当前项
        }
    }

    if (tabList.value.length >= 2) {
        filterDtByTag(data, tabList.value);
    }

}

// 按照标签来过滤动态
export function filterDtByTag(
    data: Dt[],
    tabList: { name: string; show: boolean }[]
) {

    // 最后一个一定是 #!rest
    const restRule = tabList[tabList.length - 1];

    // 前面的规则标签
    let normalRules = tabList.slice(0, -1);
    

    // 倒序遍历，防止 splice 导致索引错乱
    for (let i = data.length - 1; i >= 0; i--) {

        const item = data[i];

        // 非 A 类型直接按照 #!rest规则
        if (item.type != 'A') {
            if (!restRule.show) {
                data.splice(i, 1);
            }
            continue;
        }

        // 当前动态的标签数组
        const keywords = item.keyword.map(e => e.keyword);
        
        let isRestRule = true;
        
        // 是否最终显示
        let shouldShow = false;

        for (const rule of normalRules) {

            // 当前动态是否包含这个标签
            if (keywords.includes(rule.name)) {
                isRestRule = false;
                if(rule.show){
                    shouldShow = true;
                }
            }

        }

        if(isRestRule && restRule.show){
            shouldShow = true;
        }

        // 不显示则删除
        if (!shouldShow) {
            data.splice(i, 1);
        }
    }
}








