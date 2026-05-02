<template>
  <div class="zhu">
    <topView :touxianSrc="getTouxian('xt')" :name="name" :dtid="dtid.toString()"></topView>
    <div class="text">鉴权系统</div>
    <div class="a">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field v-model="username" name="用户名" label="用户名" placeholder="用户名" autocomplete="username"
            :rules="[{ required: true, message: '请填写用户名' }]" />
          <van-field v-model="password" type="password" name="密码" label="密码" placeholder="密码"
            autocomplete="current-password" :rules="[{ required: true, message: '请填写密码' }]" />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>

    <div class="di">
      <!-- 日期 -->
      <div class="date">
        <text>2024-09-18</text>
      </div>
    </div>
  </div>

  <Line></Line>

</template>


<script setup lang="ts">
import { getTouxian, login } from '@/api/api';
import { showFailToast, showSuccessToast } from 'vant';
import topView from '../TopView/topView.vue';
import { ref } from 'vue';
import Line from "@/components/fenge/line.vue";
import { token } from '@/api/token';
import { getTempTokenApi } from '@/api/api';


// let onSubmit = ref('');
let username = ref('');
let password = ref('');

let name = ref("服务器");
let dtid = ref(999);

//传递事件
const emit = defineEmits(['success']);

function onSubmit(e: any) {
  login(username.value, password.value)

    .then(async (res) => {
      if (res.message != 'OK') {
        showFailToast('账号或密码错误');
        return
      }

      localStorage.setItem('token', res.token);
      token.token = res.token;
      token.istoken = 'true';
      token.tempToken = await getTempTokenApi(res.token);
      token.isTempToken = 'true';
      sessionStorage.setItem('tempToken', token.tempToken);
      emit('success');
      showSuccessToast('登录成功');

    })


}


</script>


<style lang="less" scoped>
@import url('@/assets/css/public.less');
@import url('./login.less');
</style>
