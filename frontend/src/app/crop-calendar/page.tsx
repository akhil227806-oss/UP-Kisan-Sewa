"use client";

import React, { useState } from "react";
import { Calendar, Sprout, Sun, Droplets, Scissors, ChevronRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useI18n } from "@/lib/i18n";

export default function CropCalendarPage() {
  const { lang } = useI18n();
  const [selectedMonth, setSelectedMonth] = useState("november");

  const months = [
    { id: "june", name_hi: "जून", name_en: "June", season: "खरीफ आरंभ" },
    { id: "july", name_hi: "जुलाई", name_en: "July", season: "खरीफ बुवाई" },
    { id: "august", name_hi: "अगस्त", name_en: "August", season: "निराई-गुड़ाई" },
    { id: "september", name_hi: "सितम्बर", name_en: "September", season: "कीट निगरानी" },
    { id: "october", name_hi: "अक्टूबर", name_en: "October", season: "रबी तैयारी/सरसों" },
    { id: "november", name_hi: "नवम्बर", name_en: "November", season: "गेहूँ बुवाई मुख्य" },
    { id: "december", name_hi: "दिसम्बर", name_en: "December", season: "CRI सिंचाई" },
    { id: "january", name_hi: "जनवरी", name_en: "January", season: "माहू निगरानी" },
    { id: "february", name_hi: "फरवरी", name_en: "February", season: "जायद तैयारी" },
    { id: "march", name_hi: "मार्च", name_en: "March", season: "जायद बुवाई/कटाई" },
    { id: "april", name_hi: "अप्रैल", name_en: "April", season: "गेहूँ कटाई/मड़ाई" },
    { id: "may", name_hi: "मई", name_en: "May", season: "हरी खाद (ढैंचा)" },
  ];

  const monthActivities: Record<string, any> = {
    november: {
      title_hi: "नवम्बर माह की प्रमुख कृषि गतिविधियाँ",
      season: "रबी मौसम",
      activities: [
        {
          crop: "गेहूँ",
          action: "समय से बुवाई का सर्वोत्तम समय (15-25 नवम्बर)। अनुमोदित किस्में डीबीडब्ल्यू 187, एचडी 2967।",
          priority: "उच्च",
        },
        {
          crop: "सरसों / राई",
          action: "यदि बुवाई अक्टूबर में की गई है तो पहली सिंचाई फूल आने से पूर्व करें तथा घने पौधों को विरलीकरण (Thinning) कर 10-12 सेमी दूरी बनाएं।",
          priority: "मध्यम",
        },
        {
          crop: "चना / मटर",
          action: "प्रथम पखवाड़े में बुवाई पूर्ण करें। राइजोबियम कल्चर व पीएसबी से बीजोपचार अवश्य करें।",
          priority: "उच्च",
        },
        {
          crop: "आलू",
          action: "मुख्य फसल की बुवाई 15 नवम्बर तक समाप्त करें तथा अगेती फसल में मिट्टी चढ़ाने (Earthing up) का कार्य करें।",
          priority: "मध्यम",
        },
      ],
      advisory: "गेहूँ की बुवाई हमेशा कूंड़ों में सी drill या जीरो टिलेज मशीन से करें। बीज को 4-5 सेमी से अधिक गहरा न बोएं।",
    },
    october: {
      title_hi: "अक्टूबर माह की प्रमुख कृषि गतिविधियाँ",
      season: "खरीफ कटाई व रबी तैयारी",
      activities: [
        { crop: "धान", action: "अगेती व मध्यम किस्मों की कटाई समय पर करें। दाने में 14% नमी पर भंडारण करें।", priority: "उच्च" },
        { crop: "सरसों / तोरिया", action: "तोरिया एवं राई की बुवाई 15 अक्टूबर तक पूरी कर लें।", priority: "उच्च" },
        { crop: "शरदकालीन गन्ना", action: "गन्ने की शरदकालीन बुवाई अंतर्वर्ती फसलों (आलू, सरसों) के साथ करें।", priority: "मध्यम" },
      ],
      advisory: "धान की पराली को खेत में कदापि न जलाएं। पूसा डीकंपोजर अथवा सुपर सीडर का प्रयोग कर मिट्टी में मिलाएं।",
    },
  };

  const current = monthActivities[selectedMonth] || monthActivities["november"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "फसल कैलेंडर" : "Crop Calendar" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "उत्तर प्रदेश मासिक फसल कैलेंडर" : "Monthly Agricultural Calendar"}
          subtitle={
            lang === "hi"
              ? "एनडीयूएटी कृषि वैज्ञानिकों द्वारा उत्तर प्रदेश के जलवायु क्षेत्रों हेतु माह-वार बुवाई, सिंचाई, खाद व कटाई कार्य-योजना"
              : "Month-by-month agricultural activities, crop calendars, and agronomic operations for Uttar Pradesh"
          }
        />
      </div>

      {/* Month Selector Carousel / Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 mb-8">
        {months.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelectedMonth(m.id)}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between ${
              selectedMonth === m.id
                ? "bg-[#15803d] text-white border-[#15803d] shadow-sm font-bold scale-105"
                : "bg-white text-[#374151] border-[#e5e7eb] hover:bg-[#f8faf5]"
            }`}
          >
            <span className="text-sm font-bold block">{lang === "hi" ? m.name_hi : m.name_en}</span>
            <span className={`text-[10px] mt-1 line-clamp-1 ${selectedMonth === m.id ? "text-[#fef08a]" : "text-[#6b7280]"}`}>
              {m.season}
            </span>
          </button>
        ))}
      </div>

      {/* Month Activities Detail */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-xs mb-8 overflow-hidden">
        {/* Seasonal Visual Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden">
          <img
            src={
              ["june", "july", "august", "september"].includes(selectedMonth)
                ? "/crops/paddy.jpg"
                : ["february", "march", "april", "may"].includes(selectedMonth)
                ? "/crops/maize.jpg"
                : "/crops/wheat.jpg"
            }
            alt={current.season}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-3 text-white">
            <div>
              <span className="text-xs font-bold bg-[#15803d] text-white px-3 py-1 rounded-full shadow-xs mb-1.5 inline-block">
                {current.season}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">{current.title_hi}</h3>
            </div>
            <div className="text-xs text-[#86efac] font-semibold bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/20">
              {lang === "hi" ? "कृषि वेधशाला अनुपालन" : "Agro-Meteorology Sync"}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4 mb-6">
          {current.activities.map((act: any, idx: number) => (
            <div key={idx} className="p-4 bg-[#f8faf5] border border-[#e5e7eb] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#15803d] bg-[#dcfce7] px-2 py-0.5 rounded">
                  फसल: {act.crop}
                </span>
                <p className="text-sm text-[#1f2937] font-medium mt-1.5">{act.action}</p>
              </div>
              <Badge variant={act.priority === "उच्च" ? "danger" : "warning"} size="sm">
                प्राथमिकता: {act.priority}
              </Badge>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl text-xs sm:text-sm text-[#14532d]">
          <strong>विशेष वैज्ञानिक परामर्श: </strong>{current.advisory}
        </div>
        </div>
      </div>

      <SourceBadge
        sourceName="एनडीयूएटी विस्तार निदेशालय, कुमारगंज, अयोध्या"
        updatedAt="2026-03-01"
      />
    </div>
  );
}
