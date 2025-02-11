import type { A, dataImg } from '@/type/dtType';
import axioss from 'axios';
import { token as tokens } from '@/api/token';

let axios: any;

// 创建新的 axios 实例，忽略ssl证书错误
if (typeof window === 'undefined') {
    // Node.js 环境
    axios = axioss.create({
        httpsAgent: new (require('https').Agent)({
            rejectUnauthorized: false, // 忽略 SSL 证书错误
        }),
    });
} else {
    // 浏览器环境
    axios = axioss;
}


let url = "https://frp-fix.top:20047";
// let url = "https://192.168.0.105:3012"
// let url = "https://192.168.0.105:3013";
// let url = "http://192.168.0.105:3010"
// let url = "https://10.36.40.224:3012";
// let url = "https://10.36.40.224:3012";
// let url = 'https://172.16.3.12:3010';

export let Internet = {
    url,
}



//主简单请求发送函数
export async function api<T>(url: string, method: 'GET' | 'POST' = 'GET', data?: any, token?: string,signal?:AbortSignal): Promise<T> {
    if (token == 'unknown') {
        await tokens.tokenPro;
    }
    if (token != undefined && tokens.istoken == 'false') {
        console.log('跳转到登录');

    }
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios({
        url: url,
        signal:signal,
        method: method,
        headers: headers,
        data: method === 'POST' ? data : undefined, // 只有在 POST 请求时才传递数据
    });
    return response.data as T;
}

//账号密码登录
export async function login(user: string, passwd: string) {
    const urls = Internet.url + "/api/login";

    let res = await api<{ code: number, message: string, token: string }>(urls, 'POST', { username: user, passwd });
    return res;
}

export async function getTempTokenApi(token: string = tokens.token) {
    const urls = Internet.url + "/api/getTempToken";
    let res = await api<{ tempToken: string }>(urls, 'GET', undefined, token);
    return res.tempToken;
}

export async function yz(token: string) {
    const urls = Internet.url + '/api/userClass';
    let userId = await api<string>(urls, 'GET', undefined, token);
    return userId;
}

//动态主数据
export async function dtDate(loa: string | number, aes: number , signal?:AbortSignal) {
    if (!aes) {
        aes = 0;
    }


    const urls = Internet.url + "/api/getDtList?loa=" + loa + "&aes=" + aes;
    type T = {
        code : number,
        loa:number,
        message: string,
        data : (A | dataImg)[],
    }
    let res = await api<T>(urls, 'GET', undefined, tokens.token , signal);
    return res;
}

//查询动态
//qb=标签  isqb=预留，是否开启标签对比
export async function dtfind(qb: string, loa?: string) {
    const urls = Internet.url + "/api/dtfind?bq=" + qb + "&loa=" + loa;
    let res = await api<{ code: number, data: A[] }>(urls, 'GET', undefined, tokens.token);
    return res;
}

export async function addDtindex(dtid: number, text: string) {
    const urls = Internet.url + "/api/dtindex";
    let res = await api(urls, 'POST', { id: dtid, dtindex: text }, tokens.token);
    return res;

}

//单个动态
export async function getdt(id: string | number,loa?:number): Promise<A> {
    loa = loa == undefined ? 0 : loa
    let urls = Internet.url + "/api/getdt?id=" + String(id) + "&loa=" + loa;
    let res = (await api(urls, 'GET', undefined, tokens.token)) as { data: A };
    return res.data;
}

//提交动态评论内容
export async function postCom(content: string, dtId: string) {
    let urls = Internet.url + '/api/postCom';
    let res = await api(urls, 'POST', { content, dtId }, tokens.token);
    return res;
}

//删除动态
export async function delDts(dtId: string) {
    let urls = Internet.url + '/api/delDt';
    let res = await api(urls, 'POST', { id: dtId }, tokens.token);
    return res;
}

//修改背景样式
export async function setDtBgStyle(dtId:number,dtBgStyle:number){
    let urls = Internet.url + '/api/setBgStyle';
    let body = {
        id:dtId,
        dtBgStyle:dtBgStyle
    };
    let res = await api<{tf:number}>(urls,'POST',body,tokens.token);
    return res;
}

//获取用户名
export async function getName() {
    let urls = Internet.url + '/api/userc';
    let res = await api<{ user: string, name: string }>(urls, 'GET', undefined, tokens.token);
    return res;
}

export async function getlvObj(id: number) {
    let url = 'https://frp-fix.top:20047/api/lviobj?id=' + id;
    let res = await api<{ id: number, dt_id: number, name: string, src: string }>(url, 'GET', undefined, undefined);
    return res;
}

// 缩略图
export function imgSrc(dtid: number, index: number) {
    if (tokens.tempToken) {
        return Internet.url + '/api/dtimg?dtid=' + dtid + '&index=' + index + '&token=' + tokens.tempToken;
    }
    return Internet.url + '/api/dtimg?dtid=' + dtid + '&index=' + index;

}

//原图
export function imgSrcs(dtid: number, index: number) {
    if (tokens.tempToken) {
        return Internet.url + '/api/dtimg?dtid=' + dtid + '&index=' + index + '&a=1' + "&token=" + tokens.tempToken;
    }
    return Internet.url + '/api/dtimg?dtid=' + dtid + '&index=' + index + '&a=1';
}

//视频
export function dtVideo(dtid: number, index: number) {
    if (tokens.tempToken) {
        return `${Internet.url}/api/dtvideo?dtid=${dtid}&index=${index}&token=${tokens.tempToken}`
    }
    return `${Internet.url}/api/dtvideo?dtid=${dtid}&index=${index}`;
}

// 视频图片
export function dtVideoImg(dtid: number, index: number) {
    if (tokens.tempToken) {
        return `${Internet.url}/api/dtvideoImg?dtid=${dtid}&index=${index}&token=${tokens.tempToken}`
    }
    return `${Internet.url}/api/dtvideoImg?dtid=${dtid}&index=${index}`;
}

export function getEmoSrc(name: string) {
    return Internet.url + '/api/emoji?lei=weixin&name=' + name;
}


//获取头像
export function getTouxian(name: string) {
    return `${Internet.url}/api/userImg?name=${name}`

}

// //获取表情包地址
// export function emojiSrc(name: string) {
//     return `${Internet.url}/api/emoji?lei=weixin&name=${name}`;
// }

//获取表情包地址
export function emojiSrc(name: string) {
    return `${Internet.url}/api/emoji?lei=${name}`;
}

//表情包列表
export async function emoList(): Promise<string[]> {
    let url = `${Internet.url}/api/emojilist`;
    let res = await api(url, 'GET') as string[];
    return res;
}


// 服务器性能sse
export function getXN(){
    return  new EventSource(`${Internet.url}/api/xnlist`); // 建立连接，监听服务器推送的事件
}


export async function setFan(num:number|string){
    let url = `${Internet.url}/api/setFan?Fan=${num.toString()}`;
    let res = await api<{code:number,fan:number}>(url, 'GET');
    return res;
}

export async function setMood(mood:string){
    let url = `${Internet.url}/api/setMood`;
    let res = await api<{code:number,tf:number}>(url, 'POST',{mood:mood},tokens.token);
    return res;
}


export async function setDtData(dtid:string,loa?:string,dtBgStyle?:string,date?:string){
    let url = `${Internet.url}/api/setDt`;
    let data = {
        id:dtid,
        loa:loa,
        bg_style:dtBgStyle,
        date:date
    }
    let res = await api<{code:number,tf:number}>(url,'POST',data,tokens.token);
    return res;
}

export async function setShare(dtid:string){
    let url = `${Internet.url}/api/setShare`;
    let res = await api<{code:number,tf:number,token:string}>(url,'POST',{dtid:dtid},tokens.token);
    return res;
}

export async function getLongText(dtid:string){
    let url = `${Internet.url}/api/getLongText?dtid=${dtid}`;
    let res =  await api<{code:number,data:{id:number,dtid:string,data:string,type:string}}>(url,'GET',undefined,tokens.token);
    return res;
}


export async function getShare(key:string){
    let url = `${Internet.url}/api/getShare?key=${key}`;
    let res = await api<{code:number,tf:number,token:string}>(url,'GET');
    return res;
}


export async function testNw(){
    return
    // let url = "https://10.36.40.224:3012";
    // let url = "https://192.168.0.105:3016";
    let a= await axiosGetWithTimeout(url +'/api/ipv6',500);
    if(a){
        Internet.url = url;
    }
}

// 定义一个带有超时机制的 GET 请求函数
async function axiosGetWithTimeout  (url:string, timeout = 500){
    try {
      // 使用 Promise.race 实现超时控制
      const response = await Promise.race([
        axios.get(url), // 发起请求
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request Timeout')), timeout)) // 超时处理
      ]);
      return response.data;
    } catch (error:any) {
      if (error.message === 'Request Timeout') {
        console.error('Request Timed Out');
      } else {
        console.error('Request Failed:', error.message);
      }
      return null; // 返回 null 表示请求失败或超时
    }
  };