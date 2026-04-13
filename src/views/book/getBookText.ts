import { getBookData } from "./book";
import type { A, B } from "./type";

async function getData(bookId:string){
    let data = await getBookData(bookId);
    let datas = <B[]>[];
    const times = +new Date();
    data.forEach(e => {
        datas.push(...d(e));
    });
    console.log(((+new Date) - times));
    
    return datas;
}

let vId = 0;
//段落分割为句子
function d(data: A) {
    let datas = [];
    let curr = 0;
    let h = ' ';
    let all = data.text.length;
    datas.push({
        id: vId++,
        text: ' ',
        id_up: data.id,
    });
    if (all <= 11) {
        datas.push({
            id: vId++,
            text: ' ',
            id_up: data.id,
        });
        datas.push({
            id: vId++,
            text: h + data.text,
            id_up: data.id,
        });
        return datas
    }
    curr += 11;
    datas.push(
        {
            id: vId++,
            text: h + data.text.slice(0, curr),
            id_up: data.id,
        });
    all -= 11;
    while (true) {
        if (all <= 13) {
            curr += all;
            datas.push(
                {
                    id: vId++,
                    text: data.text.slice(curr - all, curr),
                    id_up: data.id,
                });
            return datas;
        }
        curr += 13;

        datas.push(
            {
                id: vId++,
                text: data.text.slice(curr - 13, curr),
                id_up: data.id,
            });
        all -= 13;
    }
}

export {getData}