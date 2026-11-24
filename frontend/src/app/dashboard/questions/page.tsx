"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HelpCircle, MessageSquare, ArrowLeft, CheckCircle2, Clock, PlusCircle, RefreshCw } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

interface QuestionItem {
  id: string;
  crop: string;
  category?: string;
  district?: string;
  date?: string;
  created_at?: string;
  question: string;
  status: string;
  answer?: string | null;
  answered_by?: string | null;
  answered_at?: string | null;
}

const DEFAULT_QUESTIONS: QuestionItem[] = [
  {
    id: "UKS-2026-894",
    crop: "गेहूँ (Wheat)",
    category: "रोग व फफूंद",
    date: "18 मार्च 2026",
    question: "गेहूँ की पत्तियों पर पीली धारियां दिखाई दे रही हैं तथा छूने पर हाथ पीला हो जाता है। कौन सी दवा डालें?",
    status: "answered",
    answer: "यह 'पीला रतुआ' (Yellow Rust) रोग के लक्षण हैं। तुरंत प्रोपिकोनाजोल 25% EC (टिल्ट) दवा 1 मिली प्रति लीटर पानी की दर से (200 मिली प्रति 200 लीटर पानी प्रति एकड़) दोपहर बाद धूप में छिड़काव करें। 15 दिन बाद आवश्यकता पड़ने पर दोहराएं।",
    answered_by: "डॉ. नीरज कुमार सिंह, सह-प्राध्यापक (MCAET, NDUAT)",
    answered_at: "19 मार्च 2026",
  },
  {
    id: "UKS-2026-912",
    crop: "सरसों (Mustard)",
    category: "कीट व इल्ली",
    date: "19 मार्च 2026",
    question: "सरसों की फलियों और फूलों पर काले रंग के छोटे माहू (माहो) कीट लग गए हैं, रस चूस रहे हैं। क्या करें?",
    status: "answered",
    answer: "माहू (Aphid) नियंत्रण हेतु इमिडाक्लोप्रिड 17.8 SL दवा 1 मिलीलीटर को 3 लीटर पानी में घोलकर छिड़कें या डाइमेथोएट 30 EC 1.5 मिली/लीटर पानी में स्प्रे करें।",
    answered_by: "कीट विज्ञान विशेषज्ञ, KVK प्रसार संभाग, NDUAT",
    answered_at: "20 मार्च 2026",
  },
];

export default function MyQuestionsDashboard() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionItem[]>(DEFAULT_QUESTIONS);
  const [loading, setLoading] = useState(false);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const emailQuery = user?.email ? `?email=${encodeURIComponent(user.email)}` : "";
      const res = await fetch(`/api/v1/questions${emailQuery}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Merge with any local storage submissions
          const localList: QuestionItem[] = JSON.parse(
            localStorage.getItem("my_farmer_questions") || "[]"
          );
          const combined = [...localList];
          for (const item of data) {
            if (!combined.some((c) => c.id === item.id)) {
              combined.push(item);
            }
          }
          setQuestions(combined);
          return;
        }
      }
    } catch {
      // fallback to localStorage
    } finally {
      setLoading(false);
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("my_farmer_questions");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuestions([...parsed, ...DEFAULT_QUESTIONS]);
          }
        } catch {}
      }
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: lang === "hi" ? "डैशबोर्ड" : "Dashboard", href: "/dashboard" },
          { label: lang === "hi" ? "मेरे परामर्श प्रश्न" : "My Consultations" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#14532d]">
            {lang === "hi" ? "विशेषज्ञ परामर्श स्थिति एवं उत्तर" : "Expert Consultations & Answers"}
          </h1>
          <p className="text-xs text-[#6b7280]">
            {lang === "hi"
              ? "NDUAT कृषि वैज्ञानिकों द्वारा आपके प्रश्नों पर दी गई प्रामाणिक संस्तुतियाँ"
              : "Track your submitted questions and view official scientific recommendations"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadQuestions} disabled={loading}>
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{lang === "hi" ? "रिफ्रेश" : "Refresh"}</span>
          </Button>
          <Link href="/ask-expert">
            <Button variant="primary" size="sm">
              <PlusCircle className="size-4" />
              <span>{lang === "hi" ? "नया प्रश्न पूछें" : "Ask New Question"}</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white border border-[#e5e7eb] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#f3f4f6] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#15803d] bg-[#dcfce7] px-2 py-0.5 rounded">
                    #{q.id}
                  </span>
                  <span className="font-bold text-[#14532d] text-sm">{q.crop}</span>
                </div>
                <span className="text-[11px] text-[#6b7280] block mt-0.5">
                  {q.date || q.created_at?.slice(0, 10)} {q.category ? `• ${q.category}` : ""}
                </span>
              </div>

              <div>
                {q.status === "answered" ? (
                  <Badge variant="success" size="sm" className="flex items-center gap-1 font-bold">
                    <CheckCircle2 className="size-3" />
                    <span>{lang === "hi" ? "समाधान उपलब्ध" : "Answered"}</span>
                  </Badge>
                ) : (
                  <Badge variant="warning" size="sm" className="flex items-center gap-1 font-bold">
                    <Clock className="size-3" />
                    <span>{lang === "hi" ? "समीक्षाधीन" : "Pending Review"}</span>
                  </Badge>
                )}
              </div>
            </div>

            {/* Farmer Question */}
            <div>
              <span className="text-xs font-bold text-[#14532d] block mb-1">
                {lang === "hi" ? "आपका प्रश्न:" : "Your Question:"}
              </span>
              <p className="text-xs sm:text-sm text-[#374151] leading-relaxed bg-[#f8faf5] p-3.5 rounded-xl border border-[#e5e7eb]">
                {q.question}
              </p>
            </div>

            {/* Official Answer */}
            {q.status === "answered" && q.answer ? (
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#14532d] flex items-center gap-1">
                    <CheckCircle2 className="size-4 text-[#15803d]" />
                    <span>{lang === "hi" ? "वैज्ञानिक उत्तर एवं संस्तुति:" : "Scientific Recommendation:"}</span>
                  </span>
                  {q.answered_by && (
                    <span className="text-[11px] font-semibold text-[#15803d]">
                      {q.answered_by}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#1f2937] leading-relaxed">
                  {q.answer}
                </p>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <Clock className="size-4 shrink-0 text-amber-600" />
                <span>
                  {lang === "hi"
                    ? "आपका प्रश्न NDUAT वैज्ञानिक दल को आवंटित है। 24-48 घंटे में समाधान यहाँ प्रेषित किया जाएगा।"
                    : "Assigned to NDUAT agronomist. Expected response within 24-48 hours."}
                </span>
              </div>
            )}
          </div>
        ))}

        {questions.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#e5e7eb] p-12 text-center text-xs text-[#6b7280]">
            {lang === "hi"
              ? "आपने अभी तक कोई प्रश्न नहीं पूछा है।"
              : "You have not submitted any questions yet."}
          </div>
        )}
      </div>
    </div>
  );
}
