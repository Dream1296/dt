export interface A {
    date : string,
    id : number,
    idea : string,
    // img : string[],
    // imgMore : boolean,
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
    // video : string[],
    // videoImg ?:string[],
    videoNum:number,
    // showVideo : boolean,
    com : Com[],
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