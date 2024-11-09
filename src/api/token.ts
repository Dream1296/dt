import { getTempTokenApi, yz } from "./api";

export let token = '';
export let tempToken = '';



//验证token是否存在
export function isToken(): boolean {
    let to = localStorage.getItem('token');
    if (to) {
        token = to;
        return true;
    }
    return false;
}

//验证是否有效
export async function verifyToken() {
    let fage = isToken();
    if (!fage) {
        return false
    }
    let a = await yz(token);
    if (a != 'guest') {
        return true
    }
    return false;
}

//获取临时token
export async function getTempToken() {
    tempToken = await getTempTokenApi();
    return tempToken;
}


export async function initToken() {
    if (await verifyToken()) {
        await getTempToken()
    }
}


