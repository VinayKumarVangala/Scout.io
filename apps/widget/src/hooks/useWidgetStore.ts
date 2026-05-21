import { create } from 'zustand';

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface WidgetState {
  isOpen: boolean;
  isTyping: boolean;
  messages: Message[];
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  addMessage: (text: string, sender: 'user' | 'bot') => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

export const useWidgetStore = create<WidgetState>((set) => ({
  isOpen: false,
  isTyping: false,
  messages: [
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hi there! I am the Scout.io AI assistant. How can I help you navigate your knowledge base today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open: boolean) => set({ isOpen: open }),
  addMessage: (text: string, sender: 'user' | 'bot') =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Math.random().toString(36).substring(7),
          sender,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    })),
  setTyping: (typing: boolean) => set({ isTyping: typing }),
  clearMessages: () =>
    set({
      messages: [
        {
          id: 'welcome',
          sender: 'bot',
          text: 'Hi there! I am the Scout.io AI assistant. How can I help you navigate your knowledge base today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }),
}));
