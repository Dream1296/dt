import type { DtDataType } from '@/types/dtType';
import axioss from 'axios';
import { api, Internet } from './api';
import { token } from './token';
import { ref, type Ref } from 'vue';
import { getFileMd5 } from '@/utils/md5';



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

export function ac() {
    let arr = new Array(5).fill(0);
    let i = 0;
    let j = 0;
    setInterval(() => {
        i = ++i % 5;
        j++;
        arr[i] = j;
    }, 1000)
    return arr;
}



export function upfiles(imgArr: any[], videoArr: any[],dtId:number) {
    let len = imgArr.length + videoArr.length;
    let imgNameArr: string[] = [];
    let videoNumArr: string[] = [];
    // let percentCompleteArr: number[] = new Array(len).fill(0);
    let percentCompleteArr = ref<number[][]>([new Array(imgArr.length).fill(0), new Array(videoArr.length).fill(0)]);
    let upPromise: (() => Promise<boolean>)[] = new Array(len);

    for (let i = 0; i < imgArr.length; i++) {
        upPromise[i] =
            () => upfile(imgArr[i], 'img', percentCompleteArr.value[0], imgNameArr, i,dtId);
    }
    for (let i = 0; i < videoArr.length; i++) {
        upPromise[imgArr.length + i] =
            () => upfile(videoArr[i], 'video', percentCompleteArr.value[1], videoNumArr, i,dtId);
    }
    return {
        upPromise,
        percentCompleteArr,
        imgNameArr,
        videoNumArr
    }
}


export function upfile(file: File, type: 'img' | 'video', percentCompleteArr: number[], fileNameArr: string[], index: number, dtId: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const date = new Date();
        let filename = encodeURIComponent(file.name);
        let fileBuffer = await file.arrayBuffer();
        let md5 =  getFileMd5(fileBuffer);
        let url = '';

        if (type == 'img') {
            url = Internet.url + '/api/upImg';
        }
        if (type == 'video') {
            url = Internet.url + '/api/upvideo';
        }



        const xhr = new XMLHttpRequest();

        // 设置请求类型和上传目标地址
        xhr.open('POST', url, true);

        xhr.setRequestHeader('Authorization', `Bearer ${token.tempToken}`);
        xhr.setRequestHeader('Content-Type', `application/octet-stream`);

        xhr.setRequestHeader('x-dt-id', dtId.toString());
        xhr.setRequestHeader('x-dt-index', index.toString());
        xhr.setRequestHeader('x-file-name', filename);
        xhr.setRequestHeader('x-file-md5', md5);
        
        

        // 监听上传进度
        xhr.upload.addEventListener('progress', function (e) {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total);
                percentCompleteArr[index] = percentComplete;
            }
        });

        // 监听请求完成
        xhr.onload = function () {
            if (xhr.status === 200) {
                const responseData: { fileName: string, tf: number } = JSON.parse(xhr.responseText);
                fileNameArr[index] = responseData.fileName;

                resolve(true);
            } else {
                console.error('文件上传失败！');
                reject(false);
            }
        };

        // 发送请求
        xhr.send(fileBuffer);
    })

}

export function postDt(dtId:number,text: string, imgNum:number, imgShowNum: number,videoNum:number, date: string, loa: number, imgDir: boolean) {
    return new Promise((resolve, rejects) => {
        fetch(Internet.url + '/api/postdt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // 请求头  
                'Authorization': 'B ' + token.tempToken
            },
            body: JSON.stringify({
                dtId,
                text,
                imgNum,
                imgShowNum,
                videoNum,
                date,
                loa,                
                imgDir: imgDir,
            })
        })
            .then(po => po.json())
            .then(res => {

                resolve(res);
            })
    })

}

// 预上传，获取id
export async function preUp() {
    let res = await api<{ dtId: number }>(Internet.url + '/api/preUpDt', 'GET', undefined, token.tempToken)
    return res.dtId;
}