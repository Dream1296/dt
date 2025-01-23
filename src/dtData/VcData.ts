import { ref } from "vue";
import type { A, As, dataImg } from "../type/dtType";

// 处理和存储类别中的选项数据

export let vData = ref<As[]>([]);

export function VcDataInit(dtData:(A | dataImg)[]) {
    
    let data:A[] = [];
    for(let a of dtData){
        if(a.type == 'A'){
            data.push(a);
        }
    }
    

    let newData:As[] = [];
    //新的数组
    for(let a of data){
        newData.push({
            id: a.id,
            isPlss: false,
            isInput: false,
            plText: "",
        })
    }
    //判断原数组是否为空
    if(vData.value.length == 0){
        vData.value = newData;  
        return
    }
    //将原数组中的评论数据合并到新的数组中
    for(let a of newData){
        let b = vData.value.find(obj => obj.id == a.id);
        if(b){
            a.plText = b.plText;
        }
        vData.value = newData; 
    }
    // localStorage.setItem('VPLData', JSON.stringify(vData.value));
}


export function findvData(id:string | number){
    id = Number(id);
    let obj = vData.value.find(a => a.id == id);
    if(obj){
        return obj
    }else{
        let now = {
            id: id,
            isPlss: false,
            isInput: false,
            plText: "",
        };
        vData.value.push(now);
        return now;
    }


}

