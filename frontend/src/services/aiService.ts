import apiClient from './apiClient';

export interface ChatResponse {
  status: string;
  data: {
    reply: string;
  };
}

export const aiService = {
  async chat(message: string) {
    const response = await apiClient.post<ChatResponse>('/ai/chat', { message });
    return response.data;
  }
};
