<template>
  <div class="user-options">
    <button
      class="user-options__trigger"
      type="button"
      :aria-expanded="isOpen"
      @click="toggleOpen"
    >
      <span
        class="user-options__avatar"
        :class="{ 'user-options__avatar--empty': !currentAccount }"
      >
        <img v-if="currentAccount" :src="getTouxian(currentAccount.user)" alt="">
        <span v-else>未</span>
      </span>
      <span class="user-options__info">
        <span class="user-options__name">{{ accountText(currentAccount) }}</span>
      </span>
    </button>

    <Transition name="user-options-panel">
      <div v-if="isOpen" class="user-options__panel">
        <div class="user-options__panel-head">
          <span>账号切换</span>
          <span>{{ accountList.length }} 个账号</span>
        </div>

        <button
          v-for="item in accountList"
          :key="item.token"
          class="user-options__item"
          :class="{
            'user-options__item--active': item.token === currentAccount?.token,
            'user-options__item--loading': item.token === switchingToken
          }"
          type="button"
          :disabled="Boolean(switchingToken)"
          @click="switchAccount(item)"
        >
          <span class="user-options__avatar user-options__avatar--small">
            <img :src="getTouxian(item.user)" alt="">
          </span>
          <span class="user-options__item-text">
            <span class="user-options__item-name">{{ accountText(item) }}</span>
            <span class="user-options__item-meta">
              {{ item.token === currentAccount?.token ? '当前使用' : '点击切换' }}
            </span>
          </span>
          <span class="user-options__check"></span>
        </button>

        <div v-if="!accountList.length" class="user-options__empty">
          暂无账号
        </div>
      </div>
    </Transition>
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

function toggleOpen() {
  syncAccountList();
  isOpen.value = !isOpen.value;
}

function accountText(account?: TokenArr) {
  if (!account) {
    return '未登录';
  }
  return account.name ? `${account.name}（${account.user}）` : account.user;
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
@import url('./userOptions.less');
</style>
