// import { dtVideo, dtVideoImg, imgSrc } from "../api/api";
import type { A } from "../type/dtType";

export function splitContent(content: string) {
    // 确保 content 是字符串
    if (typeof content !== "string") {
        content = String(content);
    }

    const result: { type: string, text: string }[] = [];
    const regex = /\^(\[([^\]]+)\])\^|([^^]+)/g;

    let match;
    while ((match = regex.exec(content)) !== null) {
        if (match[2]) {
            // 如果匹配到表情包
            result.push({
                type: "emoji",
                text: match[2],
            });
        } else if (match[3]) {
            // 如果匹配到文本
            result.push({
                type: "text",
                text: match[3],
            });
        }
    }

    return result;
}


// //处理图片数据
// export function imgs(dtData: A[]) {

//     for (let a of dtData) {

//         if(a.img.length > 0){
//             for(let i = 0; i < a.img.length ; i++){
//                 // a.img[i] = imgSrc(a.img[i]);
//             }
//         }
//         a.imgShowNum = a.img.length;
//     }


// }

//分离表情包与正文
export function settext(key: 'textArr', value: 'text', dtData: A[]) {

    let arr: { type: string, text: string }[][] = [];
    for (let i = 0; i < dtData.length; i++) {
        arr[i] = splitContent(dtData[i][value]);
    }
    for (let i = 0; i < arr.length; i++) {
        dtData[i][key] = fn(arr[i]);
    }

    function fn(arrs: { type: string; text: string; }[]) {
        let arrsc: { type: string; text: string; }[] = [];
        // arrs.forEach(e => {
        for (let e of arrs) {
            if (e.type == 'text') {
                for (let j = 0; j < e.text.length; j++) {
                    arrsc.push({ type: 'text', text: e.text[j] });
                }
            } else {
                arrsc.push(e);
            }
        }

        return arrsc
    }
}


// export function setvideo(dtData:A[]){
//     for(let i = 0; i < dtData.length; i++){
//         if(dtData[i].video.length != 0){
//             dtData[i].videoImg = [];
//             for(let j = 0; j < dtData[i].video.length; j++){
//                 dtData[i].videoImg?.push(dtVideoImg(dtData[i].video[j]));
//                 dtData[i].video[j] = dtVideo(dtData[i].video[j]);
//             }
//         }
//     }
// }


