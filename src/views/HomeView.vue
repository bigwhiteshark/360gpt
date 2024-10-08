<template>
  <main>
    <h1>This is a 360chat page</h1>
    <div class="container">
      <div class="message-box" ref="chatListDom">
        <div
          class="message-item"
          v-for="(item, index) of messageList.filter(
            (v) => v.role !== 'system'
          )"
          :key="index"
        >
          <div class="message-header">
            <div class="font-bold">{{ roleAlias[item.role] }}：</div>
            <div class="" :content="item.content"></div>
          </div>
          <div>
            <div
              class="prose text-sm text-slate-600 leading-relaxed"
              v-if="item.content"
              v-html="md.render(item.content)"
            ></div>
            <div v-else>loading...</div>
          </div>
        </div>
      </div>
      <div class="input-box">
        <input
          class="input"
          :type="'text'"
          :placeholder="'请输入'"
          v-model="messageContent"
          @keydown.enter="isTalking || sendOrSave()"
        />
        <button class="btn" :disabled="isTalking" @click="sendOrSave()">
          {{ '发送' }}
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { ChatMessage } from '@/types';
import { ref, watch, nextTick } from 'vue';
import { chat } from '@/api';
import { md } from '@/modules/markdown';

const messageList = ref<ChatMessage[]>([
  {
    role: 'system',
    content: '你是 360GPT，是智脑用中文训练的大型语言模型，尽可能简洁地回答。',
  },
  {
    role: 'assistant',
    content: `你好，我是AI语言模型，我可以提供一些常用服务和信息，例如：
            1. 翻译：我可以把中文翻译成英文，英文翻译成中文，还有其他一些语言翻译，比如法语、日语、西班牙语等。
            2. 咨询服务：如果你有任何问题需要咨询，例如健康、法律、投资等方面，我可以尽可能为你提供帮助。
            3. 闲聊：如果你感到寂寞或无聊，我们可以聊一些有趣的话题，以减轻你的压力。
          请告诉我你需要哪方面的帮助，我会根据你的需求给你提供相应的信息和建议。`,
  },
]);
const messageContent = ref('');
const roleAlias = { user: '我', assistant: '360GPT', system: 'System' };
const isTalking = ref(false);
const chatListDom = ref<HTMLDivElement>();

const clearMessageContent = () => (messageContent.value = '');
const appendLastMessageContent = (content: string | undefined) => {
  messageList.value[messageList.value.length - 1].content += content;
};

const sendChatMessage = async () => {
  isTalking.value = true;
  if (messageList.value.length === 2) {
    messageList.value.pop();
  }
  messageList.value.push({
    role: 'user',
    content: messageContent.value,
  });
  clearMessageContent();
  messageList.value.push({
    role: 'assistant',
    content: '',
  });

  const response = await chat(messageList.value);
  const constent = response?.choices?.[0]?.message?.content;
  appendLastMessageContent(constent);
  isTalking.value = false;
};

const sendOrSave = async () => {
  if (!messageContent.value.length) {
    return;
  }
  sendChatMessage();
  isTalking.value = true;
};
const scrollToBottom = () => {
  if (chatListDom.value) {
    chatListDom.value.scrollTo(0, chatListDom.value.scrollHeight);
  }
};
watch(messageList.value, () => {
  nextTick(() => scrollToBottom());
});
</script>

<style scoped>
pre {
  font-family: -apple-system, 'Noto Sans', 'Helvetica Neue', Helvetica,
    'Nimbus Sans L', Arial, 'Liberation Sans', 'PingFang SC', 'Hiragino Sans GB',
    'Noto Sans CJK SC', 'Source Han Sans SC', 'Source Han Sans CN',
    'Microsoft YaHei', 'Wenquanyi Micro Hei', 'WenQuanYi Zen Hei', 'ST Heiti',
    SimHei, 'WenQuanYi Zen Hei Sharp', sans-serif;
}

body {
  margin: 0;
  padding: 0;
  place-items: normal;
  background-color: #f0f0f0;
}
.container {
  position: relative;
  width: 100%;
  height: calc(100vh - 200px);
}
.container .message-box {
  width: 980px; 
  height: 550px;
  overflow-y: auto;
  background-color: #eee;
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
  border: 2px solid #000;
}
.container .message-box .message-item {
  width: 100%;
  padding: 10px 20px;
}
.input-box {
  display: flex;
  margin-top: 10px;
  align-items: center;
  justify-content: space-between;
}
.input-box .input {
  height: 50px;
  width: 100%;
  margin-right: 5px;
  outline: none;
  padding: 0 20px;
  font-size: 18px;
  border-radius: 8px;
  background-color: #fff;
}
.input-box .btn {
  height: 50px;
  width: 100px;
  outline: none;
  padding: 0 20px;
  font-size: 18px;
  border-radius: 8px;
  background-color: #fff;
}
</style>
