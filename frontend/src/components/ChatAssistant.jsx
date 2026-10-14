import React, { useState } from "react";
import { MessageSquare, Send, X, Loader2 } from "lucide-react";
import { sendChat } from "../services/api";

export default function ChatAssistant({ destination, currentTripContext }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey! Ask me any questions about local transport, safety, or foods in ₹ INR." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await sendChat({ message: userMsg, destination, context: currentTripContext });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I couldn't reach the server right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button onClick={() => setOpen(true)} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold">
          <MessageSquare className="w-5 h-5" /> Chat with Buddy
        </button>
      )}

      {open && (
        <div className="w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3 flex flex-col h-[450px]">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-sm">TripBuddy Live Assistant</span>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 p-1 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`p-3 rounded-2xl max-w-[85%] ${m.sender === "user" ? "ml-auto bg-emerald-500 text-slate-950 font-medium" : "bg-slate-800 text-slate-200"}`}>
                {m.text}
              </div>
            ))}
            {loading && <Loader2 className="w-4 h-4 animate-spin text-emerald-400 mx-auto" />}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-800 pt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about budget, local cabs..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
            <button type="submit" className="bg-emerald-500 text-slate-950 p-2 rounded-xl"><Send className="w-4 h-4" /></button>
          </form>
        </div>
      )}
    </div>
  );
}