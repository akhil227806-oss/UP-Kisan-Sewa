"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle, CheckCircle, Clock, Send, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

interface QuestionItem {
  id: string;
  question_id?: string;
  subject?: string;
  question?: string;
  question_text?: string;
  crop?: string;
  crop_name?: string;
  category?: string;
  district?: string;
  status: "pending" | "answered" | "closed";
  created_at?: string;
  farmer_name?: string;
  farmer_phone?: string;
  farmer_email?: string;
  answer?: string;
  answer_text?: string;
  answered_by?: string;
  answered_at?: string;
}

export default function AdminQuestionsPage() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "answered" | "all">("pending");
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerDraft, setAnswerDraft] = useState("");
  const [scientistName, setScientistName] = useState("डॉ. नीरज कुमार सिंह (NDUAT)");
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/questions");
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.items || [];
        setQuestions(items);
      }
    } catch (e) {
      // Fallback: load from localStorage if local submissions exist
      const local = localStorage.getItem("my_farmer_questions");
      if (local) {
        try {
          setQuestions(JSON.parse(local));
        } catch (err) {}
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSendAnswer = async (qId: string) => {
    if (!answerDraft.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/questions/${qId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: answerDraft.trim(),
          answered_by: scientistName.trim() || "डॉ. नीरज कुमार सिंह, सह-प्राध्यापक (MCAET, NDUAT)",
        }),
      });

      if (res.ok) {
        setToastMsg(lang === "hi" ? "उत्तर सफलतापूर्वक प्रेषित किया गया!" : "Scientist advisory submitted successfully!");
        setAnsweringId(null);
        setAnswerDraft("");
        fetchQuestions();
      } else {
        // Fallback update local state
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === qId || q.question_id === qId
              ? {
                  ...q,
                  status: "answered",
                  answer: answerDraft.trim(),
                  answer_text: answerDraft.trim(),
                  answered_by: scientistName,
                  answered_at: new Date().toISOString(),
                }
              : q
          )
        );
        setToastMsg(lang === "hi" ? "उत्तर दर्ज किया गया।" : "Response recorded locally.");
        setAnsweringId(null);
        setAnswerDraft("");
      }
    } catch (e) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === qId || q.question_id === qId
            ? {
                ...q,
                status: "answered",
                answer: answerDraft.trim(),
                answer_text: answerDraft.trim(),
                answered_by: scientistName,
                answered_at: new Date().toISOString(),
              }
            : q
        )
      );
      setToastMsg(lang === "hi" ? "उत्तर दर्ज किया गया।" : "Response recorded locally.");
      setAnsweringId(null);
      setAnswerDraft("");
    } finally {
      setSubmitting(false);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const filtered = questions.filter((q) => {
    if (activeTab === "pending") return q.status === "pending";
    if (activeTab === "answered") return q.status === "answered";
    return true;
  });

  const pendingCount = questions.filter((q) => q.status === "pending").length;
  const answeredCount = questions.filter((q) => q.status === "answered").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[
          { label: lang === "hi" ? "एडमिन" : "Admin", href: "/admin" },
          { label: lang === "hi" ? "परामर्श निगरानी" : "Consultation Monitor" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 my-6">
        <div>
          <h1 className="text-2xl font-black text-[#14532d]">
            {lang === "hi" ? "कृषि विशेषज्ञ परामर्श निगरानी कक्ष" : "Scientist Consultation Desk"}
          </h1>
          <p className="text-xs text-[#6b7280]">
            {lang === "hi"
              ? "किसानों द्वारा पूछे गए प्रश्नों की स्थिति, वैज्ञानिक उत्तर एवं समीक्षा (NDUAT अधिकृत)"
              : "Review farmer inquiries, provide scientific agronomic advisories, and track status"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchQuestions}>
          <RefreshCw className="size-3.5 mr-1.5" />
          <span>{lang === "hi" ? "रिफ्रेश करें" : "Refresh"}</span>
        </Button>
      </div>

      {toastMsg && (
        <div className="p-3 bg-[#dcfce7] border border-[#86efac] text-[#14532d] text-sm font-bold rounded-lg mb-4 flex items-center gap-2">
          <CheckCircle className="size-4 text-[#15803d]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          onClick={() => setActiveTab("pending")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === "pending"
              ? "bg-[#fefce8] border-[#fde047] shadow-sm"
              : "bg-white border-[#e5e7eb] hover:bg-[#f8faf5]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#854d0e] uppercase tracking-wider">
              {lang === "hi" ? "लंबित प्रश्न" : "Pending Review"}
            </span>
            <Clock className="size-5 text-[#ca8a04]" />
          </div>
          <div className="text-2xl font-black text-[#854d0e] mt-1">{pendingCount}</div>
        </div>

        <div
          onClick={() => setActiveTab("answered")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === "answered"
              ? "bg-[#f0fdf4] border-[#86efac] shadow-sm"
              : "bg-white border-[#e5e7eb] hover:bg-[#f8faf5]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#14532d] uppercase tracking-wider">
              {lang === "hi" ? "समाधान प्रेषित" : "Answered"}
            </span>
            <CheckCircle className="size-5 text-[#15803d]" />
          </div>
          <div className="text-2xl font-black text-[#15803d] mt-1">{answeredCount}</div>
        </div>

        <div
          onClick={() => setActiveTab("all")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === "all"
              ? "bg-[#eff6ff] border-[#93c5fd] shadow-sm"
              : "bg-white border-[#e5e7eb] hover:bg-[#f8faf5]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1e40af] uppercase tracking-wider">
              {lang === "hi" ? "कुल परामर्श" : "Total Inquiries"}
            </span>
            <MessageSquare className="size-5 text-[#2563eb]" />
          </div>
          <div className="text-2xl font-black text-[#1e40af] mt-1">{questions.length}</div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-sm text-[#6b7280]">
            {lang === "hi" ? "परामर्श सूची लोड हो रही है..." : "Loading consultations..."}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 bg-white rounded-xl border border-[#e5e7eb] text-center text-[#6b7280] text-sm">
            {activeTab === "pending"
              ? lang === "hi"
                ? "वर्तमान में कोई लंबित प्रश्न नहीं है। सभी किसानों को समाधान उपलब्ध कराया गया है।"
                : "No pending inquiries. All farmer queries have been addressed."
              : lang === "hi"
              ? "कोई प्रश्न नहीं मिला।"
              : "No inquiries found."}
          </div>
        ) : (
          filtered.map((q) => {
            const qRef = q.question_id || q.id;
            const isAnswering = answeringId === qRef;

            return (
              <div
                key={qRef}
                className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-[#f3f4f6] px-2 py-0.5 rounded text-[#374151]">
                      {qRef}
                    </span>
                    {q.district && (
                      <span className="text-xs font-semibold text-[#15803d] bg-[#dcfce7] px-2 py-0.5 rounded">
                        {q.district}
                      </span>
                    )}
                    {(q.crop || q.crop_name) && (
                      <span className="text-xs font-semibold text-[#4b5563] bg-[#f8faf5] border border-[#e5e7eb] px-2 py-0.5 rounded">
                        {q.crop || q.crop_name}
                      </span>
                    )}
                    {q.category && (
                      <span className="text-xs font-medium text-[#6b7280] bg-[#f3f4f6] px-2 py-0.5 rounded">
                        {q.category}
                      </span>
                    )}
                  </div>
                  <div>
                    {q.status === "answered" ? (
                      <Badge variant="success">
                        {lang === "hi" ? "समाधान प्रेषित" : "Answered"}
                      </Badge>
                    ) : (
                      <Badge variant="warning">
                        {lang === "hi" ? "समीक्षाधीन" : "Pending Review"}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#14532d]">
                    {q.subject || `${q.crop || "कृषि"} : ${q.category || "परामर्श प्रश्न"}`}
                  </h3>
                  <p className="text-sm text-[#374151] mt-1 whitespace-pre-wrap">
                    {q.question || q.question_text}
                  </p>
                </div>

                {q.farmer_name && (
                  <div className="text-xs text-[#6b7280]">
                    {lang === "hi" ? "किसान: " : "Farmer: "}
                    <strong className="text-[#1f2937]">{q.farmer_name}</strong>
                    {q.farmer_phone ? ` (${q.farmer_phone})` : ""}
                    {q.farmer_email ? ` • ${q.farmer_email}` : ""}
                  </div>
                )}

                {/* Show existing scientist answer */}
                {(q.answer || q.answer_text) && (
                  <div className="p-3.5 bg-[#f0fdf4] border-l-4 border-[#15803d] rounded-r-lg text-xs sm:text-sm">
                    <div className="flex items-center justify-between font-bold text-[#14532d] mb-1">
                      <span>{lang === "hi" ? "NDUAT वैज्ञानिक उत्तर:" : "NDUAT Scientist Advisory:"}</span>
                      <span className="text-[11px] font-normal text-[#6b7280]">{q.answered_by}</span>
                    </div>
                    <p className="text-[#1f2937] whitespace-pre-wrap">{q.answer || q.answer_text}</p>
                  </div>
                )}

                {/* Answer form */}
                {isAnswering ? (
                  <div className="pt-3 border-t border-[#f3f4f6] space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-[#14532d] mb-1">
                          {lang === "hi" ? "वैज्ञानिक का नाम / पद" : "Scientist Name / Designation"}
                        </label>
                        <input
                          type="text"
                          value={scientistName}
                          onChange={(e) => setScientistName(e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-lg text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#14532d] mb-1">
                        {lang === "hi" ? "वैज्ञानिक समाधान व उपचार निर्देश दर्ज करें *" : "Enter Scientific Advisory & Treatment *"}
                      </label>
                      <textarea
                        rows={3}
                        value={answerDraft}
                        onChange={(e) => setAnswerDraft(e.target.value)}
                        placeholder={
                          lang === "hi"
                            ? "फसल रोग, कीट प्रबंधन, अथवा सिंचाई/उर्वरक की सही वैज्ञानिक मात्रा लिखें..."
                            : "Write scientific dosage, chemicals/organic controls, and preventive steps..."
                        }
                        className="w-full px-3 py-2 border rounded-lg text-xs sm:text-sm focus:border-[#15803d] outline-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setAnsweringId(null)}>
                        {lang === "hi" ? "रद्द करें" : "Cancel"}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={submitting || !answerDraft.trim()}
                        onClick={() => handleSendAnswer(qRef)}
                      >
                        <Send className="size-3.5 mr-1" />
                        <span>{submitting ? (lang === "hi" ? "भेज रहे हैं..." : "Sending...") : (lang === "hi" ? "उत्तर भेजें" : "Submit Advisory")}</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAnsweringId(qRef);
                        setAnswerDraft(q.answer_text || "");
                      }}
                    >
                      <Send className="size-3.5 mr-1 text-[#15803d]" />
                      <span>{q.answer_text ? (lang === "hi" ? "उत्तर संपादित करें" : "Edit Answer") : (lang === "hi" ? "वैज्ञानिक उत्तर दें" : "Provide Advisory")}</span>
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
