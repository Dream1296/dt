import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initCordovaApi } from './api/cordovaApi'

import App from './App.vue'
import router from './router'

// 1. 引入你需要的组件
import { Button } from 'vant';
import { Toast  } from 'vant';
import { Dialog } from 'vant';
import { Search  } from 'vant';
import { Form, Field } from 'vant';
import { RadioGroup, Radio } from 'vant';
import { DatePicker } from 'vant';
import { TimePicker } from 'vant';
import { Popup } from 'vant';
import { Stepper } from 'vant';

// 2. 引入组件样式
import 'vant/lib/index.css';
import { tokenInit } from './getToken'


initCordovaApi()

const app = createApp(App);


// import { createApp } from 'vue';
import {  CellGroup } from 'vant';

app.use(Form);
app.use(Field);
app.use(CellGroup);

app.use(createPinia())
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








//初始化token
tokenInit();




app.mount('#app')








