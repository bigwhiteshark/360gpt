export interface ChatMessage {
  role: 'system' | 'assistant' | 'user';
  content: string;
}
export interface ChatResponse {
  choices: [
    {
      message: {
        content: string;
      };
      finish_reason: string;
      index: number;
    }
  ];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}
