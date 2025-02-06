import { nextTick, type Ref } from "vue";
import { dtData } from "./getList";



export let obsDt: {
    index: number,
    observer: IntersectionObserver | null,
    addNum: number,
    dtAdd:  (dtsDom: Ref<HTMLElement[]>) => void,
    init: Function,
    guanbi_footer_show:Function,
} = {
    index: 0,
    observer: null,
    addNum: 5,
    guanbi_footer_show:()=>{},
    init() {
        this.index = 0;
    },

    dtAdd(dtsDom: Ref<HTMLElement[]>) {
        this.guanbi_footer_show();
        for (let i = this.index; i < this.index + this.addNum; i++) {
            if (i == dtData.values.length) {
                this.observer!.disconnect();
                return
            }
            dtData.addVlist(i);
        }
        this.index += this.addNum;

        nextTick(() => {            
            // 如果 observer 已经存在，断开之前的观察
            if (this.observer) {
                this.observer.disconnect();
            }

            this.observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    this.dtAdd(dtsDom);
                }
            });

            this.observer.observe(dtsDom.value[this.index - 3]);
        })
    }

}