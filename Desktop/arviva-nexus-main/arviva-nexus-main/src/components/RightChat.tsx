import { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface ChatMsg { id: number; from: 'user' | 'architect'; text: string; }

const RightChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 1, from: 'architect', text: 'Arkitekten online. 200 agenter aktiva. Alla squads operativa.' },
  ]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: 'architect',
        text: 'Analyserar... Scout-agenterna rapporterar 12 nya trender i Thailand-marknaden.',
      }]);
    }, 1200);
  };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-[60] w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          aria-label="Open chat">
          <MessageCircle className="w-5 h-5" />
        </button>
      )}

      {open && (
        <aside className="fixed top-10 right-0 bottom-0 w-80 z-[60] bg-card/90 backdrop-blur-xl border-l border-border flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs font-bold text-primary font-mono">Arkitekten</p>
                <p className="text-[9px] text-success flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  200 agenter online
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                  msg.from === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground border border-border/50'
                }`}>{msg.text}</div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Fråga Arkitekten..."
                className="flex-1 bg-secondary border border-border/50 rounded-lg px-3 py-1.5 text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
              <button onClick={send} className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary text-primary-foreground" aria-label="Send">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

export default RightChat;
