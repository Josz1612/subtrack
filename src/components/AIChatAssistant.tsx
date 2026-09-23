import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Subscription, Currency } from '../types';
import { processNLPChat } from '../utils/nlpEngine';
import { CapacitorCalendar } from '@capgo/capacitor-calendar';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

interface AIChatAssistantProps {
  globalCurrency: Currency;
  onSaveSubscription: (subData: Omit<Subscription, 'id'>) => void;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ globalCurrency, onSaveSubscription }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      sender: 'bot',
      text: "¡Hola! Dime qué suscripción quieres agregar hoy. (Ej. 'Agrega Spotify por 129 pesos').",
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: `msg-${Date.now()}`, sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    
    // Process input
    const result = processNLPChat(input.trim(), globalCurrency);
    
    // Simulate slight delay for AI processing
    setTimeout(() => {
      const botMessage: Message = { id: `msg-${Date.now()+1}`, sender: 'bot', text: result.message };
      setMessages(prev => [...prev, botMessage]);
      
      if (result.success && result.subscriptionData) {
        onSaveSubscription(result.subscriptionData);
        
        // Sync with calendar
        (async () => {
          try {
            const nextDateStr = result.subscriptionData!.nextPaymentDate;
            const newStartDate = new Date(nextDateStr + 'T12:00:00').getTime();
            const newEndDate = newStartDate + 3600000;
            const reminderMins = result.subscriptionData!.reminderDays ? result.subscriptionData!.reminderDays * 24 * 60 : 0;
            
            await CapacitorCalendar.createEvent({
              title: 'Pago de ' + result.subscriptionData!.name,
              startDate: newStartDate,
              endDate: newEndDate,
              alerts: reminderMins ? [reminderMins] : [],
            });
          } catch (e) {
            console.log('Error creating calendar event from AI', e);
          }
        })();
      }
    }, 600);

    setInput('');
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-full flex items-center justify-center shadow-blue-glow transition-all active:scale-95 z-40 touch-manipulation border border-blue-400/30"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gray-900 rounded-2xl w-full max-w-md shadow-subtrack-lg border border-[#1e293b] flex flex-col h-[70vh] sm:h-[600px] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-[#1e293b] flex justify-between items-center bg-gray-900 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-[#60a5fa] flex items-center justify-center border border-[#3b82f6]/40">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#f1f5f9] text-base">Analista de IA</h3>
                    <p className="text-[#64748b] text-[11px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                      Procesamiento Local Seguro
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-[#94a3b8] hover:bg-[#1e293b] hover:text-[#f1f5f9] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-full`}
                  >
                    <div
                      className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm ${
                        msg.sender === 'user'
                          ? 'bg-[#3b82f6] text-white rounded-br-sm shadow-blue-glow'
                          : 'bg-[#1e293b] text-[#f1f5f9] rounded-bl-sm border border-[#334155]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-[#1e293b] bg-gray-900 shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Escribe tu suscripción..."
                    className="flex-1 bg-[#131d35] border border-[#1e293b] rounded-xl py-3 px-4 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#3b82f6] transition-colors"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="p-3 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-blue-glow flex items-center justify-center shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
