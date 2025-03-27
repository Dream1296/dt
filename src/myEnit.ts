import mitt from 'mitt';

// 定义事件类型
type Allevent = 'upDtList' ; // 这里只能是明确的字符串字面量

// 创建并导出一个类型化的 emitter 实例
export const myEvent = mitt<Record<Allevent, unknown>>();
