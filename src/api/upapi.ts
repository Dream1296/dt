import type { A } from '@/type/dtType';
import axioss from 'axios';
import { Internet } from './api';
import { token } from './token';
import { ref, type Ref } from 'vue';



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



export function upfiles(imgArr: any[], videoArr: any[]) {
    let len = imgArr.length + videoArr.length;
    let imgNameArr: string[] = [];
    let videoNumArr: string[] = [];
    // let percentCompleteArr: number[] = new Array(len).fill(0);
    let percentCompleteArr = ref<number[][]>([new Array(imgArr.length).fill(0), new Array(videoArr.length).fill(0)]);
    let upPromise: (() => Promise<boolean>)[] = new Array(len);

    for (let i = 0; i < imgArr.length; i++) {
        upPromise[i] =
            () => upfile(imgArr[i], 'img', percentCompleteArr.value[0], imgNameArr, i);
    }
    for (let i = 0; i < videoArr.length; i++) {
        upPromise[imgArr.length + i] =
            () => upfile(videoArr[i], 'video', percentCompleteArr.value[1], videoNumArr, i);
    }
    return {
        upPromise,
        percentCompleteArr,
        imgNameArr,
        videoNumArr
    }
}


export function upfile(file: any, type: 'img' | 'video', percentCompleteArr: number[], fileNameArr: string[], index: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const date = new Date();
        let filename = file.name;
        var formData = new FormData(); // 创建一个FormData对象
        formData.append('filename', filename);
        formData.append('file', file);

        let url = '';
        if (type == 'img') {
            url = Internet.url + '/api/updt';
        }
        if (type == 'video') {
            url = Internet.url + '/api/upvideo';
        }



        const xhr = new XMLHttpRequest();

        // 设置请求类型和上传目标地址
        xhr.open('POST', url, true);

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
        xhr.send(formData);
    })

}

export function postDt(text: string, img: string[], imgShowNum: string, date: string, loa: number, video: string[], imgDir: boolean) {
    return new Promise((resolve, rejects) => {
        fetch(Internet.url + '/api/postdt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // 请求头  
                'Authorization': 'B ' + token,
            },
            body: JSON.stringify({
                text,
                img,
                imgShowNum,
                date,
                loa,
                video,
                imgDir: imgDir,
            })
        })
            .then(po => po.json())
            .then(res => {
                console.log(res);
                resolve(res);
            })
    })

}