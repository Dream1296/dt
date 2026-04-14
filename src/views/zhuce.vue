<template>
    <div id="qb">
        <form class="register" @submit.prevent="submit()">
            <p>注册</p>
            <div class="field">
                <label>用户名</label>
                <input v-model="form.username" type="text" placeholder="请输入用户名" autocomplete="username" />
            </div>
            <div class="field">
                <label>昵称</label>
                <input v-model="form.nickname" type="text" placeholder="请输入昵称" />
            </div>
            <div class="field">
                <label>邮箱</label>
                <input v-model="form.email" type="email" placeholder="请输入邮箱" autocomplete="email" />
            </div>
            <div class="field">
                <label>密码</label>
                <input v-model="form.passwd" type="password" placeholder="请输入密码" autocomplete="new-password" />
            </div>
            <div class="field">
                <label>确认密码</label>
                <input v-model="form.confirm" type="password" placeholder="请再次输入密码" autocomplete="new-password" />
            </div>
            <input type="submit" class="btn" value="注  册" :disabled="loading" />
            <div class="to-login">
                已有账号？<span @click="router.push('/dl')">去登录</span>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showFailToast, showSuccessToast, showLoadingToast, closeToast } from 'vant';
import { register } from '@/api/api';

const router = useRouter();
const loading = ref(false);

const form = reactive({
    username: '',
    nickname: '',
    email: '',
    passwd: '',
    confirm: '',
});

async function submit() {
    if (!form.username.trim()) {
        showFailToast('请输入用户名');
        return;
    }
    if (!form.nickname.trim()) {
        showFailToast('请输入昵称');
        return;
    }
    if (!form.email.trim()) {
        showFailToast('请输入邮箱');
        return;
    }
    if (!form.passwd) {
        showFailToast('请输入密码');
        return;
    }
    if (form.passwd !== form.confirm) {
        showFailToast('两次密码不一致');
        return;
    }

    loading.value = true;
    showLoadingToast({ message: '注册中...', forbidClick: true });

    try {
        const res = await register(form.username, form.passwd, form.nickname, form.email);
        closeToast();
        if (res.code === 200 || res.message === 'OK') {
            showSuccessToast('注册成功');
            router.push('/dl');
        } else {
            showFailToast(res.message || '注册失败');
        }
    } catch {
        closeToast();
        showFailToast('网络异常，请重试');
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
* {
    user-select: none;
}

#qb {
    background-color: #85FFBD;
    background-image: linear-gradient(66deg, #85FFBD 0%, #FFFB7D 100%);
    background-size: cover;
    background-attachment: fixed;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.register {
    background-color: whitesmoke;
    width: 400px;
    border-radius: 25px;
    text-align: center;
    padding: 30px 40px 24px;
    box-sizing: border-box;
}

p {
    font-size: 23px;
    font-weight: 600;
    margin-bottom: 16px;
}

.field {
    text-align: left;
    margin-bottom: 8px;
}

label {
    display: block;
    font-size: 13px;
    color: #888;
    margin-bottom: 2px;
    padding-left: 2px;
}

input[type="text"],
input[type="email"],
input[type="password"] {
    background-color: whitesmoke;
    width: 100%;
    height: 44px;
    border: none;
    border-bottom: 2px solid silver;
    outline: none;
    font-size: 18px;
    box-sizing: border-box;
    transition: border-color 0.2s;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
    border-bottom-color: #59c2c5;
}

.btn {
    background-color: #59c2c5;
    width: 50%;
    height: 46px;
    border-radius: 8px;
    margin-top: 20px;
    font-size: 22px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    border: none;
    transition: background-color 0.2s;
}

.btn:hover:not(:disabled) {
    background-color: #59c2a0;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.to-login {
    margin-top: 14px;
    font-size: 14px;
    color: #888;
}

.to-login span {
    color: #59c2c5;
    cursor: pointer;
    font-weight: 600;
}

.to-login span:hover {
    text-decoration: underline;
}

@media (max-width: 480px) {
    .register {
        width: 90vw;
        padding: 24px 24px 20px;
    }
}
</style>
