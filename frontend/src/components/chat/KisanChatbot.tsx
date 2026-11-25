"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Mic,
  MicOff,
  Minimize2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  actions?: { label: string; href: string }[];
  timestamp: string;
}

export function KisanChatbot() {
  const { lang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = lang === "hi"
    ? [
        "गेहूं में पीला रतुआ कैसे रोकें?",
        "PM-Kisan 19वीं किस्त कब आएगी?",
        "आज का मंडी भाव क्या है?",
        "धान में खरपतवार नियंत्रण की विधि",
        "खेत की मिट्टी जांच कैसे कराएं?",
        "सोलर पम्प पर कितनी सब्सिडी मिलती है?",
      ]
    : [
        "How to control Yellow Rust in wheat?",
        "When will PM-Kisan next installment come?",
        "What are today's mandi prices?",
        "Weed management in direct seeded rice",
        "How to test farm soil?",
        "How much subsidy is on solar pumps?",
      ];

  // Initialize with welcome message
  useEffect(() => {
    const saved = localStorage.getItem("uks_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        initDefaultMessage();
      }
    } else {
      initDefaultMessage();
    }
  }, [lang]);

  const initDefaultMessage = () => {
    const welcome: ChatMessage = {
      id: "msg-init",
      sender: "bot",
      text:
        lang === "hi"
          ? "राम-राम किसान भाई! 🙏 मैं अवध किसान सहायक (AI Kisan Sahayak) हूँ। आप मुझसे फसल रोग, मंडी भाव, सरकारी योजनाओं, बीज किस्मों या मौसम सलाह के बारे में कुछ भी पूछ सकते हैं।"
          : "Hello Farmer Friend! 🙏 I am your Awadh Kisan AI Assistant. You can ask me anything about crop diseases, mandi prices, welfare schemes, certified seeds, or agro-weather advisories.",
      actions: [
        { label: lang === "hi" ? "मंडी भाव देखें" : "Mandi Prices", href: "/mandi" },
        { label: lang === "hi" ? "सरकारी योजनाएं" : "Govt Schemes", href: "/schemes" },
        { label: lang === "hi" ? "फसल रोग पहचान" : "Crop Diseases", href: "/diseases" },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([welcome]);
  };

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  // Persist messages in localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("uks_chat_history", JSON.stringify(messages.slice(-30)));
    }
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const msg = (textToSend || inputMessage).trim();
    if (!msg || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          lang: lang,
          session_id: localStorage.getItem("uks_chat_session") || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.session_id) {
          localStorage.setItem("uks_chat_session", data.session_id);
        }

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.reply,
          actions: data.suggested_actions,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error("Chat service unavailable");
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: "bot",
        text:
          lang === "hi"
            ? "क्षमा करें, सर्वर से संपर्क नहीं हो सका। आप 1800-180-1551 (टोल-फ्री किसान कॉल सेंटर) पर कॉल कर सकते हैं अथवा संबंधित पोर्टल मेन्यू देखें।"
            : "Sorry, I am unable to connect right now. You may call the toll-free Kisan Call Centre at 1800-180-1551 or check the portal directory.",
        actions: [
          { label: lang === "hi" ? "हेल्पलाइन नंबर" : "Helplines", href: "/helpline" },
          { label: lang === "hi" ? "विशेषज्ञ से पूछें" : "Ask Expert", href: "/ask-expert" },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const clearChat = () => {
    localStorage.removeItem("uks_chat_history");
    localStorage.removeItem("uks_chat_session");
    initDefaultMessage();
  };

  // Web Speech API Voice Dictation
  const toggleSpeechRecognition = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        lang === "hi"
          ? "आपके ब्राउज़र में वॉइस टाइपिंग उपलब्ध नहीं है।"
          : "Voice typing is not supported in this browser."
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#15803d] hover:bg-[#14532d] text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 group cursor-pointer border-2 border-white/80 ring-4 ring-emerald-500/20"
          title={lang === "hi" ? "किसान सहायक से बात करें" : "Chat with Kisan AI Assistant"}
          aria-label="Open Kisan AI Chatbot"
        >
          <div className="relative">
            <Bot className="size-6 sm:size-7" />
            <span className="absolute -top-1 -right-1 size-3 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 size-3 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
          <span className="hidden sm:inline font-bold text-xs pr-1 tracking-wide">
            {lang === "hi" ? "किसान सहायक AI" : "Kisan AI Sahayak"}
          </span>
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] max-w-[440px] h-[85vh] max-h-[620px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#14532d] text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
                <Bot className="size-5 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm leading-none">
                    {lang === "hi" ? "अवध किसान सहायक" : "Awadh Kisan AI"}
                  </h3>
                  <span className="size-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-emerald-200 font-medium mt-0.5">
                  {lang === "hi" ? "24x7 डिजिटल कृषि परामर्श" : "24x7 Digital Agro Advisory"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-100 hover:text-white transition-colors cursor-pointer"
                title={lang === "hi" ? "बातचीत रीसेट करें" : "Reset conversation"}
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-100 hover:text-white transition-colors cursor-pointer"
                title={lang === "hi" ? "बंद करें" : "Close"}
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8faf5]">
            {/* Trust Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center text-[11px] text-emerald-800 flex items-center justify-center gap-1.5 font-medium shadow-2xs">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <span>
                {lang === "hi"
                  ? "आईसीएआर (ICAR) व कृषि विश्वविद्यालय संस्तुतियों पर आधारित।"
                  : "Verified by ICAR & agricultural university packages."}
              </span>
            </div>

            {/* Message Bubbles */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-start gap-1.5 max-w-[85%]">
                  {msg.sender === "bot" && (
                    <div className="size-6 rounded-full bg-[#15803d] text-white flex items-center justify-center shrink-0 mt-1">
                      <Bot className="size-3.5" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-[#15803d] text-white rounded-br-xs font-medium"
                        : "bg-white text-gray-800 rounded-bl-xs border border-gray-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* Suggested Action Chips below Bot message */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pl-8">
                    {msg.actions.map((act, idx) => (
                      <Link
                        key={idx}
                        href={act.href}
                        onClick={() => {
                          if (act.href.startsWith("/")) {
                            setIsOpen(false);
                          }
                        }}
                        target={act.href.startsWith("http") ? "_blank" : undefined}
                        className="inline-flex items-center gap-1 text-[11px] font-bold bg-white hover:bg-emerald-50 text-[#14532d] border border-[#86efac] px-2.5 py-1 rounded-full shadow-2xs transition-colors"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="size-3 text-[#15803d]" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Loader Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <div className="size-6 rounded-full bg-[#15803d] text-white flex items-center justify-center shrink-0">
                  <Bot className="size-3.5" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-3.5 py-2 flex items-center gap-1.5 shadow-xs">
                  <span className="size-1.5 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="size-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="size-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-gray-400 pl-1">
                    {lang === "hi" ? "सोच रहे हैं..." : "Thinking..."}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Strip (Horizontally Scrollable) */}
          <div className="p-2 bg-white border-t border-gray-100 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="whitespace-nowrap text-[11px] font-medium bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#14532d] border border-[#bbf7d0] px-2.5 py-1 rounded-full transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box and Actions */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                lang === "hi"
                  ? "फसल, कीट या मंडी से जुड़ा प्रश्न लिखें..."
                  : "Type your agricultural question here..."
              }
              className="flex-1 px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d]"
            />

            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isListening
                  ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-300"
              }`}
              title={
                isListening
                  ? (lang === "hi" ? "सुन रहे हैं... बोलें" : "Listening...")
                  : (lang === "hi" ? "बोलकर लिखें (Voice)" : "Voice input")
              }
            >
              {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="bg-[#15803d] hover:bg-[#14532d] disabled:bg-gray-300 text-white p-2 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
              title={lang === "hi" ? "संदेश भेजें" : "Send Message"}
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
