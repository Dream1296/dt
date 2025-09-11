<template>
    <div id="qb">


        <form class="login" @submit.prevent="tz()">
            <p>登录</p>
            <input type="text" v-model="userNmae" name="username" placeholder="用户名" id="username">
            <input type="password" v-model="passwd" placeholder="密码" id="pwd">
            <input type="submit" class="btn" value="登  录">
            <br>
            <!-- <input type="button" id="zhiwendl" class="btn" @click="zhiwen" value="游客登录"> -->
        </form>
    </div>
</template>

<script setup lang="ts">
import { login } from '@/api/api';
import { showFailToast, showSuccessToast } from 'vant';
import { ref } from 'vue';
let userNmae = ref<string>('');
let passwd = ref<string>('');

import { useRouter } from 'vue-router';
const router = useRouter();


async function tz() {

    login(userNmae.value, passwd.value)

        .then((res) => {
            if (res.message != 'OK') {
                showFailToast('账号或密码错误');
                return
            }
            showFailToast('账号或密码错误');

            localStorage.setItem('token', res.token);
            showSuccessToast('登录成功');
            router.push('/');
        })


}








</script>

<!-- CSS作用域仅为本文件 -->
<style scoped>
* {
    user-select: none;
    /* 无法选中，整体感更强 */
}

#qb {
    background: url(../img/wallpaper.jpg) no-repeat;
    background-color: #85FFBD;
    background-image: linear-gradient(66deg, #85FFBD 0%, #FFFB7D 100%);

    background-size: cover;
    background-attachment: fixed;
    height: 99vh;
}

.login {
    position: absolute;
    top: 50%;
    margin-top: -200px;
    left: 50%;
    margin-left: -200px;
    /* absolute居中的一种方法 */
    background-color: whitesmoke;
    width: 400px;
    height: 400px;
    border-radius: 25px;
    text-align: center;
    padding: 5px 40px;
    box-sizing: border-box;
    /* 这样padding就不会影响大小 */
}

p {
    font-size: 23px;
    font-weight: 600;
}

input {
    background-color: whitesmoke;
    width: 100%;
    height: 48px;
    margin-bottom: 10px;
    border: none;
    border-bottom: 2px solid silver;
    /* 下面的会覆盖上面的步伐 */
    outline: none;
    font-size: 22px;
}

.btn {
    background-color: #59c2c5;
    /* position: absolute; */
    /* top: 280px; */

    width: 38%;
    height: 48px;
    border-radius: 8px;
    margin-top: 40px;
    font-size: 28px;
    font-weight: 600;
    color: white;
}

.btn:hover {
    background-color: #59c2a0;
}

#waifu {
    position: relative;
    top: 10px;
    left: 800px;
}

#zhiwendl {
    /* position: absolute; */
    left: 380px;
    top: 66%;
    width: 146px;
    margin-top: 12px;

}
</style>