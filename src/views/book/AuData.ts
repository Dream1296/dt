import { getBookAu } from "./book";

//音频存储
type auUrl = { id: number, url: any };


let AuData = {
    bookId:<string>'',
    data: <auUrl[]>[],
    pushData: async function (id: number) {
        this.delData(id);
        let a = this.data.find(obj => obj.id == id);
        if (!a) {
            const url = await getBookAu(this.bookId,id);
            this.data.push({
                id,
                url,
            })
            return {
                id,
                url,
            }
        } else {
            return a;
        }

    },
    getAuData: async function (id: number) {
        let a = this.data.find(obj => obj.id == id);
        if (!a) {
            let b = await this.pushData(id);
            setTimeout(() => {
                this.getdatas(id)
            })
            return b;
        } else {
            setTimeout(() => {
                this.getdatas(id)
            })
            return a;
        }

    },
    //预加载
    getdatas: async function (id: number) {
        let num = 5;
        for (let i = 0; i < num; i++) {
            id++;
            await this.pushData(id);
        }
    },
    //删除
    delData: function (id: number) {
        id -= 10;
        let a = this.data.find(obj => obj.id == id);
        if (a) {
            a.id = -1;
            a.url = '';
        }
    }

}

export  {AuData}