export type Dt = DtDataType | dataImg | Mood | Top | Year;


//主数据列表 -来自后端
export interface Lists {
    id: string;
    user: string;
    name: string;
    touxian: string;
    touxianUrl?: string;
    text: string;
    mediaFileShowNum: number;
    mediaFileNum:number;
    imgShowProportion: string[];   // 图片显示比例
    date: string;
    po: number;   // 顶置 排序优先级
    childId:string[];
    longVideo: { id: string, name: string, src: string }[];
    keyword: { keyword: string, isAi: number }[];
    File: { name: string, fileId: string , loa: number}[];
    map: {id:number,name:string,E:number,N:number}[];
    bgStyle: number;
    KeepRun: KeepRunRecord[];
    KeepBadminton: BadmintonData[];
    longText: {
        id: number,
        dtid: string,
        tetile: string
    }[];
    chatRoot: chatRoot[];
    loa: number
}

// 标准动态类型
export interface DtDataType extends Lists {
  type: "A";
  textArr: { type: string; text: string }[];
  childDt: DtDataType[];
}


export type setDtDataT = {
  id: string,
  user?: string,
  date?: string,
  imgShowAll?: number,
  imgAllNum?: number,
  videoShowAll?: number,
  videoNum?: number,
  text?: string,
  loa?: number,
  bgStyle?: number,
}


export type chatRoot = {
  rootId: string,
  name: string,
}

// 评论状态与选项状态记录
export interface As {
  id: string;
  isPlss: boolean;
  isInput: boolean;
  plText: string;
}

export interface Com {
  commentsUser: string;
  content: string;
  date: string;
  dtId: string;
  id: number;
  imgAllNum: number;
  name: string;
}

// 数据展示
export interface dataImg {
  type: "dataImg";
  id: string;
  name: string;
  touxian: string;
}

//心情收集表单
export type Mood = {
  type: "mood";
  id: string;
  touxian: string;
  name: string;
};

//服务器状态显示
export type Top = {
  type: "top";
  id: string;
  touxian: string;
  name: string;
};

//年份标识
export type Year = {
  type: "year";
  id: string;
  year: number
};







export interface KeepRunRecord {
  dt_id: string,
  type: string; // 运动类型
  date: string; // 时间和日期
  location: string; // 位置
  juli: string; // 运动距离
  time_m: string; // 训练时长
  peishu: string; // 平均配速
  peishu_max: string; // 最快配速
  xiaohao: string; // 运动消耗，单位千卡
  time_all: string; // 总时长
  fuzai: string; // 运动负载
  xinlv: string; // 平均心率
  xinlv_max: string; // 最大心率
  xinlv_min: string; // 最小心率
  buping: string; // 平均步频
  gonlv: string; // 平均功耗
  bufu: string; // 平均步幅
  xunlanxiaoguo_you: string; // 训练效果，有氧
  xunlanxiaoguo_wu: string; // 训练效果，无氧
  cut: string; // 跑步能力评估
  ocr_text?: string;
}

export type BadmintonData = {
  dt_id: string;
  type: string; // 运动类型
  date: string; // 运动日期时间段
  xiaohao: number; // 运动消耗（单位：千卡）
  xinlv: number; // 平均心率
  xinlv_min: number; // 最小心率
  xinlv_max: number; // 最大心率
  time_m: string; // 训练时长（格式：MM:SS）
  time_all: string; // 总时长（格式：MM:SS）
  fuzai: number; // 运动负载
  xunlanxiaoguo_you: number; // 训练效果（有氧）
  xunlanxiaoguo_wu: number; // 训练效果（无氧）
};




export type listFile = {
  name: string,
  type: 0 | 1 | 2 | 3,
  hash: string,
}



export type TokenArr = {
  token: string,
  user: string,
  name: string,
}