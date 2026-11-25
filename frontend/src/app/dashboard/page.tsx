"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Sprout,
  HelpCircle,
  FileText,
  Bell,
  Settings,
  ChevronRight,
  PlusCircle,
  TrendingUp,
  CloudSun,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function FarmerDashboard() {
  const { lang, t } = useI18n();
  const { user, loading: authLoading, logout, refreshUser, token } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "crops" | "consultations" | "profile">("overview");

  const [myCrops, setMyCrops] = useState<any[]>([
    { name: "गेहूँ (डीबीडब्ल्यू 187)", area: "2.5 एकड़", sowingDate: "20 नवम्बर 2025", stage: "दाना पकने की अवस्था", slug: "gehu-sample" },
    { name: "सरसों (एनडीआर 8501)", area: "1.0 एकड़", sowingDate: "10 अक्टूबर 2025", stage: "कटाई योग्य", slug: "sarson-sample" },
  ]);

  const [myConsultations, setMyConsultations] = useState<any[]>([
    {
      id: "UKS-894",
      crop: "गेहूँ",
      question: "पत्तियों पर पीली धारियां दिखाई दे रही हैं, क्या यह पीला रतुआ है?",
      status: "समाधान प्राप्त",
      expert: "डॉ. नीरज कुमार सिंह (सस्य वैज्ञानिक, MCAET)",
      date: "18 मार्च 2026",
    },
  ]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (!user) return;
    const effectiveToken = token || localStorage.getItem("uks_token") || localStorage.getItem("admin_token") || "";

    // 1. Fetch Farmer's registered crops
    fetch("/api/v1/farmers/me/crops", {
      headers: effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {},
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMyCrops(data);
        } else {
          const localCrops = localStorage.getItem("my_farmer_crops");
          if (localCrops) {
            try {
              const parsed = JSON.parse(localCrops);
              if (Array.isArray(parsed) && parsed.length > 0) setMyCrops(parsed);
            } catch (e) {}
          }
        }
      })
      .catch(() => {});

    // 2. Fetch Farmer's expert questions
    const emailQuery = user.email ? `?email=${encodeURIComponent(user.email)}` : "";
    fetch(`/api/v1/questions${emailQuery}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((q: any) => ({
            id: q.id || q.question_id || "UKS-Q",
            crop: q.crop || "सामान्य",
            question: q.question || q.question_text || "",
            status: q.status === "answered" ? (lang === "hi" ? "समाधान प्राप्त" : "Answered") : (lang === "hi" ? "प्रतीक्षारत" : "Pending Review"),
            expert: q.answered_by || (lang === "hi" ? "NDUAT कृषि वैज्ञानिक" : "NDUAT Expert"),
            date: q.created_at ? new Date(q.created_at).toLocaleDateString("hi-IN") : "2026-03-20",
            answer: q.answer || q.answer_text,
          }));
          setMyConsultations(mapped);
        }
      })
      .catch(() => {});
  }, [user, token, lang]);

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="size-10 border-4 border-[#15803d] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#4b5563]">
          {lang === "hi" ? "डैशबोर्ड लोड हो रहा है..." : "Loading Dashboard..."}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 shadow-xs">
          <div className="size-14 bg-[#fef3c7] text-[#92400e] rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="size-7" />
          </div>
          <h2 className="text-xl font-black text-[#14532d] mb-2">
            {lang === "hi" ? "लॉगिन आवश्यक है" : "Authentication Required"}
          </h2>
          <p className="text-xs text-[#4b5563] mb-6 leading-relaxed">
            {lang === "hi"
              ? "व्यक्तिगत किसान डैशबोर्ड देखने के लिए कृपया अपने पंजीकृत मोबाइल नंबर अथवा ईमेल से लॉगिन करें।"
              : "Please sign in to access your registered farmer profile, saved crops, and expert advisories."}
          </p>
          <div className="flex flex-col gap-2.5">
            <Link href="/login">
              <Button variant="primary" size="md" fullWidth>
                <span>{lang === "hi" ? "लॉगिन करें" : "Sign In"}</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="md" fullWidth>
                <span>{lang === "hi" ? "नया निःशुल्क पंजीकरण करें" : "Register Free"}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "किसान डैशबोर्ड" : "Farmer Dashboard" }]}
      />

      {/* Real Logged-in Farmer Welcome Banner */}
      <div className="bg-gradient-to-r from-[#14532d] via-[#15803d] to-[#14532d] text-white p-6 sm:p-8 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="size-12 bg-white/20 backdrop-blur-xs rounded-xl flex items-center justify-center text-lg font-black text-[#fef08a] border border-white/20">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "K"}
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight">
                {lang === "hi" ? `स्वागत है, ${user.full_name}!` : `Welcome, ${user.full_name}!`}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="accent" size="sm">
                  किसान आईडी: #UPKS-{user.id ? user.id.slice(-6).toUpperCase() : "4892"}
                </Badge>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                  {user.role === "super_admin" || user.role === "admin"
                    ? (lang === "hi" ? "प्रशासक" : "Administrator")
                    : (lang === "hi" ? "प्रमाणित किसान" : "Verified Farmer")}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#86efac] flex items-center gap-2 pt-1">
            <MapPin className="size-4 shrink-0" />
            <span>
              {user.village ? `${user.village}, ` : ""}
              {user.block ? (lang === "hi" ? `ब्लॉक: ${user.block}, ` : `Block: ${user.block}, `) : ""}
              {user.tehsil ? (lang === "hi" ? `तहसील: ${user.tehsil}, ` : `Tehsil: ${user.tehsil}, `) : ""}
              {user.district ? (lang === "hi" ? `जनपद: ${user.district} ` : `District: ${user.district} `) : ""}
              {user.pincode ? `(${user.pincode})` : ""}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/ask-expert">
            <Button variant="accent" size="sm" className="shadow-xs">
              <HelpCircle className="size-4" />
              <span>{lang === "hi" ? "वैज्ञानिक से पूछें" : "Ask Expert"}</span>
            </Button>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 py-2 rounded-lg border border-white/20 cursor-pointer transition-colors"
          >
            <LogOut className="size-3.5" />
            <span>{lang === "hi" ? "लॉगआउट" : "Sign Out"}</span>
          </button>
        </div>
      </div>

      {/* Farmer Dashboard Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#e5e7eb]">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#15803d] text-white shadow-xs"
        >
          <TrendingUp className="size-4" />
          <span>{lang === "hi" ? "डैशबोर्ड अवलोकन" : "Overview"}</span>
        </Link>
        <Link
          href="/dashboard/crops"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#4b5563] hover:text-[#14532d] hover:bg-[#f0fdf4] transition-colors"
        >
          <Sprout className="size-4 text-[#15803d]" />
          <span>{lang === "hi" ? "मेरी फसलें प्रबंधित करें" : "My Crops"}</span>
        </Link>
        <Link
          href="/ask-expert"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#4b5563] hover:text-[#14532d] hover:bg-[#f0fdf4] transition-colors"
        >
          <HelpCircle className="size-4 text-[#0284c7]" />
          <span>{lang === "hi" ? "विशेषज्ञ परामर्श" : "Consultations"}</span>
        </Link>
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#4b5563] hover:text-[#14532d] hover:bg-[#f0fdf4] transition-colors"
        >
          <User className="size-4 text-[#6b7280]" />
          <span>{lang === "hi" ? "मेरी प्रोफ़ाइल" : "Farmer Profile"}</span>
        </Link>
      </div>

      {/* Grid: Profile Details Card + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Registered Farmer Verification Details Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f6]">
            <h3 className="font-bold text-base text-[#14532d] flex items-center gap-2">
              <User className="size-5 text-[#15803d]" />
              <span>{lang === "hi" ? "पंजीकृत किसान प्रोफ़ाइल" : "Registered Profile"}</span>
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#15803d] bg-[#dcfce7] px-2.5 py-0.5 rounded-full border border-[#86efac]">
              <CheckCircle2 className="size-3" />
              {lang === "hi" ? "सत्यापित खाता" : "Verified Account"}
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <span className="text-xs text-[#6b7280] block">{lang === "hi" ? "पूरा नाम:" : "Full Name:"}</span>
              <p className="font-bold text-[#1f2937] text-sm">{user.full_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-[#6b7280] block">{lang === "hi" ? "मोबाइल नंबर:" : "Mobile:"}</span>
                <p className="font-semibold text-[#1f2937] flex items-center gap-1">
                  <Phone className="size-3.5 text-[#15803d]" />
                  <span>{user.phone || (lang === "hi" ? "उपलब्ध नहीं" : "N/A")}</span>
                </p>
              </div>
              <div>
                <span className="text-xs text-[#6b7280] block">{lang === "hi" ? "ईमेल पता:" : "Email:"}</span>
                <p className="font-semibold text-[#1f2937] truncate" title={user.email}>
                  {user.email}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#f3f4f6] space-y-2">
              <span className="text-xs font-bold text-[#14532d] block uppercase tracking-wider">
                {lang === "hi" ? "प्रशासनिक पता:" : "Location Details:"}
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#f8faf5] p-2 rounded-lg border border-[#e5e7eb]">
                  <span className="text-[#6b7280] block">{lang === "hi" ? "जनपद" : "District"}</span>
                  <span className="font-bold text-[#14532d]">{user.district || (lang === "hi" ? "अयोध्या" : "Ayodhya")}</span>
                </div>
                <div className="bg-[#f8faf5] p-2 rounded-lg border border-[#e5e7eb]">
                  <span className="text-[#6b7280] block">{lang === "hi" ? "तहसील" : "Tehsil"}</span>
                  <span className="font-bold text-[#14532d]">{user.tehsil || (lang === "hi" ? "सदर" : "Sadar")}</span>
                </div>
                <div className="bg-[#f8faf5] p-2 rounded-lg border border-[#e5e7eb]">
                  <span className="text-[#6b7280] block">{lang === "hi" ? "विकास खंड" : "Block"}</span>
                  <span className="font-bold text-[#14532d]">{user.block || (lang === "hi" ? "सदर" : "Sadar")}</span>
                </div>
                <div className="bg-[#f8faf5] p-2 rounded-lg border border-[#e5e7eb]">
                  <span className="text-[#6b7280] block">{lang === "hi" ? "ग्राम" : "Village"}</span>
                  <span className="font-bold text-[#14532d]">{user.village || (lang === "hi" ? "ग्राम" : "Village")}</span>
                </div>
              </div>

              <div className="bg-[#f0fdf4] p-2.5 rounded-lg border border-[#bbf7d0] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#14532d] font-bold block">
                    {lang === "hi" ? "पिन कोड: " : "PIN Code: "}{user.pincode || "224001"}
                  </span>
                  <span className="text-[11px] text-[#4b5563]">
                    {user.post_office || (lang === "hi" ? "मुख्य डाकघर" : "Head Post Office")}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#15803d] bg-white px-2 py-0.5 rounded border border-[#86efac]">
                  {lang === "hi" ? "उ.प्र. पोस्टल" : "UP Postal"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Saved Crops & Consultations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs flex items-center gap-3">
              <div className="p-3 bg-[#dcfce7] text-[#15803d] rounded-xl">
                <Sprout className="size-6" />
              </div>
              <div>
                <span className="text-xs text-[#6b7280] font-semibold">
                  {lang === "hi" ? "पंजीकृत फसलें" : "Registered Crops"}
                </span>
                <p className="text-xl font-black text-[#14532d]">
                  {myCrops.length} {lang === "hi" ? "फसलें" : "Crops"}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs flex items-center gap-3">
              <div className="p-3 bg-[#e0f2fe] text-[#0284c7] rounded-xl">
                <HelpCircle className="size-6" />
              </div>
              <div>
                <span className="text-xs text-[#6b7280] font-semibold">
                  {lang === "hi" ? "वैज्ञानिक परामर्श" : "Scientific Advisory"}
                </span>
                <p className="text-xl font-black text-[#0369a1]">
                  {myConsultations.length} {lang === "hi" ? "सक्रिय" : "Active"}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs flex items-center gap-3">
              <div className="p-3 bg-[#fef3c7] text-[#92400e] rounded-xl">
                <TrendingUp className="size-6" />
              </div>
              <div>
                <span className="text-xs text-[#6b7280] font-semibold">
                  {lang === "hi" ? "आज का मंडी भाव" : "Today Mandi Rate"}
                </span>
                <p className="text-xl font-black text-[#92400e]">
                  ₹2,475/{lang === "hi" ? "कुंतल" : "Quintal"}
                </p>
              </div>
            </div>
          </div>

          {/* Registered Crops List */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#14532d] flex items-center gap-2">
                <Sprout className="size-5 text-[#15803d]" />
                <span>{lang === "hi" ? "मेरी पंजीकृत फसलें" : "My Crops"}</span>
              </h3>
              <Link href="/dashboard/crops">
                <Button variant="primary" size="sm">
                  <PlusCircle className="size-3.5" />
                  <span>{lang === "hi" ? "नई फसल जोड़ें" : "Add Crop"}</span>
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {myCrops.map((crop, idx) => {
                const cropImg = crop.name.includes("सरसों") || (crop.name || "").toLowerCase().includes("mustard")
                  ? "/crops/mustard.jpg"
                  : crop.name.includes("धान") || (crop.name || "").toLowerCase().includes("paddy")
                  ? "/crops/paddy.jpg"
                  : crop.name.includes("गन्ना") || (crop.name || "").toLowerCase().includes("sugarcane")
                  ? "/crops/sugarcane.jpg"
                  : crop.name.includes("अरहर") || (crop.name || "").toLowerCase().includes("arhar")
                  ? "/crops/arhar.jpg"
                  : "/crops/wheat.jpg";

                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#f8faf5] border border-[#e5e7eb] rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cropImg}
                        alt={crop.name}
                        className="size-14 rounded-lg object-cover border border-[#e5e7eb] shrink-0"
                      />
                      <div>
                        <h4 className="font-extrabold text-[#14532d] text-sm">{crop.name}</h4>
                        <p className="text-xs text-[#6b7280] mt-0.5">
                          {lang === "hi" ? "क्षेत्रफल:" : "Area:"} {crop.area} • {lang === "hi" ? "बुवाई तिथि:" : "Sowing:"} {crop.sowingDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold bg-[#dcfce7] text-[#14532d] px-2.5 py-1 rounded-full border border-[#86efac]">
                        {crop.stage}
                      </span>
                      <Link href={`/crops/${crop.slug || "gehu-sample"}`} className="text-xs font-bold text-[#15803d] hover:underline">
                        {lang === "hi" ? "पैकेज देखें →" : "View Package →"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* My Consultations */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#14532d] flex items-center gap-2">
                <HelpCircle className="size-5 text-[#15803d]" />
                <span>{lang === "hi" ? "मेरे विशेषज्ञ परामर्श प्रश्न" : "My Consultations"}</span>
              </h3>
              <Link href="/ask-expert">
                <Button variant="primary" size="sm">
                  <span>{lang === "hi" ? "नया प्रश्न पूछें" : "Ask Question"}</span>
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {myConsultations.map((item) => (
                <div key={item.id} className="p-4 bg-[#f8faf5] border border-[#e5e7eb] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#15803d]">
                      {lang === "hi" ? "प्रश्न सं.: #" : "Ref ID: #"}{item.id}
                    </span>
                    <span className="text-[11px] font-semibold bg-[#dcfce7] text-[#14532d] px-2 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#1f2937]">{item.question}</p>
                  <p className="text-[11px] text-[#6b7280]">
                    {lang === "hi" ? "उत्तरदाता: " : "Answered by: "}{item.expert} • {item.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
