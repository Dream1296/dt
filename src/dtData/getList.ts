import { dtDate, dtfind, userIndex } from "../api/api";
import type { DtDataType, dataImg, Dt, Mood, Top } from "../types/dtType";
import { Asetcl, settext, splitContent } from "./dtUtils";
import { VcDataPush } from "./VcData";
import { nextTick, ref } from 'vue';
import type { Ref } from 'vue';
import { token } from "@/api/token";
import { viewDataStore } from "@/stores/viewDataStore";
import { dtData } from "./dtList";
import { watch } from "vue";
import { myEvent } from "@/myEnit";

type TabOption = { name: string, show: boolean };
type UserOption = { name: string, show: boolean };

const TAB_STORAGE_KEY = "tabArr";
const USER_STORAGE_KEY = "userBlackList";

function canUseLocalStorage() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function loadTabListFromLocalStorage(): TabOption[] {
    return loadOptionListFromLocalStorage(TAB_STORAGE_KEY);
}

function loadUserListFromLocalStorage(): UserOption[] {
    return loadOptionListFromLocalStorage(USER_STORAGE_KEY);
}

function loadOptionListFromLocalStorage(storageKey: string): { name: string, show: boolean }[] {
    if (!canUseLocalStorage()) {
        return [];
    }

    const localValue = localStorage.getItem(storageKey);
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
                if (typeof item?.name !== "string") {
                    return null;
                }

                return {
                    name: item.name,
                    show: Boolean(item?.show),
                };
            })
            .filter((item): item is TabOption => item !== null);
    } catch (error) {
        console.warn("读取选项缓存失败:", error);
        return [];
    }
}

function saveTabListToLocalStorage() {
    if (!canUseLocalStorage()) {
        return;
    }

    localStorage.setItem(TAB_STORAGE_KEY, JSON.stringify(tabList.value));
}

function saveUserListToLocalStorage() {
    if (!canUseLocalStorage()) {
        return;
    }

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userList.value));
}





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


export let tabList: Ref<TabOption[]> = ref(
    [
        { name: "#!正在加载", show: true },
    ]
)

export let userList: Ref<UserOption[]> = ref([]);
let isSyncingUserList = false;

function setUserListFromData(userArr: string[]) {
    const localUserMap = new Map(loadUserListFromLocalStorage().map(item => [item.name, item.show]));
    const currentUserMap = new Map(userList.value.map(item => [item.name, item.show]));
    const nextUserList: UserOption[] = userArr.map(name => ({
        name,
        show: currentUserMap.get(name) ?? localUserMap.get(name) ?? true,
    }));

    const isSameList = userList.value.length === nextUserList.length
        && userList.value.every((item, index) => {
            const nextItem = nextUserList[index];
            return item.name === nextItem.name && item.show === nextItem.show;
        });

    if (isSameList) {
        return;
    }

    isSyncingUserList = true;
    userList.value = nextUserList;
    saveUserListToLocalStorage();
    nextTick(() => {
        isSyncingUserList = false;
    });
}

userIndex()
    .then(data => {

        const localTabMap = new Map(loadTabListFromLocalStorage().map(item => [item.name, item.show]));
        let a: TabOption[] = [];
        for (let b of data) {
            a.push({
                name: b,
                show: localTabMap.get(b) ?? true,
            })
        }
        console.log(data);
        
        console.log(a);
        
        tabList.value = a;
    })


watch(tabList, () => {
    myEvent.emit('upDtList', -1)
    saveTabListToLocalStorage();
}, { deep: true })

watch(userList, () => {
    saveUserListToLocalStorage();
    if (!isSyncingUserList) {
        myEvent.emit('upDtList', -1)
    }
}, { deep: true })


//数据过滤，隐藏抖音视频
function filterVisibleData(data: Dt[]) {
    let viewData = viewDataStore();

    // 如果未登陆，显示的动态数量由环境变量控制
    if (!token.token && SHOWDTNUM != -1) {
        data.splice(SHOWDTNUM);
    }

    // !!这里要倒着遍历，因为正向遍历时删除操作会影响后续遍历索引
    // for (let i = data.length - 1; i >= 0; i--) {
    //     const a = data[i];

    //     if (a.type == 'A' && a.keyword?.find(obj => obj.keyword == "抖音")) {
    //         data.splice(i, 1); // 删除当前项
    //     }
    // }
    
    //用户过滤
    let userArr: string[] = getDateUserArr(data);
    setUserListFromData(userArr);
    if (userList.value.length >= 2) {
        filterDtByUser(data, userList.value);
    }
    

    // 标签过滤
    if (tabList.value.length >= 2) {
        filterDtByTag(data, tabList.value);
    }

}

// 按照用户来过滤动态
export function filterDtByUser(
    data: Dt[],
    userList: { name: string; show: boolean }[]
) {
    const userShowMap = new Map(userList.map(item => [item.name, item.show]));

    // 倒序遍历，防止 splice 导致索引错乱
    for (let i = data.length - 1; i >= 0; i--) {
        const item = data[i];

        if (item.type != 'A') {
            continue;
        }

        if (userShowMap.get(item.user) === false) {
            data.splice(i, 1);
        }
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



function getDateUserArr(date:Dt[]){
    let userArr = new Set<string>();
    // 找出动态中的所有user
    for(let a of date){
        if(a.type != 'A'){
            continue;
        }
        userArr.add( a.user);
    }
    // 将userArr以数组方式返回
    return Array.from(userArr);
}





