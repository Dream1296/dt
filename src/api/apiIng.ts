import { getTempTokenApi, yz } from "./api";
import { token } from "./token";
import type { Ref } from "vue";



export function apiInit() {
    //验证token
    token.tokenPro = yz(token.token)
        .then((data) => {
            if (data == 'guest') {
                token.istoken = 'false';
            } else {
                token.istoken = 'true';
            }
        })
        .catch(() => token.istoken = 'false');

    //获取tokenTemp




    if (token.isTempToken != 'true' && token.istoken != 'false') {
        token.TempTokenPro = getTempTokenApi()
            .then((data) => {
                token.tempToken = data;
                token.isTempToken = 'true';
            })
            .catch(() => token.isTempToken == 'false')
    }

}

// 对Ref变量与token状态绑定
export function addToken(fnTrue: (key: any) => void, fnFalse: (key: any) => void, key: any) {


    if (token.istoken == 'false') {
        fnFalse(key);
        return
    }
    if (token.istoken == 'true') {
        fnTrue(key);
        return
    }
    if (token.istoken == 'unknown') {
        token.tokenPro?.then(() => {
            if (token.istoken == 'false') {
                fnFalse(key);
                return
            }
            if (token.istoken == 'true') {
                fnTrue(key);
                return
            }
        })
    }

}