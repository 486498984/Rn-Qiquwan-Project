// store/imStore.js
import { create } from 'zustand';

export const useIMStore = create((set) => ({
  conversationList: [],
  unreadCount: 0,

  setConversationList: (list) => {
    let total = 0;
    list.forEach(item => {
      total += item.unreadCount;
    });

    set({
      conversationList: list,
      unreadCount: total,
    });
  },
}));