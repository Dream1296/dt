// 让数组元素移动到开头
export function moveToFront(arr: any[], index: number): void {
  if (index < 0 || index >= arr.length) {
    throw new Error("索引超出数组范围");
  }

  const [item] = arr.splice(index, 1); // 删除指定索引元素
  arr.unshift(item); // 插入到数组开头
}