import type { ChatMessage, ChatResponse } from '@/types';
const apiKey = 'xxxx';
const apiUrl = 'https://api.360.cn/v1/chat/completions';
export const chat = async (
  messageList: ChatMessage[]
): Promise<ChatResponse | undefined> => {
  try {
    const result = await fetch(apiUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: '360gpt-pro',
        messages: messageList,
        stream: false,
      }),
    });
    return result.json() as Promise<ChatResponse>;
  } catch (err) {
    console.error(err);
  }
};

export const chatStream = async (messageList: ChatMessage[]) => {
  try {
    const result = await fetch(apiUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: '360gpt-pro',
        messages: messageList,
        stream: true,
      }),
    });
    return result;
  } catch (err) {
    console.error(err);
  }
};

/* export const chat = async (messageList: ChatMessage[]) => {
  try {
    const result = await fetch(apiUrl, {
      method: 'post',
      // signal: AbortSignal.timeout(8000),
      // 开启后到达设定时间会中断流式输出
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: '360gpt-pro',
        stream: true,
        messages: messageList,
      }),
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}; */
