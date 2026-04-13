// const url = 'http://127.0.0.1:3010';
import { url } from "@/api/api";
import type { A } from "./type";
import pako from 'pako';

// 获取小说数据
function getBookData(bookId: string): Promise<A[]> {
    return new Promise((resolve, rejects) => {
        fetch(url + '/api/bookrdata?bookid=' + bookId )
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
        fetch(url + '/api/bookau?id=' + id.toString() + '&bookid=' + bookId.toString())
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const datas =  Uint8Array.from(atob(data.data), c => c.charCodeAt(0)).buffer;
                const blob = new Blob([datas], { type: 'audio/mpeg' });
                const audioUrl = URL.createObjectURL(blob);
                resolve(audioUrl);
            })
    });
}

//获取小说列表
async function getBookList(): Promise<{ id: string, name: string }[]> {
    let po = await fetch(url + '/api/booklist');
    let data = await po.json();
    return data.data;
}

//获取封面图片
function getImg(bookId: string) {
    return url + '/api/bookcover?bookid=' + bookId;
}

//获取进度数据
async function getJd(bookid: string, jd: string) {
    let po = await fetch(url + '/api/bookjd?bookid=' + bookid + '&jd=' + jd);
    let data: { code: number, data: { jd: string } } = await po.json();
    return data.data.jd;
}

export { getBookData, getBookAu, getBookList, getImg, getJd }