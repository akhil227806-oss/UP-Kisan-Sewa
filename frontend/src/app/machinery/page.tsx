"use client";

import React from "react";
import { Wrench, CheckCircle, Search, ShieldCheck, Tag } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useI18n } from "@/lib/i18n";

export default function MachineryPage() {
  const { lang } = useI18n();

  const machinery = [
    {
      name_hi: "सुपर सीडर",
      name_en: "Super Seeder",
      image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=700&auto=format&fit=crop&q=80",
      purpose_hi: "धान की खड़ी पराली में बिना जलाए सीधे गेहूँ की बुवाई एवं खाद डालना।",
      purpose_en: "Direct wheat sowing and fertilizer application directly in standing paddy stubble without burning.",
      hp_hi: "50 एचपी या अधिक ट्रैक्टर",
      hp_en: "50+ HP Tractor",
      subsidy_hi: "उ.प्र. कृषि यंत्रीकरण योजना में 50% तक अनुदान (अधिकतम ₹1.05 लाख)।",
      subsidy_en: "Up to 50% government subsidy (max ₹1.05 Lakh) under UP Farm Mechanization Scheme.",
      benefits_hi: "पराली प्रबंधन, डीजल की बचत, समय की बचत, और मृदा जीवांश में वृद्धि।",
      benefits_en: "In-situ crop residue management, 30% diesel savings, and increased soil organic carbon.",
      source_hi: "कृषि अभियांत्रिकी संकाय, NDUAT / कृषि विभाग उ.प्र.",
      source_en: "Faculty of Agricultural Engineering, NDUAT / UP Agriculture Dept",
    },
    {
      name_hi: "रोटावेटर (रोटरी टिलर)",
      name_en: "Rotavator (Rotary Tiller)",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=700&auto=format&fit=crop&q=80",
      purpose_hi: "खेत की पहली जुताई में ही मिट्टी को भुरभुरा एवं समतल बनाना।",
      purpose_en: "Pulverizing and aerating soil in a single pass to prepare fine seedbed.",
      hp_hi: "35-50 एचपी ट्रैक्टर",
      hp_en: "35-50 HP Tractor",
      subsidy_hi: "40% से 50% सरकारी अनुदान उपलब्ध।",
      subsidy_en: "40% to 50% state subsidy available on token generation.",
      benefits_hi: "कम समय में बीज शैय्या तैयार करना, खरपतवारों का बारीक चूर्ण बनाना।",
      benefits_en: "Fast seedbed preparation, complete weed shredding, and fuel efficiency.",
      source_hi: "कृषि विभाग उत्तर प्रदेश",
      source_en: "Department of Agriculture, Uttar Pradesh",
    },
    {
      name_hi: "लेजर लैंड लेवलर",
      name_en: "Laser Land Leveler",
      image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=700&auto=format&fit=crop&q=80",
      purpose_hi: "खेत को कम्प्यूटरीकृत लेजर किरण द्वारा मिलीमीटर स्तर तक समतल करना।",
      purpose_en: "Millimeter-precision laser-guided terrain grading and leveling for agricultural fields.",
      hp_hi: "50-60 एचपी ट्रैक्टर",
      hp_en: "50-60 HP Tractor",
      subsidy_hi: "कस्टम हायरिंग सेंटर (CHC) योजना अंतर्गत 40% अनुदान।",
      subsidy_en: "40% subsidy under Custom Hiring Centre (CHC) schemes.",
      benefits_hi: "सिंचाई जल की 25-30% बचत, समान खाद वितरण, 10-15% उपज वृद्धि।",
      benefits_en: "25-30% irrigation water conservation, uniform fertilizer uptake, and 10-15% higher yield.",
      source_hi: "एनडीयूएटी कृषि यंत्रीकरण प्रकोष्ठ",
      source_en: "NDUAT Farm Mechanization Cell",
    },
    {
      name_hi: "बैटरी / सोलर पावर्ड नेपसेक स्प्रेयर",
      name_en: "Battery / Solar Knapsack Sprayer",
      image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=700&auto=format&fit=crop&q=80",
      purpose_hi: "कीटनाशक, कवकनाशी एवं घुलनशील खादों का एकसमान छिड़काव।",
      purpose_en: "Uniform high-pressure spraying of bio-pesticides, fungicides, and liquid micronutrients.",
      hp_hi: "12V रिचार्जेबल बैटरी",
      hp_en: "12V Rechargeable Battery",
      subsidy_hi: "लघु व सीमांत किसानों को 50% अनुदान।",
      subsidy_en: "50% direct subsidy for small and marginal farmers.",
      benefits_hi: "हाथ की थकान से मुक्ति, दबाव निरंतर बना रहना, दवाओं का सही फैलाव।",
      benefits_en: "Ergonomic operation, constant spray pressure, and reduced chemical wastage.",
      source_hi: "उ.प्र. राज्य कृषि उत्पादन मंडी परिषद",
      source_en: "UP State Agricultural Marketing Board",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "कृषि यंत्र व उपकरण" : "Farm Machinery" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "उन्नत कृषि यंत्र एवं सरकारी अनुदान" : "Modern Farm Machinery & Subsidies"}
          subtitle={
            lang === "hi"
              ? "उत्तर प्रदेश सरकार द्वारा कृषि यंत्रीकरण योजना में अनुमन्य आधुनिक कृषि उपकरण, उपयोग विधि व अनुदान विवरण"
              : "Farm mechanization guides, equipment operations, and official government subsidy guidelines"
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {machinery.map((m, idx) => (
          <Card key={idx} className="overflow-hidden">
            <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
              <img
                src={m.image}
                alt={lang === "hi" ? m.name_hi : m.name_en}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="bg-white/90 backdrop-blur-xs font-bold text-[#14532d]">
                  {lang === "hi" ? m.hp_hi : m.hp_en}
                </Badge>
              </div>
            </div>

            <CardHeader className="bg-[#f8faf5]">
              <CardTitle className="flex items-center gap-2 text-[#14532d]">
                <Wrench className="size-5 text-[#15803d]" />
                <span>{lang === "hi" ? m.name_hi : m.name_en}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 pt-4 text-xs sm:text-sm">
              <div>
                <strong className="text-[#14532d] block">
                  {lang === "hi" ? "उपयोग एवं कार्य:" : "Application & Purpose:"}
                </strong>
                <p className="text-[#374151] mt-0.5">{lang === "hi" ? m.purpose_hi : m.purpose_en}</p>
              </div>

              <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-3 rounded-lg">
                <strong className="text-[#15803d] flex items-center gap-1">
                  <Tag className="size-4" />
                  <span>{lang === "hi" ? "सरकारी अनुदान:" : "Government Subsidy:"}</span>
                </strong>
                <p className="text-[#14532d] mt-1 font-semibold">
                  {lang === "hi" ? m.subsidy_hi : m.subsidy_en}
                </p>
              </div>

              <div>
                <strong className="text-[#14532d] block">
                  {lang === "hi" ? "प्रमुख लाभ:" : "Key Benefits:"}
                </strong>
                <p className="text-[#4b5563] mt-0.5">{lang === "hi" ? m.benefits_hi : m.benefits_en}</p>
              </div>
            </CardContent>

            <div className="p-3 bg-[#f8faf5] border-t border-[#e5e7eb]">
              <SourceBadge sourceName={lang === "hi" ? m.source_hi : m.source_en} />
            </div>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-[#fffbeb] border border-[#fde68a] rounded-xl text-xs sm:text-sm text-[#92400e]">
        <strong>{lang === "hi" ? "अनुदान हेतु आवेदन: " : "Application for Subsidy: "}</strong>
        {lang === "hi"
          ? "कृषि यंत्रों पर सरकारी अनुदान हेतु उ.प्र. कृषि विभाग के पोर्टल (agriculture.up.gov.in) पर 'यंत्र टोकन' व्यवस्था द्वारा पारदर्शी ई-लॉटरी के माध्यम से चयन किया जाता है।"
          : "Apply for farm mechanization tokens directly on the UP Agriculture portal (agriculture.up.gov.in). Subsidies are allocated via transparent e-lottery token selection."}
      </div>
    </div>
  );
}
