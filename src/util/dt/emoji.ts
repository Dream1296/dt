import { emojiSrc } from "@/api/api";
import { ref } from "vue";

// 表情名称列表（和之前一致）
export const emojiNames = [
    "微笑", "撇嘴", "色", "发呆", "得意", "流泪", "害羞", "闭嘴", "睡", "大哭",
    "尴尬", "发怒", "调皮", "呲牙", "惊讶", "难过", "抓狂", "吐", "偷笑", "愉快",
    "白 眼", "傲慢", "困", "惊恐", "憨笑", "悠闲", "咒骂", "疑问", "嘘", "晕",
    "衰", "骷髅", "敲打", "再见", "擦汗", "抠鼻", "鼓掌", "坏笑", "右哼哼", "鄙视",
    "委屈", "快哭了", "阴险", "亲亲", "可怜", "笑脸", "生病", "脸红", "破涕为笑",
    "恐惧", "失望", "无语", "嘿哈", "捂脸", "奸笑", "机智", "皱眉", "耶", "吃瓜",
    "加油", "汗", "天啊", "Emm", "社会社会", "旺柴", "好的", "打脸", "哇", "翻白眼",
    "666", "让我看看", "叹气", "苦涩", "裂开", "嘴唇", "爱心", "心碎", "拥抱", "强",
    "弱", "握手", "胜利", "抱拳", "勾引", "拳头", "OK", "合十", "啤酒", "蛋糕",
    "玫 瑰", "凋谢", "菜刀", "炸弹", "便便", "月亮", "太阳", "礼物", "红包", "發",
    "福", "烟花", "爆竹", "猪头", "跳跳", "发抖", "转圈"
];

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

fn();

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
