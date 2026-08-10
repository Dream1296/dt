import { emojiSrc, emoList } from "@/api/api";
import { ref } from "vue";

// 表情名称列表（和之前一致）
export let emojiNames:string[] = [];







export const emojiNamesUrl = ref<string[]>([]);

async function fn() {
    for (let a of emojiNames) {
        let url = await getemojiImg(a);
        let index = emojiNames.findIndex(obj => obj == a);
        emojiNamesUrl.value[index] = url;
    }
}




// 每个表情的宽度和高度
const emojiWidth = 128;
const emojiHeight = 128;

// 每行表情的个数
const iconsPerRow = 10;


emoList().then(res => {    
    emojiNames = res;
    fn();
})

export async function getemojiImg(name: string): Promise<string> {
    // 获取大图的 URL 地址
    let emojisrc = emojiSrc("w_emoji");

    // 获取表情包名称在列表中的索引
    const index = emojiNames.indexOf(name);

    // 如果表情包名称无效，返回空字符串
    if (index === -1) {
        return '';
    }

    // 计算表情包的位置
    const row = Math.floor(index / iconsPerRow); // 计算当前行
    const col = index % iconsPerRow; // 计算当前列

    // 计算背景位置
    const x = col * emojiWidth;
    const y = row * emojiHeight;

    // 返回裁切后的表情图片 URL
    return cropEmoji(emojisrc, x, y, emojiWidth, emojiHeight);
}

// 使用 canvas 裁切并返回裁切后的表情包图片的 data URL
function cropEmoji(imageSrc: string, x: number, y: number, width: number, height: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageSrc;
        // 设置 CORS 策略
        img.crossOrigin = "anonymous";  // 允许跨域

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // 设置 canvas 尺寸为裁切后的表情包图片大小
                canvas.width = width;
                canvas.height = height;

                // 在 canvas 上裁切图像
                ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

                // 获取裁切后的图像的 data URL
                const croppedImageUrl = canvas.toDataURL();
                resolve(croppedImageUrl);
            } else {
                reject("Canvas context could not be obtained");
            }
        };

        img.onerror = () => {
            reject("Image loading failed");
        };
    });
}



export function getEmojiSrc(emojiName: string) {
    let obj = emojiNamesUrl.value[emojiNames.findIndex(obj => obj == emojiName)];
    if(obj){
        return obj;
    }else{
        emojiNamesUrl.value[0];
    }
}