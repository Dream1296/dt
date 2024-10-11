let isDeviceReady = false; // 全局标识

//判断是否在Cordova环境中
function isCordova() {
    return typeof window !== 'undefined' && typeof window.cordova !== 'undefined';
}

//监听初始化完成
export function initCordovaApi() {
    // 在应用启动时监听 deviceready 事件
    document.addEventListener('deviceready', () => {
        isDeviceReady = true;
    }, false);
}

//判断是否已初始化完成
function onDeviceReady(): Promise<void> {
    if (isDeviceReady) {
        return Promise.resolve(); // 如果 deviceready 已经触发，直接返回成功的 Promise
    } else {
        return new Promise((resolve) => {
            document.addEventListener('deviceready', () => {
                isDeviceReady = true;
                resolve();
            }, false);
        });
    }
}

// 示例：获取地理位置的封装函数
export async function getCurrentPosition(): Promise<GeolocationPosition> {
    //如果是安卓程序
    if(isCordova()){
        await onDeviceReady(); // 确保 Cordova 初始化完成
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position)=>{                
                resolve(position);
            }, reject, {
                enableHighAccuracy: true
            });
        });
    }

    //非安卓环境下
    if(true){
        return new Promise((resolve, reject) => {
            let data:GeolocationPosition = new GeolocationPosition;
            resolve(data);
        })
    }
}


