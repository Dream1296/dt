<template>
    <div class="mobile-user-options">
        <button
            class="mobile-user-options__trigger"
            type="button"
            :aria-expanded="isOpen"
            @click="openPanel"
        >
            <span
                class="mobile-user-options__avatar"
                :class="{ 'mobile-user-options__avatar--empty': !currentAccount }"
            >
                <img v-if="currentAccount" :src="getTouxian(currentAccount.user)" alt="">
                <span v-else>未</span>
            </span>
            <span class="mobile-user-options__info">
                <span class="mobile-user-options__name">{{ accountConfigText(currentAccount) }}</span>
            </span>
        </button>

        <Teleport to="body">
            <Transition name="mobile-user-options-panel">
                <div
                    v-if="isOpen"
                    class="mobile-user-options__overlay"
                    @click.self="closePanel"
                >
                    <div class="mobile-user-options__panel" role="dialog" aria-modal="true">
                        <div class="mobile-user-options__panel-head">
                            <span>账号切换</span>
                            <button type="button" aria-label="关闭" @click="closePanel">×</button>
                        </div>

                        <div class="mobile-user-options__list">
                            <button
                                v-for="item in accountList"
                                :key="item.token"
                                class="mobile-user-options__item"
                                :class="{
                                    'mobile-user-options__item--active': item.token === currentAccount?.token,
                                    'mobile-user-options__item--loading': item.token === switchingToken
                                }"
                                type="button"
                                :disabled="Boolean(switchingToken)"
                                @click="switchAccount(item)"
                            >
                                <span class="mobile-user-options__avatar mobile-user-options__avatar--small">
                                    <img :src="getTouxian(item.user)" alt="">
                                </span>
                                <span class="mobile-user-options__item-text">
                                    <span class="mobile-user-options__item-name">{{ accountText(item) }}</span>
                                    <span class="mobile-user-options__item-meta">
                                        {{ item.token === currentAccount?.token ? '当前使用' : '点击切换' }}
                                    </span>
                                </span>
                                <span class="mobile-user-options__check"></span>
                            </button>

                            <div v-if="!accountList.length" class="mobile-user-options__empty">
                                暂无账号
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getTempTokenApi, getTouxian } from '@/api/api';
import { token } from '@/api/token';
import { tokenArrObj } from '@/api/tokenArr';
import type { TokenArr } from '@/types/dtType';

const router = useRouter();
const isOpen = ref(false);
const switchingToken = ref('');
const accountList = ref<TokenArr[]>([]);
let syncTimer: number | undefined;
let syncCount = 0;

const currentAccount = computed(() => accountList.value[0]);

onMounted(() => {
    syncAccountList();
    syncTimer = window.setInterval(syncAccountListFromTokenObj, 500);
});

onBeforeUnmount(() => {
    clearSyncTimer();
});

function syncAccountList() {
    accountList.value = [...tokenArrObj.tokenArr];
}

function syncAccountListFromTokenObj() {
    syncAccountList();
    syncCount += 1;

    const localToken = localStorage.getItem('token');
    if (!localToken || currentAccount.value?.token === localToken || syncCount >= 30) {
        clearSyncTimer();
    }
}

function clearSyncTimer() {
    if (syncTimer) {
        window.clearInterval(syncTimer);
        syncTimer = undefined;
    }
}

function openPanel() {
    syncAccountList();
    isOpen.value = true;
}

function closePanel() {
    if (switchingToken.value) {
        return;
    }

    isOpen.value = false;
}

function accountText(account?: TokenArr) {
    if (!account) {
        return '未登录';
    }
    return account.name ? `${account.name}（${account.user}）` : account.user;
}

function accountConfigText(account?: TokenArr) {
    if (!account) {
        return '未登录';
    }
    return account.name ? `${account.name}(${account.user})` : account.user;
}

async function switchAccount(account: TokenArr) {
    if (switchingToken.value) {
        return;
    }

    if (account.token === currentAccount.value?.token) {
        isOpen.value = false;
        return;
    }

    switchingToken.value = account.token;

    try {
        localStorage.setItem('token', account.token);
        token.token = account.token;
        token.istoken = 'true';

        try {
            token.tempToken = await getTempTokenApi(account.token);
            token.isTempToken = 'true';
            sessionStorage.setItem('tempToken', token.tempToken);
        } catch {
            token.tempToken = '';
            token.isTempToken = 'false';
            sessionStorage.removeItem('tempToken');
        }

        await tokenArrObj.unshift(account.token);
        syncAccountList();
        isOpen.value = false;
        await refreshApp();
    } finally {
        switchingToken.value = '';
    }
}

async function refreshApp() {
    try {
        await router.replace({ path: '/' });
    } finally {
        window.location.reload();
    }
}
</script>

<style scoped lang="less">
@import url('./mobileUserOptions.less');
</style>
