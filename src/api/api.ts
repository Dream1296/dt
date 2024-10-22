import type { A } from '@/dtData/dtType';
import axioss from 'axios';
import {token as tokens} from '@/api/token';

let axios:any;

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
// let url = 'https://172.16.3.12:3010';

export let Internet = {
    url,
}



//主简单请求发送函数
export async function api<T>(url: string, method: 'GET' | 'POST' = 'GET', data?: any, token?: string): Promise<T> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios({
        url: url,
        method: method,
        headers: headers,
        data: method === 'POST' ? data : undefined, // 只有在 POST 请求时才传递数据
    });
    return response.data as T;
}

//账号密码登录
export async function login(user: string, passwd: string) {
    const urls = Internet.url + "/api/login";

    let res = await api<{code:number,message:string,token:string}>(urls, 'POST', { username: user, passwd });
    return res;
}

export async function yz(token:string){
    let userId = await api<string>( Internet.url + '/api/userClass','GET',undefined,token);
    return userId; 
}

//动态主数据
export async function dtDate( loa: string | number, aes: number) {

    // const datas = res.data;
    // const data = decrypt(datas, '012345');
    // resolve(JSON.parse(data));
    if (!aes) {
        aes = 0;
    }

    const urls = Internet.url + "/api/getDtList?loa=" + loa + "&aes=" + aes;
    let res = await api(urls, 'GET', undefined, tokens);
    return res;
}

//查询动态
//qb=标签  isqb=预留，是否开启标签对比
export async function dtfind( qb: string, loa?: string,  isbq?: string) {
    const urls = Internet.url + "/api/dtfind?bq=" + qb;
    let res = await api(urls, 'GET', undefined, tokens);
    return res;
}

export async function addDtindex(dtid:number,text:string){
    const urls = Internet.url + "/api/dtindex";
    let res = await api(urls,'POST',{id:dtid,dtindex:text},tokens);
    return res;

}

//单个动态
export async function getdt( id: string | number):Promise<A> {

    let urls = Internet.url + "/api/getdt?id=" + String(id);
    let res = ( await api(urls, 'GET', undefined, tokens)) as {data:A};
    return res.data;
}

//提交动态评论内容
export async function postCom(content: string, dtId: string ) {
    let urls = Internet.url + '/api/postCom';
    let res = await api(urls, 'POST', { content, dtId }, tokens);
    return res;
}

//删除动态
export async function delDts(dtId: string){
    let urls = Internet.url + '/api/delDt';
    let res = await api(urls, 'POST',{id:dtId}, tokens);
    return res;
}

//获取用户名
export async function getName(){
    let urls =   Internet.url + '/api/userc';
    let res = await api<{user:string,name:string }>(urls, 'GET',undefined, tokens);
    console.log(res);
    
    return res;
}



export function imgSrc(dtid:number , index:number) {
    return Internet.url + '/api/dtimg?dtid=' + dtid + '&index=' + index;
}

export function imgSrcs(dtid:number , index:number) {
    return Internet.url + '/api/dtimg?dtid=' + dtid + '&index=' + index + '&a=1';
}

export function dtVideo(dtid:number, index:number  ) {
    return `${Internet.url}/api/dtvideo?dtid=${dtid}&index=${index}`;
}

export function dtVideoImg(dtid:number,index:number){
    return  `${Internet.url}/api/dtvideoImg?dtid=${dtid}&index=${index}`;
}

export function getEmoSrc(name:string){
    return Internet.url + '/api/emoji?lei=weixin&name=' + name;
}


//获取头像
export function getTouxian(name:string){
    return `${Internet.url}/api/userImg?name=${name}`

}

//获取表情包地址
export function emojiSrc(name:string){
    return `${Internet.url}/api/emoji?lei=weixin&name=${name}`;
}

//表情包列表
export async function emoList():Promise<string[]>{
     let url =  `${Internet.url}/api/emojilist`;
     let res = await api(url,'GET') as string[];
     return res; 
}

