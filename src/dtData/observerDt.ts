import { nextTick, type Ref } from "vue";
import { dtData } from "./dtList";
import { myEvent } from "@/myEnit";
import { routerPush } from "@/utils/dt/routerUtil";

type obsDtType = {
    index: number,
    observerPreviou: IntersectionObserver | null,
    observerNext: IntersectionObserver | null,
    addNumNext: number,
    addNumPreviou: number,
    dtAddNext: (dtsDom: Ref<HTMLElement[]>) => void,
    dtAddPreviou: (dtsDom: Ref<HTMLElement[]>) => void,
    init: Function,
    guanbi_footer_show: Function,
}

let screenPrevOffset = 0;
let screenNextOffset = 0;


export let obsDt: obsDtType = {
    index: 3,
    observerPreviou: null,
    observerNext: null,
    addNumNext: 5,
    addNumPreviou: 5,
    guanbi_footer_show: () => { },
    /**
     * 
     * @param dtsDom 观察的dom数组
     * @param startNum 开始元素索引
     */
    init(dtsDom: Ref<HTMLElement[]>, startNum: number) {
        dtData.vlist.value = [];
        this.index = startNum;
        this.dtAddNext(dtsDom);

        nextTick(() => {


            this.dtAddPreviou(dtsDom);

            setTimeout(() => {


                if (startNum == 0) {
                    return
                }
                let a = dtsDom.value[0].offsetTop + 200;
              
                window.scrollTo({
                    top: a,
                    behavior: 'auto'
                });
            }, 0)


        })

    },

    dtAddNext(dtsDom: Ref<HTMLElement[]>) {

        this.guanbi_footer_show();
   

        //添加addNum个元素
        for (let i = this.index; i < this.index + this.addNumNext; i++) {
            if (i == dtData.list.length) {
                this.observerNext!.disconnect();
                return
            }
            dtData.addVlist(i);
            

        }
        myEvent.emit('upLookDtId',this.index);
        this.index += this.addNumNext;

        nextTick(() => {
            if (screenPrevOffset == 0) {
                screenPrevOffset = dtsDom.value[0].offsetTop;
            }
            // 如果 observer 已经存在，断开之前的观察
            if (this.observerNext) {
                this.observerNext.disconnect();
            }

            // 设置observer的回调函数，触发回调再次运行本函数
            this.observerNext = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    this.dtAddNext(dtsDom);
                }
            });
      

            // 设置observer的观察元素，倒数第2个元素
            this.observerNext.observe(dtsDom.value[dtsDom.value.length - 3]);
        })
    },


    dtAddPreviou(dtsDom: Ref<HTMLElement[]>) {
        let start = this.index - dtsDom.value.length;

        if (start == 0 || start < 0) {
            return
        }

        for (let i = start - 1; i > start - this.addNumPreviou; i--) {
            if (i == 0) {
                return
            }
      
            dtData.addVlist(i, 'previou');
            myEvent.emit('upLookDtId',i);
        }

        nextTick(() => {
            if (screenNextOffset == 0) {
                screenNextOffset = dtsDom.value[0].offsetTop;
                // const diff = newOffset - prevOffset;
                // container.scrollTop += diff;
            }
            // 如果 observer 已经存在，断开之前的观察
            if (this.observerPreviou) {
                this.observerPreviou.disconnect();
            }

            // 设置observer的回调函数，触发回调再次运行本函数
            this.observerPreviou = new IntersectionObserver((entries) => {

                if (entries[0].isIntersecting) {
                    this.dtAddPreviou(dtsDom);
                }
            });

            // 设置observer的观察元素，倒数第2个元素
            this.observerPreviou.observe(dtsDom.value[dtsDom.value.length - 2]);
        })



    }


}


myEvent.on('upLookDtId',(e)=>{
    if(e == -1){
        routerPush('dtId', null);
        return;
    }
    routerPush('dtId', e as string);
})