
/**
 * 传入节点，返回节点的子节点
 * @param id 
 * @param list
 * @returns 
 */
export function getFuNode(id: string, list: any[]) {
    let arr = list.filter(obj => obj.parent_id == id);
    return arr;
}