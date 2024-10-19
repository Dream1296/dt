import { yz } from "./api";

export let token = '';


export function isToken():boolean{
    let to = localStorage.getItem('token');    
    if(to){
        token = to;
        return true;
    }
    return false;
}

export async function verifyToken(){
    let fage = isToken();
    if(!fage) {
        return
    }
    let a =  await yz(token);
    if(a != 'guest'){
        return true
    }
    return false;
    
}



