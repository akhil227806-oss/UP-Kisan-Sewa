"use client";

import React from "react";
import { ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { useI18n } from "@/lib/i18n";

export default function SourcesPage() {
  const { lang } = useI18n();

  const dataSources = [
    {
      sourceName: "आचार्य नरेंद्र देव कृषि एवं प्रौद्योगिकी विश्वविद्यालय (NDUAT)",
      url: "https://www.nduat.org/",
      purpose: "फसल पैकेज, उन्नत किस्में, वैज्ञानिक बुवाई विधियाँ, केवीके डायरेक्टरी एवं कृषि परामर्श",
      refresh: "साप्ताहिक / पाक्षिक समीक्षा",
    },
    {
      sourceName: "एगमार्कनेट (Agmarknet) / data.gov.in",
      url: "https://agmarknet.gov.in/",
      purpose: "उत्तर प्रदेश की थोक मंडियों के दैनिक आगमन एवं न्यूनतम/अधिकतम/मॉडल भाव",
      refresh: "दैनिक (प्रतिदिन शाम को अद्यतन)",
    },
    {
      sourceName: "भारत मौसम विज्ञान विभाग (IMD Mausam)",
      url: "https://mausam.imd.gov.in/",
      purpose: "जनपद-वार तापमान, वर्षा, हवा की गति एवं कृषि मौसम बुलेटिन (GKMS)",
      refresh: "दैनिक (प्रति 24 घंटे)",
    },
    {
      sourceName: "कृषि विभाग, उत्तर प्रदेश सरकार",
      url: "https://agriculture.up.gov.in/",
      purpose: "राज्य कृषि अनुदान, खेत तालाब योजना, कृषि यंत्रीकरण टोकन एवं बीज वितरण",
      refresh: "मासिक सत्यापन",
    },
    {
      sourceName: "पीएम-किसान आधिकारिक पोर्टल",
      url: "https://pmkisan.gov.in/",
      purpose: "प्रधानमंत्री किसान सम्मान निधि पात्रता, ई-केवाईसी दिशानिर्देश एवं हेल्पलाइन",
      refresh: "नियमित सत्यापन",
    },
    {
      sourceName: "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
      url: "https://pmfby.gov.in/",
      purpose: "फसल बीमा प्रीमियम दरें, दावा प्रक्रिया एवं बीमा कंपनी संपर्क सूत्र",
      refresh: "मौसमी बुलेटिन",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "डेटा स्रोत एवं सत्यापन नीति" : "Data Sources & Verification" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "डेटा स्रोत एवं सत्यापन नीति" : "Data Sources & Verification Policy"}
          subtitle={
            lang === "hi"
              ? "पारदर्शिता, विश्वसनीयता एवं शून्य-भ्रम का संकल्प"
              : "Our Commitment to Transparency, Authenticity & Zero Fake Data"
          }
        />
      </div>

      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-sm sm:text-base text-[#374151] leading-relaxed mb-8">
        <div>
          <h3 className="font-bold text-[#14532d] text-lg mb-2">
            {lang === "hi" ? "सत्यापन नीति के मूल सिद्धांत" : "Core Principles of Verification Policy"}
          </h3>
          <p>
            {lang === "hi"
              ? "यू पी किसान सेवा का अटल नियम है कि कोई भी फर्जी, मनगढ़ंत या असत्यापित कीटनाशक डोज, मंडी भाव अथवा सरकारी योजना की जानकारी प्रकाशित नहीं की जाएगी। प्रत्येक सार्वजनिक पृष्ठ पर स्रोत संस्थान का नाम, आधिकारिक लिंक एवं अंतिम अद्यतन तिथि प्रदर्शित की जाती है।"
              : "Awadh Kisan Seva enforces strict data governance: no unverified, false, or speculative agrochemical doses, market rates, or government scheme guidelines are ever published. All pages cite verified institutional sources, links, and update timestamps."}
          </p>
        </div>

        <div className="space-y-4">
          {dataSources.map((ds, idx) => (
            <div key={idx} className="p-4 bg-[#f8faf5] border border-[#e5e7eb] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-[#14532d] flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-[#15803d]" />
                  <span>{ds.sourceName}</span>
                </h4>
                <p className="text-xs text-[#4b5563] mt-1">{ds.purpose}</p>
                <span className="text-[11px] text-[#6b7280] block mt-0.5">
                  {lang === "hi" ? "अद्यतन आवृत्ति: " : "Update Frequency: "}
                  {ds.refresh}
                </span>
              </div>
              <a
                href={ds.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#15803d] hover:underline shrink-0"
              >
                <span>{lang === "hi" ? "आधिकारिक वेबसाइट" : "Official Website"}</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
