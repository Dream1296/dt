let wArr: number[] = [];  // 每列的高度数组
let divCout = 2; // 默认列数，可以根据实际情况计算

// 传入父元素和子元素集合
export function layoutItemsFnAdd(dtArr: HTMLElement, dtsDom: HTMLElement[]) {
    // 父元素宽度（如果需要动态计算列数）
    let width = dtArr.offsetWidth;

    // 根据父元素宽度计算列数
    divCout = Math.floor(width / (360 + 10)); // 360 是子元素的宽度，10 是间距
    divCout = divCout == 0 ? 1 : divCout; // 确保至少有一列

    // 确保列高度数组 wArr 的初始化
    if (wArr.length !== divCout) {
        wArr = Array(divCout).fill(0);  // 初始化每列的高度为 0
    }
 
    // 遍历每个子元素并计算其位置
    dtsDom.forEach(item => {
        // 通过 getComputedStyle 更可靠地检查是否已经设置了绝对定位
        if (window.getComputedStyle(item).position === 'absolute') {
            return;
        }

        // 当前子元素高度
        let height = item.offsetHeight;
        let index = 0;

        // 找出最短的列
        let minHeight = wArr[0];
        for (let i = 1; i < divCout; i++) {
            if (wArr[i] < minHeight) {
                minHeight = wArr[i];
                index = i;
            }
        }

        // 计算该元素的 left 和 top
        let left = index * (360 + 10);  // 360 是宽度，10 是间距
        let top = wArr[index];  // 当前列的高度

        // 更新该列的总高度
        wArr[index] += height + 30; // 更新该列的高度，10 是间距

        // 设置子元素的位置
        item.style.position = 'absolute';
        item.style.left = `${left}px`;
        item.style.top = `${top}px`;
    });
}
