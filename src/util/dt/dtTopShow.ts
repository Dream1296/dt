import {ref, type Ref} from 'vue';

let observer1: IntersectionObserver | null = null;
let objI = 0;

export function showTop(showBg:Ref<boolean> , head:Ref<HTMLElement> ) {
    observer1 = new IntersectionObserver((entries) => {
        if(objI == 0){
            return objI++;
        }
        showBg.value = !showBg.value;
    });
    observer1.observe(head.value);
}

