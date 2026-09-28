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



export function upfiles(imgArr: any[], videoArr: any[], dtId: number, imgIndex: number, videoIndex: number,nullFile :boolean) {

    let len = imgArr.length + videoArr.length;
    // let percentCompleteArr: number[] = new Array(len).fill(0);
    let percentCompleteArr = ref<number[][]>([new Array(imgArr.length).fill(0), new Array(videoArr.length).fill(0)]);
    let upPromise: (() => Promise<boolean>)[] = new Array(len);

    let index = imgIndex;
    for (let i = 0; i < imgArr.length; i++) {
        const currentIndex = index++;
        upPromise[i] =
            () => upfile(imgArr[i], 'img', percentCompleteArr.value[0], currentIndex, dtId,nullFile);
    }
    index = videoIndex;
    for (let i = 0; i < videoArr.length; i++) {
        const currentIndex = index++;
        upPromise[imgArr.length + i] =
            () => upfile(videoArr[i], 'video', percentCompleteArr.value[1], currentIndex, dtId,nullFile);
    }
    return {
        upPromise,
        percentCompleteArr,
    }
}

export async function upfile(
    file: File,
    type: 'img' | 'video',
    percentCompleteArr: number[],
    index: number,
    dtId: number,
    nullFile: boolean
): Promise<boolean> {



    // ==========================
    // 构建上传参数
    // ==========================

    const fileBuffer = await file.arrayBuffer();
    const md5 = getFileMd5(fileBuffer);
    const filename = encodeURIComponent(file.name);

    let url =
        Internet.url + "/api/upImgVideo";

    if(nullFile && nullFile == true){
        url = url + '?nullFile=1';
    }

    const headers = {
        'Authorization': `Bearer ${token.tempToken}`,
        'Content-Type': 'application/octet-stream',
        'x-dt-id': dtId.toString(),
        'x-dt-index': index.toString(),
        'x-file-name': filename,
        'x-file-md5': md5,
        'x-file-type': type,
    };


    // ==========================
    // 第一次请求：检查文件是否存在
    // 空 Buffer，不上传文件
    // ==========================
    try {
        const checkResponse = await fetch(url, {
            method: 'POST',
            headers,
            body: new ArrayBuffer(0)
        });
        let data = await checkResponse.json();
        if (data.code == 200) {
            percentCompleteArr[index] = 1;
            return true
        }
        return await fn1();
    } catch {
        console.log('上传异常');
        return false;
    }

    // 正式文件上传
    async function fn1() {
        return await new Promise<boolean>((resolve, reject) => {

            const xhr = new XMLHttpRequest();

            xhr.open('POST', url, true);

            Object.entries(headers).forEach(
                ([key, value]) => {
                    xhr.setRequestHeader(key, value);
                }
            );


            // 上传进度
            xhr.upload.addEventListener(
                'progress',
                e => {

                    if (e.lengthComputable) {

                        percentCompleteArr[index] =
                            e.loaded / e.total;

                    }

                }
            );


            // 上传完成
            xhr.onload = () => {

                if (xhr.status === 200) {

                    percentCompleteArr[index] = 1;

                    resolve(true);

                } else {

                    console.error(
                        '文件上传失败:',
                        xhr.status
                    );

                    reject(false);

                }

            };


            // 网络错误
            xhr.onerror = () => {

                console.error('文件上传网络错误');

                reject(false);

            };


            // 开始真正上传
            xhr.send(fileBuffer);

        });
    }

}

// export function upfile(file: File, type: 'img' | 'video', percentCompleteArr: number[], index: number, dtId: number): Promise<boolean> {
//     return new Promise(async (resolve, reject) => {
//         const date = new Date();
//         let filename = encodeURIComponent(file.name);
//         let fileBuffer = await file.arrayBuffer();
//         let md5 = getFileMd5(fileBuffer);
//         let url = '';

//         if (type == 'img') {
//             url = Internet.url + '/api/upImg';
//         }
//         if (type == 'video') {
//             url = Internet.url + '/api/upvideo';
//         }



//         const xhr = new XMLHttpRequest();

//         // 设置请求类型和上传目标地址
//         xhr.open('POST', url, true);

//         xhr.setRequestHeader('Authorization', `Bearer ${token.tempToken}`);
//         xhr.setRequestHeader('Content-Type', `application/octet-stream`);

//         xhr.setRequestHeader('x-dt-id', dtId.toString());
//         xhr.setRequestHeader('x-dt-index', index.toString());
//         xhr.setRequestHeader('x-file-name', filename);
//         xhr.setRequestHeader('x-file-md5', md5);



//         // 监听上传进度
//         xhr.upload.addEventListener('progress', function (e) {
//             if (e.lengthComputable) {
//                 const percentComplete = (e.loaded / e.total);
//                 percentCompleteArr[index] = percentComplete;
//             }
//         });

//         // 监听请求完成
//         xhr.onload = function () {
//             if (xhr.status === 200) {
//                 const responseData: { fileName: string, tf: number } = JSON.parse(xhr.responseText);
//                 // fileNameArr[index] = responseData.fileName;

//                 resolve(true);
//             } else {
//                 console.error('文件上传失败！');
//                 reject(false);
//             }
//         };

//         // 发送请求
//         xhr.send(fileBuffer);
//     })

// }

export function postDt(dtId: number, text: string, imgNum: number, imgShowNum: number, videoNum: number, date: string, loa: number, imgDir: boolean) {
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

// 文本类数据上传
export async function upDt(text: string, img_show_num: number, date: string, loa: number) {
    let res = await fetch(Internet.url + '/api/updt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // 请求头  
            'Authorization': 'B ' + token.tempToken
        },
        body: JSON.stringify({
            text,
            imgShowNum: img_show_num,
            date,
            loa,
        })
    })
    let data = await res.json();
    return data as {
        tf: number,
        dtId: number,
        imgNum: number,
        videoNum: number
    };
}

export async function upImgVideoNum(dtId: number) {
    let res = await fetch(Internet.url + '/api/upImgVideoNum', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // 请求头  
            'Authorization': 'B ' + token.tempToken
        },
        body: JSON.stringify({
            dtId,
        })
    });
    let data = await res.json();
    return data as {
        code: number,
        imgNum: number,
        videoNum: number
    };

}
