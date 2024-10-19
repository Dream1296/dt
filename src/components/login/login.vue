<template>
  <div class="zhu">
    <div class="touxian">
      <img src="https://frp-fix.top:20047/api/userImg?name=xt"></img>
    </div>
    <!-- 名字 -->
    <div class="name">
      <text>系统</text>
    </div>
    <div class="text">登录</div>
    <div class="a">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field v-model="username" name="用户名" label="用户名" placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]" />
          <van-field v-model="password" type="password" name="密码" label="密码" placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]" />
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

  <hr>

</template>


<script setup lang="ts">
import { login } from '@/api/api';
import { showSuccessToast } from 'vant';
import { ref } from 'vue';


// let onSubmit = ref('');
let username = ref('');
let password = ref('');

function onSubmit(e: any) {
  login(username.value, password.value)

    .then((res) => {      
      if(res.message != 'OK'){
        return
      }

      localStorage.setItem('token', res.token);
      showSuccessToast('登录成功');  
      
    })


}


</script>


<style lang="less" scoped>
@import url('./login.less');
</style>