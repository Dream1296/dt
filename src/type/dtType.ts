// 标准动态类型
export interface A {
    type:'A',
    date : string,
    id : number,
    idea : string,
    imgShowAll?:number,
    imgAllNum?:number,
    name : string,
    text : string,
    textArr : { type : string, text : string }[],
    keyword:{keyword:string,isAi:0|1 }[],
    longVideo? : {id:number,name:string,src:string}[],
    po:number,
    touxian : string,
    user : string,
    videoNum:number,
    com : Com[],
    bgStyle:number,
};
export interface As {
    id : number,
    isPlss : boolean,
    isInput : boolean,
    plText : string,
};


export interface Com {
    commentsUser : string,
    content : string,
    date : string,
    diId : number,
    name : string,
}

// 数据展示
export interface dataImg {
    type:'dataImg',
    date : string,
    id : number,
    name : string,
    touxian : string,
    user : string,
}
