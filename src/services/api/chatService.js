import { authenticatedApiService } from './authenticatedApiService';

export const chatService = {
  sendMessage: async (messageData) => {
    try {
      return await authenticatedApiService.chat.sendMessage(messageData);
    } catch (error) {
      throw new Error('Failed to send message');
    }
  },

  getSystemPrompt: (language) => {
    return authenticatedApiService.chat.getSystemPrompt(language);
  }
}; 