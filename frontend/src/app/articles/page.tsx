"use client";

import React, { useState } from "react";
import { FileText, Download, Calendar, Search, User, ChevronRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useI18n } from "@/lib/i18n";

export default function ArticlesPage() {
  const { lang } = useI18n();
  const [search, setSearch] = useState("");

  const publications = [
    {
      title_hi: "उत्तर प्रदेश में गेहूं की देर से बुवाई: वैज्ञानिक पैकेज एवं प्रबंधन",
      title_en: "Late-Sown Wheat Management in Eastern UP: Scientific Guidelines",
      author_hi: "वैज्ञानिक दल, सस्य विज्ञान संभाग, NDUAT",
      author_en: "Scientific Team, Department of Agronomy, NDUAT",
      date_hi: "मार्च 2026",
      date_en: "March 2026",
      category_hi: "शोध आलेख",
      category_en: "Research Article",
      summary_hi: "देर से बुवाई की स्थिति में बीज दर, तापमान वृद्धि से दाना सिकुड़ने की रोकथाम एवं पोटाश के प्रयोग पर शोध निष्कर्ष।",
      summary_en: "Empirical findings on optimal seed rate, terminal heat mitigation, and potassium fertilization for late-sown wheat.",
      pages_hi: "6 पृष्ठ (PDF)",
      pages_en: "6 Pages (PDF)",
      source_hi: "कृषि प्रसार बुलेटिन (NDUAT)",
      source_en: "Agricultural Extension Bulletin (NDUAT)",
    },
    {
      title_hi: "मृदा में जीवांश कार्बन (Organic Carbon) बढ़ाने की आधुनिक तकनीक",
      title_en: "Techniques for Enhancing Soil Organic Carbon in Gangetic Alluvium",
      author_hi: "डॉ. अरविंद त्रिपाठी, मृदा वैज्ञानिक",
      author_en: "Dr. Arvind Tripathi, Soil Scientist",
      date_hi: "फरवरी 2026",
      date_en: "February 2026",
      category_hi: "मृदा विज्ञान",
      category_en: "Soil Science",
      summary_hi: "हरी खाद (ढैंचा/सनई), फसल अवशेष प्रबंधन और जैविक खादों के समावेश से मिट्टी की उर्वरता बहाली।",
      summary_en: "Restoring soil microbiology and moisture retention using green manuring (Dhaincha), crop residues, and bio-enrichers.",
      pages_hi: "4 पृष्ठ (PDF)",
      pages_en: "4 Pages (PDF)",
      source_hi: "NDUAT अनुसंधान निदेशालय",
      source_en: "NDUAT Directorate of Research",
    },
    {
      title_hi: "दलहनी फसलों में एकीकृत पोषण प्रबंधन (INM) से उपज संवर्धन",
      title_en: "Integrated Nutrient Management (INM) in Pulse Crop Production",
      author_hi: "पादप कार्यिकी एवं कृषि रसायन विभाग",
      author_en: "Dept of Plant Physiology & Agricultural Chemistry",
      date_hi: "जनवरी 2026",
      date_en: "January 2026",
      category_hi: "फसल पोषण",
      category_en: "Crop Nutrition",
      summary_hi: "राइजोबियम कल्चर, फॉस्फेट विलेयक जीवाणु (PSB) एवं गंधक (सल्फर) के प्रयोग से दलहन उत्पादन में 20% तक वृद्धि।",
      summary_en: "Maximizing nodulation and yield in chickpea and pigeonpea through Rhizobium inoculation, PSB, and elemental sulphur.",
      pages_hi: "5 पृष्ठ (PDF)",
      pages_en: "5 Pages (PDF)",
      source_hi: "आईसीएआर-आईआईपीआर / एनडीयूएटी",
      source_en: "ICAR-IIPR / NDUAT",
    },
  ];

  const filtered = publications.filter((pub) => {
    const q = search.toLowerCase().trim();
    const t = lang === "hi" ? pub.title_hi : pub.title_en;
    const a = lang === "hi" ? pub.author_hi : pub.author_en;
    return q === "" || t.toLowerCase().includes(q) || a.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "लेख एवं प्रकाशन" : "Articles & Publications" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "कृषि वैज्ञानिक लेख एवं शोध प्रकाशन" : "Articles & Research Publications"}
          subtitle={
            lang === "hi"
              ? "एनडीयूएटी वैज्ञानिकों द्वारा लिखित प्रामाणिक कृषि आलेख, वैज्ञानिक बुलेटिन एवं डाउनलोड योग्य संसाधन"
              : "Peer-reviewed extension articles, practical farming bulletins, and downloadable guides"
          }
        />
      </div>

      {/* Search Input */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-2.5 size-4 text-[#9ca3af]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === "hi" ? "लेख अथवा लेखक खोजें..." : "Search articles or authors..."}
          className="w-full pl-9 pr-4 py-2 border border-[#d1d5db] rounded-xl text-xs sm:text-sm bg-white outline-none focus:border-[#15803d]"
        />
      </div>

      <div className="space-y-4 mb-8">
        {filtered.map((pub, idx) => (
          <Card key={idx} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f3f4f6] pb-3 mb-3">
              <div>
                <Badge variant="success" size="sm" className="mb-1">
                  {lang === "hi" ? pub.category_hi : pub.category_en}
                </Badge>
                <CardTitle className="text-base sm:text-lg text-[#14532d]">
                  {lang === "hi" ? pub.title_hi : pub.title_en}
                </CardTitle>
                <p className="text-xs text-[#6b7280] flex flex-wrap items-center gap-2 mt-1">
                  <span>{lang === "hi" ? "लेखक: " : "Author: "}{lang === "hi" ? pub.author_hi : pub.author_en}</span>
                  <span>•</span>
                  <span>{lang === "hi" ? "दिनांक: " : "Date: "}{lang === "hi" ? pub.date_hi : pub.date_en}</span>
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#bbf7d0] text-[#14532d] text-xs font-bold px-3 py-2 rounded-lg cursor-pointer shrink-0 transition-colors"
              >
                <Download className="size-3.5" />
                <span>
                  {lang === "hi"
                    ? `PDF डाउनलोड (${pub.pages_hi})`
                    : `Download PDF (${pub.pages_en})`}
                </span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#374151] leading-relaxed mb-3">
              {lang === "hi" ? pub.summary_hi : pub.summary_en}
            </p>

            <SourceBadge sourceName={lang === "hi" ? pub.source_hi : pub.source_en} />
          </Card>
        ))}
      </div>
    </div>
  );
}
