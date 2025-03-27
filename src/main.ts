import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initCordovaApi } from './api/cordovaApi'

import App from './App.vue'
import router from './router'

// 1. 引入你需要的组件
import { Button } from 'vant';
import { Toast } from 'vant';
import { Dialog } from 'vant';
import { Search } from 'vant';
import { Form, Field } from 'vant';
import { RadioGroup, Radio } from 'vant';
import { DatePicker } from 'vant';
import { TimePicker } from 'vant';
import { Popup } from 'vant';
import { Stepper } from 'vant';
import { Switch } from 'vant';




// 2. 引入组件样式
import 'vant/lib/index.css';

initCordovaApi();

const app = createApp(App);


import { CellGroup } from 'vant';
import { apiInit } from './api/apiIng'

import { testNw } from '@/api/api';
testNw();

app.use(Form);
app.use(Field);
app.use(CellGroup);

app.use(createPinia());

// 设备检测
const deviceStore = userStore();
deviceStore.isPcFn();


app.use(router);
app.use(Button);
app.use(Toast);
app.use(Dialog);
app.use(Search);
// app.use(Form);
// app.use(Field);
app.use(RadioGroup);
app.use(Radio);
app.use(DatePicker);
app.use(TimePicker);
app.use(Popup);
app.use(Stepper);
app.use(Switch);

import { PasswordInput, NumberKeyboard } from 'vant';

app.use(PasswordInput);
app.use(NumberKeyboard);



import { Circle } from 'vant';
app.use(Circle);


import { Swipe, SwipeItem } from 'vant';

app.use(Swipe);
app.use(SwipeItem);

import { Checkbox } from 'vant';
app.use(Checkbox);


import { ShareSheet } from 'vant';
import { userStore } from './stores/userStore'
app.use(ShareSheet);




apiInit();




app.mount('#app')


