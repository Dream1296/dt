class Token {
    //token值
    _token: string;
    //token是否有效
    istoken: 'unknown' | 'true' | 'false';
    //token验证promise
    tokenPro: Promise<any> | null;
    //临时token
    _tempToken: string;
    //临时token有效性
    isTempToken: 'unknown' | 'true' | 'false';
    //临时token生成promise
    TempTokenPro: Promise<any> | null;

    constructor() {
        //从存储中取token
        let tokens = localStorage.getItem('token');
        this._token = "";
        this._tempToken = "";
        this.tokenPro = null;
        //token是否有效，
        this.istoken = 'unknown';
        this.isTempToken = 'unknown';
        this.TempTokenPro = null;

        //token
        if (tokens) {
            this._token = tokens;
        } else {
            this.istoken = "false";
        }

        //tokenTemp
        let tempT = sessionStorage.getItem('tempToken');
        if (tempT) {
            this._tempToken = tempT;
            this.isTempToken = 'true';
        } else {
            this.isTempToken = 'false';
        }
    }



    get token(): string {
        return this._token
    }

    set token(data: string) {
        this._token = data;
    }


    get tempToken(): string {
        return this._tempToken;
    }


    set tempToken(data: string) {
        this._tempToken = data;
    }

}


export let token = new Token();



// export let token = {
//     let token:string = "",

// }






// //验证token是否存在
// export function isToken(): boolean {
//     let to = localStorage.getItem('token');
//     if (to) {
//         token = to;
//         return true;
//     }
//     return false;
// }



// //验证是否有效
// export async function verifyToken() {
//     let fage = isToken();
//     if (!fage) {
//         return false
//     }
//     let a = await yz(token);
//     if (a != 'guest') {
//         return true
//     }
//     return false;
// }

// //获取临时token
// export async function getTempToken() {
//     tempToken = await getTempTokenApi();
//     return tempToken;
// }


// export async function initToken() {
//     if (await verifyToken()) {
//         await getTempToken()
//     }
// }


