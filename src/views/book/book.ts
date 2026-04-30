// const url = 'http://127.0.0.1:3010';
import { url } from "@/api/api";
import type { A } from "./type";
import pako from 'pako';
import { token } from '@/api/token';

// 获取小说数据
function getBookData(bookId: string): Promise<A[]> {
    return new Promise((resolve, rejects) => {
        fetch(url + '/api/bookrdata?bookid=' + bookId, {
            method: 'GET', // 或 'POST', 'PUT' 等
            headers: {
                'Authorization': `Bearer ${token.tempToken}`
            }
        })
            .then(po => po.arrayBuffer())
            .then((data) => {
                const decompressed = pako.inflate(new Uint8Array(data), { to: 'string' });
                const datas = JSON.parse(decompressed);
                resolve(datas);
            })
    })

}

// 获取数据音频url
function getBookAu(bookId: string, id: number | string): Promise<string> {
    return new Promise((resolve, reject) => {
        fetch(url + '/api/bookau?id=' + id.toString() + '&bookid=' + bookId.toString(), {
            method: 'GET', // 或 'POST', 'PUT' 等
            headers: {
                'Authorization': `Bearer ${token.tempToken}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const datas = Uint8Array.from(atob(data.data), c => c.charCodeAt(0)).buffer;
                const blob = new Blob([datas], { type: 'audio/mpeg' });
                const audioUrl = URL.createObjectURL(blob);
                resolve(audioUrl);
            })
    });
}

//获取小说列表
async function getBookList(): Promise<{ id: string, name: string }[]> {
    let po = await fetch(url + '/api/booklist', {
        method: 'GET', // 或 'POST', 'PUT' 等
        headers: {
            'Authorization': `Bearer ${token.tempToken}`
        }
    });
    let data = await po.json();
    return data.data;
}

//获取封面图片
function getImg(bookId: string) {
    return `${url}/api/bookcover?bookid=${bookId}&token=${token.tempToken}`;
}

//获取进度数据
async function getJd(bookid: string, jd: string) {
    let po = await fetch(url + '/api/bookjd?bookid=' + bookid + '&jd=' + jd, {
        method: 'GET', // 或 'POST', 'PUT' 等
        headers: {
            'Authorization': `Bearer ${token.tempToken}`
        }
    });
    let data: { code: number, data: { jd: string } } = await po.json();
    return data.data.jd;
}

export { getBookData, getBookAu, getBookList, getImg, getJd }