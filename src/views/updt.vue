<template>
    <div id="all" @click="stops">
        <div id="bj">
            <img src="../assets/img/updtbgs.png">
        </div>

        <!-- {{ num[0] }} -->
        <!-- 输入框 -->
        <div id="shuru" contenteditable ref="shuru">
        </div>

        <!-- 底部选项栏 -->
        <div id="di" :style="{ top: diTop }" v-show="!showEmo">
            <div @click.stop="funs(1)">
                <img src="../assets/img/videoA.png">
            </div>
            <div @click.stop="funs(2)">
                <img src="../assets/img/imgA.png">
            </div>
            <div @click.stop="funs(3)">
                <img src="../assets/img/configs.png">
            </div>
            <div @click.stop="funs(4)">
                <img src="../assets/img/emojiBtn.png">
            </div>
        </div>

        <!-- 表情包菜单 -->
        <div id="emojiC" v-show="showEmo">
            <div v-for="(a, index) in emojiList" @click.stop="insEmoji(a)">
                <img v-if="emojiNamesUrl[index]" :src="emojiNamesUrl[index]">
            </div>
        </div>

        <!-- 图片选项 -->
        <div id="imgs" v-show="imgV" @click.stop="">
            <div v-for="a in imgSrcArr">
                <img :src="a">
            </div>
            <div style="background-color:aquamarine;" @click.stop="upimgs">
                <img src="../assets/img/updt.png">
            </div>
            <input @change.stop="upimgss" multiple type="file" ref="upImg" id="fileInput" style="display: none;"
                accept="image/*">
        </div>

        <!-- 视频选项 -->
        <div id="videos" v-show="videoV" @click.stop="">
            <div v-for="a in videoSrcArr">
                {{ a }}
                <!-- <video :src="a"></video> -->
            </div>
            <div style="background-color:aquamarine;" @click.stop="videos">
                <img src="../assets/img/updt.png">
            </div>
            <input id="upfiles" ref="upVideo" @change="upfilevideo" v-show="false" type="file" multiple>
        </div>

        <!-- 设置-->
        <div id="configs" v-show="configV" @click.stop="">
            <h3>图片显示数</h3>
            <van-stepper v-model="showImgNum" min="0" max="6" />
            <h3>权限等级-{{ loa }}</h3>
            <van-radio-group v-model="loa" direction="horizontal">
                <van-radio name="0">public</van-radio>
                <van-radio name="1">Protected</van-radio>
                <van-radio name="13">Private</van-radio>
            </van-radio-group>
            <h3>内部上传图片</h3>
            <van-switch v-model="isImgDir" />

            <h3>发布参考时间</h3>
            <p @click="showSetDate = true; showPopup = true">
                {{ dateArr.join('-') }}
            </p>

            <p @click.stop="showSetTime = true; showPopup = true">
                {{ timeArr.join(':') }}
            </p>

            <van-button type="success" @click="huishuText">上次的文本</van-button>



        </div>


        <van-popup v-model:show="showSetDate" round position="bottom" :style="{ height: '50%' }" @click.stop="">
            <van-date-picker v-model="dateArr" title="选择日期" v-if="true" @confirm="showSetDate = false" />
        </van-popup>

        <van-popup v-model:show="showSetTime" round position="bottom" :style="{ height: '50%' }" @click.stop="">
            <van-time-picker v-model="timeArr" title="选择时间" @confirm="showSetTime = false" />
        </van-popup>






        <div id="build" @click.stop="updts">
            <img src="../assets/img/updata.png">
        </div>







    </div>
    <div v-show="isupIng" id="overlay">
        <div class="wrapper">
            <van-circle v-model:current-rate="upfilejd" :rate="0" :speed="100" :text="upfilejd + '%'">
            </van-circle>
        </div>


    </div>
</template>



<script setup lang="ts">

import { emojiSrc, emoList } from '@/api/api';
import { ac, postDt, upfile, upfiles } from '@/api/upapi';
import { computed, onMounted, ref } from 'vue';
import { closeToast, showConfirmDialog, showFailToast, showLoadingToast, showSuccessToast, Toast } from 'vant';
import router from '@/router';
import { getemojiImg, emojiNamesUrl, emojiNames } from '@/util/dt/emoji';
import { watch } from 'vue';
// emojiSrc

let shuru = ref<HTMLDivElement>();
let upImg = ref<HTMLInputElement>();
let upVideo = ref<HTMLInputElement>();
let emojiList = ref<string[]>();
emojiList.value = emojiNames;
const gradientColor = {
    '0%': '#3fecff',
    '100%': '#6149f6',
};

//视图高度
let initialHeight: number;
let diTop = ref('calc(100% - 40px  )');
let showEmo = ref(false);

let loa = ref('0');
let dateArr = ref<string[]>([]);
let timeArr = ref<string[]>([]);

let isImgDir = ref(false);

//弹出层日期
let showSetDate = ref(false);
//弹出层时间
let showSetTime = ref(false);

let showPopup = false;

//是否显示上传
let isupIng = ref(false);


//
let showImgNum = ref(0);
let videoV = ref(false);
let imgV = ref(false);
let configV = ref(false);

let a = ref<number[]>([0]);


// 从本地存储中获取上一次内容
function huishuText() {

    showConfirmDialog({
        title: '确定要加载吗？',
        message:
            '如果解决方法是丑陋的，那就肯定还有更好的解决方法，只是还没有发现而已。',
    })
        .then(() => {
            let updTtText = localStorage.getItem('updTtText');

            if (updTtText && shuru.value) {
                shuru.value.innerHTML = updTtText;
            }
            showSuccessToast("完成");
        })
        .catch(() => {
            showFailToast('用户取消');
        });

}


onMounted(() => {



    shuru.value?.addEventListener('input', (e) => {
        let shuruText = shuru.value?.innerHTML;
        if (!shuruText) {
            return
        }
        localStorage.setItem('updTtText', shuruText);
        textInputHeightAuto();
    })

    initialHeight = window.innerHeight;

    //表情包处理
    let lists: string[] = [];
    emoList()
        .then((list) => {
            emojiList.value = list;
            lists = list;
        })
        .then(async () => {
            // for(let emo of lists){
            //     let url = await getemojiImg(emo);
            //     let index = lists.findIndex((obj)=> obj == emo);
            //     getemojiImgArr.value[index] = url;
            // }
        })
})


function textInputHeightAuto() {
    let shuruDom = shuru.value;
    if (shuruDom == null) {
        return
    }
    let shuruDomHO = window.getComputedStyle(shuruDom);
    // 重置高度以便重新计算
    shuruDom.style.height = 'auto';
    // 设置新的高度，确保文本框不小于最小高度
    shuruDom.style.height = Math.max((shuruDom.scrollHeight + 40), 150) + 'px';
}



//图片数据
let imgArr: any[] = [];

//图片预览地址
let imgSrcArr = ref<string[]>([]);

//初始化时间日期
let date = new Date();
dateArr.value = [date.getFullYear().toString(), (date.getMonth() + 1).toString(),
date.getDate().toString()
];
timeArr.value = [
    date.getHours().toString(), date.getMinutes().toString()
];

let num = ref<number[]>([0]);

//视频数据
let videoArr: any[] = [];
//视频地址
let videoSrcArr = ref<string[]>([]);

function upimgs() {
    upImg.value?.click();
}

let isUp = false;

let upfilejd = ref(0);


async function updts() {

    if (isUp) {
        return
    }

    //正文信息
    let txt = getInputText();
    if (txt.length == 0 && imgArr.length == 0 && videoArr.length == 0) {
        showFailToast('不能为空');
        return
    }

    isUp = true;

    //上传媒体资源
    let pro = upfiles(imgArr, videoArr);
    let allNum = imgArr.length + videoArr.length;

    watch(
        () => pro.percentCompleteArr.value[0].reduce((acc: number, cur: number) => acc + cur, 0) + pro.percentCompleteArr.value[1].reduce((acc: number, cur: number) => acc + cur, 0)
        ,
        (val) => {
        let temp = 0;
        pro.percentCompleteArr.value[0].forEach((item, index) => {
            temp += item;
        });
        pro.percentCompleteArr.value[1].forEach((item, index) => {
            temp += item;
        });
        upfilejd.value = Math.floor(temp / allNum * 100);
        console.log(upfilejd.value);
    })
    isupIng.value = true;

    let bool = await Promise.all(pro.upPromise.map(task => task()));


    // num = pro.percentCompleteArr;
    if (!bool) {
        return console.log('错误');
    }
    if (showImgNum.value == 0) {
        showImgNum.value = imgArr.length > 6 ? 6 : imgArr.length;
    }
    let time = getDataTime(dateArr.value, timeArr.value);
    postDt(txt, pro.imgNameArr, showImgNum.value.toString(), time, loa.value, pro.videoNumArr, isImgDir.value)
        .then((a: any) => {
            if (a.tf == 1) {
                isupIng.value = false;
                showSuccessToast('上传成功！');
                setTimeout(() => {
                    router.push({ path: '/' });
                }, 500);
            }

        })






}

//将图片添加到数组
function upimgss(e: any) {
    let dataArr = e.target.files;
    for (let a of dataArr) {
        imgArr.push(a);
        let reader = new FileReader();
        reader.onload = function (event) {
            if (event.target && event.target.result) {
                imgSrcArr.value.push(event.target.result.toString());
            }
        }
        reader.readAsDataURL(a);
    }
}

function videos() {
    upVideo.value?.click();
}

function upfilevideo(e: any) {
    let dataArr = e.target.files;
    for (let a of dataArr) {
        videoArr.push(a);
        videoSrcArr.value.push(a.name);

    }
}






function funs(temp: number) {
    if (temp == 1) {
        videoV.value = !videoV.value;
        // videoV.value = false;
        imgV.value = false;
        configV.value = false;
        showEmo.value = false;
    }
    if (temp == 2) {
        imgV.value = !imgV.value;
        videoV.value = false;
        // imgV.value = false;
        configV.value = false;
        showEmo.value = false;
    }
    if (temp == 3) {
        configV.value = !configV.value;
        videoV.value = false;
        imgV.value = false;
        // configV.value = false;
        showEmo.value = false;
    }
    if (temp == 4) {
        showEmo.value = !showEmo.value;
        videoV.value = false;
        imgV.value = false;
        configV.value = false;
        // showEmo.value = false;
    }
}

//关闭页面
function stops() {


    if (showPopup) {
        showPopup = false;
        return
    }
    if (showEmo.value) {
        showEmo.value = false;
    }
    if (videoV.value) {
        videoV.value = false;
    }
    if (configV.value) {
        configV.value = false;
    }
    if (imgV.value) {
        imgV.value = false;
    }


}

function setVTop(e: any) {
    let vHeight = window.visualViewport!.height;
    // alert(vHeight); 


    if (vHeight < initialHeight) {
        diTop.value = `calc(${vHeight} - 100px  )`;
    } else {
        diTop.value = 'calc(100% - 40px  )';
    }
}



//获取输入文本
function getInputText() {

    let text = shuru.value?.innerHTML!;

    // 替换 <img> 标签，将其替换为 ^[表情名称]^ 格式
    let formattedText = text.replace(/<img[^>]*data-emoji="([^"]+)"[^>]*>/g, '^[$1]^');

    // 替换 <div> 标签为换行符 \n
    formattedText = formattedText.replace(/<\/?div>/g, '\n');

    // 替换 &nbsp; 为普通的空格
    formattedText = formattedText.replace(/&nbsp;/g, ' ');

    // 去除其他多余的 HTML 标签
    formattedText = formattedText.replace(/<[^>]+>/g, '');

    console.log(formattedText);


    return formattedText
}



// 将表情包插入到输入框中
function insEmoji(name: string) {
    let sel = window.getSelection()!;
    if (sel.rangeCount > 0) {
        // 获取当前的 Range 对象
        let range = sel.getRangeAt(0);

        // 删除当前的选区内容（如果有）
        range.deleteContents();

        // 创建一个 img 元素
        let img = document.createElement('img');
        // img.src = emojiSrc(name);     // 设置图片的 URL
        img.src = emojiNamesUrl.value[emojiNames.findIndex(obj => obj == name)];

        img.alt = name;      // 设置图片的 alt 属性
        img.setAttribute('data-emoji', name); // 自定义属性，存储表情名称
        img.style.width = '25px';
        img.style.height = '25px';
        // img.style.lineHeight = '33px';
        img.style.position = 'relative';
        img.style.top = '6px';
        img.style.marginRight = '3px';
        img.style.marginLeft = '3px';


        // 插入 img 标签
        range.insertNode(img);

        // 移动光标到图片之后
        range.setStartAfter(img);
        range.setEndAfter(img);

        // 将光标重新放置在图片后面
        sel.removeAllRanges();
        sel.addRange(range);
        showEmo.value = false;
    }
}

function getDataTime(dateArr: string[], timeArr: string[]) {
    const year = dateArr[0];
    const month = String(dateArr[1]).padStart(2, '0');
    const day = String(dateArr[2]).padStart(2, '0');
    const hours = String(timeArr[0]).padStart(2, '0');
    const minutes = String(timeArr[1]).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
}





</script>


<style scoped lang="less">
@import url('../assets/css/updt.less');
</style>