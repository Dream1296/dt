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




    if (token.isTempToken != 'true'  && token.istoken != 'false') {
        token.TempTokenPro = getTempTokenApi()
            .then((data) => {
                token.tempToken = data;
                token.isTempToken = 'true';
            })
            .catch(() => token.isTempToken == 'false')
    }

}

// 对Ref变量与token状态绑定
export function addToken(key: Ref, isTrue: boolean) {

    let ketTemp: boolean = true;

    if (token.istoken == 'false') {
        ketTemp = false;
    }
    if (token.istoken == 'true') {
        ketTemp = true;
    }

    if (token.istoken != 'unknown') {
        if (isTrue) {
            key.value = ketTemp;
        } else {
            key.value = !ketTemp;
        }
        
        
        return
    }


    if (token.istoken == 'unknown') {
        token.tokenPro?.then(() => {
            if (token.istoken == 'false') {
                ketTemp = false;
            }
            if (token.istoken == 'true') {
                ketTemp = true;
            }
            if (isTrue) {
                key.value = ketTemp;
            } else {
                key.value = !ketTemp;
            }
        })
    }

}