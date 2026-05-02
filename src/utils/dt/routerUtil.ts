import router from "@/router";


export function routerPush(key: string, value: string | null) {
    const currentQuery = { ...router.currentRoute.value.query };

    
    if (value == null) {
        // 删除参数
     
        
        delete currentQuery[key];
    } else {
        // 添加或修改参数
        currentQuery[key] = value;
    }

    router.push({ query: currentQuery });
}