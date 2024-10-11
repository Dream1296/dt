export let token:string;
export let tempToken:string;

//初始化获取token
export function tokenInit(){
    let a = localStorage.getItem('token');
    if(a){
        token = a;
        return token
    }
}



//获取临时token
export function getTempToken(){

}




