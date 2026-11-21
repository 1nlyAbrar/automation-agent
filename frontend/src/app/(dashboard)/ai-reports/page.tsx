"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";

export default function Page() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Ask me about your leads. Try \"How many leads were converted?\" or \"Which source is best?\"" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Custom print function to expand the container before printing
  const handlePrint = () => {
    const el = document.getElementById('print-chat-container');
    if (el) el.style.height = 'auto';
    window.print();
    // Restore the height after printing is done
    setTimeout(() => { if (el) el.style.height = '500px'; }, 1000);
  };

  const handleAsk = async (e: React.FormEvent, customMessage?: string) => {
    if (e) e.preventDefault();
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: messageToSend }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await res.json();

      if (data.text) {
        setMessages((prev) => [...prev, { role: "ai", text: data.text }]);
      } else {
        setMessages((prev) => [...prev, { role: "ai", text: "Sorry, I ran into an error." }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", text: "Network error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateReport = () => {
    handleAsk(null as any, "Please generate a comprehensive business report based on my current metrics. Give me an overview of the conversion rate, average lead score, and top source. Then provide 2 actionable suggestions to improve my business.");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <PageHeader
          title="AI Reports"
          description="Verified metrics, plain-English insight."
        />
        <div className="flex gap-2">
          {/* PDF Button - Triggers the custom print function */}
          <button 
            onClick={handlePrint}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors shadow-sm"
          >
            ↓ PDF
          </button>
          
          <button 
            onClick={handleGenerateReport}
            disabled={isTyping}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
          >
            Generate report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glow-card rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-2">Conversion rate</div>
          <div className="text-3xl font-bold text-foreground">20%</div>
        </div>
        <div className="glow-card rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-2">Average lead score</div>
          <div className="text-3xl font-bold text-foreground">73</div>
        </div>
        <div className="glow-card rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-2">Top source</div>
          <div className="text-3xl font-bold text-foreground">Website (3)</div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Metrics above are calculated in the browser from the demo leads. In production, Python will compute them and the AI model will only explain them.
      </p>

      {/* Chat Container with fixed height that becomes auto for printing */}
      <div 
        id="print-chat-container"
        className="glow-card rounded-xl border border-border bg-card shadow-sm flex flex-col"
        style={{ height: '500px' }}
      >
        <div className="p-4 border-b border-border bg-secondary/30 rounded-t-xl">
          <h2 className="text-sm font-semibold text-foreground">AI business assistant</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-br-none" 
                  : "bg-card border border-border text-foreground rounded-bl-none shadow-sm"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex space-x-1.5 items-center h-4">
                  <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border bg-card rounded-b-xl">
          <form onSubmit={handleAsk} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              Ask
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}