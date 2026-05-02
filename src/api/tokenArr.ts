import type { TokenArr } from "@/types/dtType";
import { token } from "./token";
import { getTokenName } from "./api";
import { moveToFront } from "@/utils/dt/dtUtil";

class TokenArrObj {
    tokenArr: TokenArr[];
    constructor() {
        this.tokenArr = [];
        let tokenArrStr = localStorage.getItem('tokenArr');
        if (tokenArrStr) {
            this.tokenArr = JSON.parse(tokenArrStr);
        }
        this.init();
    }

    async init() {
        // 如果本地token存在
        if (token.token) {
            this.unshift(token.token);
        }
    }

    // 对于本地将token切换
    async unshift(tokenStr: string) {
        let index = this.tokenArr.findIndex((a => a.token == tokenStr));
        if (index == -1) {
            let a = await getTokenName(tokenStr);
            this.tokenArr.unshift({
                token: tokenStr,
                user: a.user,
                name: a.name,
            })
        } else {
            //将token放在数组开头
            moveToFront(this.tokenArr, index);
           
            
            let a = await getTokenName(tokenStr);
            this.tokenArr[0] = {
                token: tokenStr,
                user: a.user,
                name: a.name,
            };
           
        }
        this.saveArr();
    }

    //对登录场景时，将新token进行获取userID，判断是否和本地有一样的，并更新
    async unshiftUp(tokenStr: string) {
        let a = await getTokenName(tokenStr);
        let index = this.tokenArr.findIndex((e => e.user == a.user));
        if (index == -1) {
            this.tokenArr.unshift({
                token: tokenStr,
                user: a.user,
                name: a.name,
            });
        } else {
            //将token放在数组开头,并更新数据
            moveToFront(this.tokenArr, index);
            this.tokenArr[0] = {
                token: tokenStr,
                user: a.user,
                name: a.name,
            }
        }
        this.saveArr();
    }


    saveArr() {
        localStorage.setItem('tokenArr', JSON.stringify(this.tokenArr))
    }



}


export let tokenArrObj = new TokenArrObj();





