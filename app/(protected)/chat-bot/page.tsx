"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Sparkles, BotMessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "bot",
      content:
        "Hi! I'm your AI fitness coach. Ask me anything about workouts, nutrition, recovery, or fitness goals.",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: data.reply || "I couldn't generate a response.",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: "Something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    /* 🔒 PAGE SCROLL LOCKED */
    <div className="relative h-screen flex flex-col overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="px-4 pt-4 pb-2 flex-none">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BotMessageSquare className="w-8 h-8 text-primary" />
          AI Coach
        </h1>
        <p className="text-muted-foreground">
          Your intelligent fitness companion.
        </p>
      </div>

      {/* ================= CHAT AREA (ONLY SCROLLABLE AREA) ================= */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Card className="h-full flex flex-col">
          <CardHeader className="border-b border-white/5 py-3 flex-none">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </CardHeader>

          <CardContent className="flex-1 min-h-0 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4 pb-36">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 flex gap-3
                        ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted/50 border border-white/5 rounded-tl-none"
                        }`}
                    >
                      {message.role === "user" ? (
                        <User size={16} />
                      ) : (
                        <Sparkles size={16} />
                      )}

                      <div>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        <p className="text-[10px] opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 bg-muted/50 rounded-2xl border border-white/5 flex gap-1">
                      <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                )}

                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* ================= FIXED INPUT ================= */}
      <div className="fixed sm:w-max-[1150px] sm:mx-20 sm:bottom-5  sm:left-[250] bottom-16 left-0 right-0 z-50 backdrop-blur border-t border-white/10 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about workouts, nutrition, recovery..."
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
