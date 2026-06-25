import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Brain, Loader2 } from 'lucide-react';
import { aiService } from '@services/aiService';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const CHAT_UPDATE_EVENT = 'chat_update';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem('chatHistory');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [{
      id: 'welcome-msg',
      sender: 'ai',
      text: 'Bonjour ! Je suis votre assistant IA. Je peux analyser les stocks, les dépenses et faire des prévisions. Comment puis-je vous aider ?'
    }];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(() => sessionStorage.getItem('isChatLoading') === 'true');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Écouter les mises à jour en arrière-plan (si on a navigué et que l'ancien composant a reçu la réponse)
  useEffect(() => {
    const handleUpdate = () => {
      const saved = sessionStorage.getItem('chatHistory');
      if (saved) {
        try { setMessages(JSON.parse(saved)); } catch (e) {}
      }
      setIsLoading(sessionStorage.getItem('isChatLoading') === 'true');
    };
    window.addEventListener(CHAT_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(CHAT_UPDATE_EVENT, handleUpdate);
  }, []);

  // Sync state to session storage when it changes in THIS component
  useEffect(() => {
    sessionStorage.setItem('chatHistory', JSON.stringify(messages));
    sessionStorage.setItem('isChatLoading', isLoading ? 'true' : 'false');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input.trim() };
    
    // Update local and session state
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    sessionStorage.setItem('chatHistory', JSON.stringify(newMessages));
    
    setInput('');
    setIsLoading(true);
    sessionStorage.setItem('isChatLoading', 'true');
    window.dispatchEvent(new Event(CHAT_UPDATE_EVENT));

    try {
      const response = await aiService.chat(userMsg.text);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: response.data.reply };
      
      const latestStr = sessionStorage.getItem('chatHistory');
      let latestHistory = latestStr ? JSON.parse(latestStr) : newMessages;
      latestHistory.push(aiMsg);
      
      sessionStorage.setItem('chatHistory', JSON.stringify(latestHistory));
      sessionStorage.setItem('isChatLoading', 'false');
      window.dispatchEvent(new Event(CHAT_UPDATE_EVENT)); // Notifie le composant actuellement monté
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: "❌ Désolé, une erreur est survenue." };
      
      const latestStr = sessionStorage.getItem('chatHistory');
      let latestHistory = latestStr ? JSON.parse(latestStr) : newMessages;
      latestHistory.push(errorMsg);
      
      sessionStorage.setItem('chatHistory', JSON.stringify(latestHistory));
      sessionStorage.setItem('isChatLoading', 'false');
      window.dispatchEvent(new Event(CHAT_UPDATE_EVENT));
    }
  };

  const parseMarkdown = (text: string) => {
    // Parse markdown and sanitize it
    const rawMarkup = marked(text, { breaks: true, gfm: true }) as string;
    return { __html: DOMPurify.sanitize(rawMarkup) };
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-xl hover:bg-primary-600 transition-all duration-300 z-50 flex items-center justify-center animate-bounce-slow"
          style={{ boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.5)' }}
        >
          <Brain size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-200 z-50 flex flex-col overflow-hidden transition-all duration-300" style={{ height: '500px', maxHeight: '80vh' }}>
          
          {/* Header */}
          <div className="bg-primary p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Brain size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Assistant IA (Gemini)</h3>
                <p className="text-[10px] text-primary-100">Analyse de base de données</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-neutral-200 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-neutral-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white border border-neutral-100 text-neutral-800 rounded-tl-none prose prose-sm prose-p:leading-relaxed prose-li:my-0'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p>{msg.text}</p>
                  ) : (
                    <div dangerouslySetInnerHTML={parseMarkdown(msg.text)} />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-neutral-500 shadow-sm">
                  <Loader2 className="animate-spin" size={16} />
                  <span className="text-xs font-medium">Réflexion en cours...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-neutral-100 flex items-end gap-2 shrink-0">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Posez une question sur les stocks..."
              className="flex-1 max-h-32 min-h-[44px] p-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-primary text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:hover:bg-primary transition-colors flex items-center justify-center shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
