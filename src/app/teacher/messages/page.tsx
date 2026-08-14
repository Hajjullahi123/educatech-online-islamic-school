"use client";

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, CheckCheck, Search, MessageSquare, Sparkles, Inbox, ShieldAlert } from 'lucide-react';

interface Message {
  id: string;
  sender: 'student' | 'teacher' | 'admin';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface Chat {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
  messages: Message[];
}

const initialTeacherChats: Chat[] = [
  {
    id: 'tch_chat_1',
    name: 'Zaid Ahmad',
    role: 'Student (Hafs Intermediate)',
    avatar: '🎓',
    lastMessage: 'Sheikh, I practiced the rule of Noon Sakinah. Ready for class!',
    time: '3m ago',
    unreadCount: 1,
    online: true,
    messages: [
      { id: '1', sender: 'teacher', text: 'Assalamu Alaikum Zaid. Please practice Surah Al-Fatihah verse 5 for next class.', timestamp: 'Yesterday', status: 'read' },
      { id: '2', sender: 'student', text: 'Walaikum Assalam Sheikh, yes I am doing that daily.', timestamp: 'Yesterday', status: 'read' },
      { id: '3', sender: 'student', text: 'Sheikh, I practiced the rule of Noon Sakinah. Ready for class!', timestamp: '12:45 PM', status: 'delivered' }
    ]
  },
  {
    id: 'tch_chat_2',
    name: 'Admin Desk (Support)',
    role: 'Academy Administration',
    avatar: '🏛️',
    lastMessage: 'Salary and payout released for May sessions. Check financial ledger.',
    time: '1d ago',
    unreadCount: 0,
    online: false,
    messages: [
      { id: '1', sender: 'admin', text: 'Hello Sheikh Ibrahim, we approved student Zaid Ahmad\'s application.', timestamp: 'Yesterday', status: 'read' },
      { id: '2', sender: 'teacher', text: 'JazakAllahu Khairan. I see him on my roster.', timestamp: 'Yesterday', status: 'read' },
      { id: '3', sender: 'admin', text: 'Salary and payout released for May sessions. Check financial ledger.', timestamp: 'Yesterday', status: 'read' }
    ]
  }
];

export default function TeacherMessagesPage() {
  const [chats, setChats] = useState<Chat[]>(initialTeacherChats);
  const [activeChatId, setActiveChatId] = useState<string>('tch_chat_1');
  const [inputText, setInputText] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'teacher',
      text: inputText,
      timestamp: timeString,
      status: 'sent'
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          lastMessage: inputText,
          time: 'Just now',
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setInputText('');

    setTimeout(() => {
      simulateReply(activeChatId);
    }, 2500);
  };

  const simulateReply = (chatId: string) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let replyText = "JazakAllahu Khairan Sheikh! I will join the classroom stream now.";

    if (chatId === 'tch_chat_2') {
      replyText = "Operations verified. Payout completed.";
    }

    const replyMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: chatId === 'tch_chat_1' ? 'student' : 'admin',
      text: replyText,
      timestamp: timeString,
      status: 'read'
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          lastMessage: replyText,
          time: 'Just now',
          messages: [...chat.messages, replyMessage]
        };
      }
      return chat;
    }));
  };

  const selectChat = (id: string) => {
    setActiveChatId(id);
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === id) {
        return { ...chat, unreadCount: 0 };
      }
      return chat;
    }));
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="TEACHER" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={{ name: "Sheikh Ibrahim", role: "TEACHER" } as any} />

        <div className="flex-1 flex overflow-hidden p-6 md:p-8 gap-8">
          {/* Chat List Sidebar */}
          <div className="w-80 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden shrink-0">
            <div className="p-6 border-b border-slate-50 space-y-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Inbox className="w-5 h-5 text-primary" /> Teacher Inbox
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full bg-slate-50 border border-slate-100 pl-10 pr-4 py-3 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {chats.map(chat => {
                const isActive = chat.id === activeChatId;
                return (
                  <button
                    key={chat.id}
                    onClick={() => selectChat(chat.id)}
                    className={`w-full flex items-start gap-4 p-4 rounded-[2rem] text-left transition-all ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg shadow-primary/10' 
                        : 'hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <div className="relative shrink-0 text-3xl">
                      {chat.avatar}
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-black text-sm block truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>{chat.name}</span>
                        <span className="text-[10px] font-bold opacity-50 shrink-0">{chat.time}</span>
                      </div>
                      <span className={`text-[10px] font-bold block opacity-70 mb-1 ${isActive ? 'text-emerald-100' : 'text-primary'}`}>{chat.role}</span>
                      <p className={`text-xs truncate font-medium ${isActive ? 'text-emerald-50/70' : 'text-slate-400'}`}>
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">
                        {chat.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Panel */}
          <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between shrink-0 bg-slate-50/20">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{activeChat.avatar}</span>
                <div>
                  <h4 className="font-black text-slate-900 text-base">{activeChat.name}</h4>
                  <p className="text-xs text-primary font-bold">{activeChat.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100/30">
                <Sparkles className="w-3.5 h-3.5" /> Active Chat
              </div>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/20">
              <AnimatePresence initial={false}>
                {activeChat.messages.map(msg => {
                  const isTeacher = msg.sender === 'teacher';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`flex ${isTeacher ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-4 rounded-3xl text-sm font-medium relative shadow-sm ${
                        isTeacher 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                      }`}>
                        <p className="leading-relaxed">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1.5 mt-2 opacity-50 text-[10px] font-bold">
                          <span>{msg.timestamp}</span>
                          {isTeacher && (
                            msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-emerald-300" /> : <Check className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={chatEndRef} />
              </AnimatePresence>
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-50 shrink-0 bg-slate-50/20">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Send reply to ${activeChat.name.split(' ')[0]}...`}
                  className="w-full bg-white border border-slate-100 pl-6 pr-16 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 shadow-inner font-medium text-slate-800"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
