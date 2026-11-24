"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, Search, ExternalLink, CheckCircle2, ChevronRight, Tag } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useI18n } from "@/lib/i18n";

export default function SchemesPage() {
  const { lang } = useI18n();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [liveSchemes, setLiveSchemes] = useState<any[]>([]);

  React.useEffect(() => {
    fetch("/api/v1/schemes?page_size=50")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          const mapped = data.items.map((s: any) => ({
            slug: s.slug,
            name_hi: s.name_hi,
            name_en: s.name_en || s.name_hi,
            category_id: s.category || "central",
            category_hi: s.category_hi || "केन्द्रीय योजना",
            benefit: s.benefit || "",
            eligibility: s.eligibility || "",
            officialLink: s.officialLink || "https://agriculture.up.gov.in/",
            source: s.source || "उ.प्र. कृषि विभाग",
            updatedAt: "2026-11-22",
          }));
          setLiveSchemes(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const categories = [
    { id: "all", label_hi: "सभी योजनाएँ", label_en: "All Schemes" },
    { id: "central", label_hi: "केन्द्र सरकार योजनाएँ", label_en: "Central Govt" },
    { id: "state", label_hi: "उत्तर प्रदेश सरकार योजनाएँ", label_en: "UP State Govt" },
    { id: "subsidy", label_hi: "कृषि यंत्र व अनुदान", label_en: "Subsidies" },
    { id: "insurance", label_hi: "फसल बीमा", label_en: "Crop Insurance" },
    { id: "irrigation", label_hi: "सिंचाई व सोलर", label_en: "Irrigation & Solar" },
  ];

  const schemes = [
    {
      slug: "pm-kisan",
      name_hi: "प्रधानमंत्री किसान सम्मान निधि योजना (PM-KISAN)",
      name_en: "PM Kisan Samman Nidhi",
      category_id: "central",
      category_hi: "केन्द्रीय योजना",
      benefit: "पात्र कृषक परिवारों को ₹6,000 प्रति वर्ष (₹2,000 की 3 समान किस्तों में) प्रत्यक्ष लाभ अंतरण (DBT)।",
      eligibility: "भूमिधर कृषक परिवार जिनके नाम पर खेती योग्य भूमि का वैध भू-अभिलेख दर्ज हो।",
      officialLink: "https://pmkisan.gov.in/",
      source: "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार",
      updatedAt: "2026-03-01",
    },
    {
      slug: "pmfby",
      name_hi: "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
      name_en: "Pradhan Mantri Fasal Bima Yojana",
      category_id: "insurance",
      category_hi: "फसल बीमा",
      benefit: "प्राकृतिक आपदाओं, कीट व रोगों से फसल नुकसान होने पर वित्तीय सुरक्षा। खरीफ में 2%, रबी में 1.5% प्रीमियम।",
      eligibility: "अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले सभी कृषक (ऋणी व गैर-ऋणी)।",
      officialLink: "https://pmfby.gov.in/",
      source: "कृषि मंत्रालय, भारत सरकार",
      updatedAt: "2026-02-28",
    },
    {
      slug: "kusum-solar-pump",
      name_hi: "पीएम कुसुम योजना (सोलर सिंचाई पंप योजना)",
      name_en: "PM KUSUM Solar Pump Scheme",
      category_id: "irrigation",
      category_hi: "सिंचाई एवं ऊर्जा",
      benefit: "कृषि कार्य हेतु 2 एचपी से 10 एचपी तक के सोलर पंप स्थापना पर 60% तक भारी सरकारी अनुदान।",
      eligibility: "उत्तर प्रदेश के पंजीकृत किसान जिनके पास सिंचाई हेतु बोरवेल उपलब्ध हो।",
      officialLink: "https://agriculture.up.gov.in/",
      source: "कृषि विभाग, उत्तर प्रदेश सरकार",
      updatedAt: "2026-03-05",
    },
    {
      slug: "up-khet-talab",
      name_hi: "उत्तर प्रदेश खेत तालाब योजना",
      name_en: "UP Khet Talab Yojana",
      category_id: "state",
      category_hi: "राज्य योजना",
      benefit: "खेत में तालाब निर्माण पर 50% अनुदान (अधिकतम ₹1,05,000 तक डीबीटी द्वारा)।",
      eligibility: "बुंदेलखंड एवं उत्तर प्रदेश के सभी जनपदों के लघु व सीमांत किसान।",
      officialLink: "https://agriculture.up.gov.in/",
      source: "कृषि विभाग, उत्तर प्रदेश सरकार",
      updatedAt: "2026-03-02",
    },
    {
      slug: "krishi-yantrikaran-token",
      name_hi: "कृषि यंत्रीकरण एवं कस्टम हायरिंग सेंटर अनुदान",
      name_en: "Farm Mechanization Subsidy",
      category_id: "subsidy",
      category_hi: "यंत्र अनुदान",
      benefit: "ट्रैक्टर चालित कृषि यंत्रों पर 40% से 50% तक सरकारी अनुदान।",
      eligibility: "उ.प्र. पारदर्शी किसान सेवा पोर्टल पर पंजीकृत किसान।",
      officialLink: "https://agriculture.up.gov.in/",
      source: "कृषि विभाग, उत्तर प्रदेश",
      updatedAt: "2026-03-01",
    },
  ];

  const allSchemes = liveSchemes.length > 0 ? liveSchemes : schemes;

  const filtered = allSchemes.filter((sc) => {
    const matchCat = category === "all" || sc.category_id === category;
    const matchSearch =
      search.trim() === "" ||
      sc.name_hi.includes(search) ||
      sc.name_en.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "सरकारी योजनाएँ" : "Government Schemes" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "केन्द्र एवं उत्तर प्रदेश सरकार की प्रमुख कृषि योजनाएँ" : "Agricultural Schemes & Subsidies"}
          subtitle={
            lang === "hi"
              ? "पात्रता, आवश्यक दस्तावेज, अनुदान की दरें एवं केवल सत्यापित आधिकारिक (.gov.in) आवेदन लिंक"
              : "Verified government schemes, farmer welfare subsidies, eligibility criteria, and official .gov.in links"
          }
        />
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 size-4 text-[#9ca3af]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "hi" ? "योजना का नाम खोजें (उदा. पीएम किसान, कुसुम, बीमा)..." : "Search scheme name (e.g. PM Kisan, Kusum)..."}
              className="w-full pl-9 pr-4 py-2 border border-[#d1d5db] rounded-lg text-sm outline-none focus:border-[#15803d]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  category === c.id
                    ? "bg-[#15803d] text-white"
                    : "bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]"
                }`}
              >
                {lang === "hi" ? c.label_hi : c.label_en}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((scheme) => (
          <Card key={scheme.slug} className="flex flex-col justify-between">
            <div>
              <CardHeader className="bg-[#f8faf5]">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg text-[#14532d] flex items-center gap-2">
                    <FileText className="size-5 text-[#15803d] shrink-0" />
                    <span>{lang === "hi" ? scheme.name_hi : scheme.name_en}</span>
                  </CardTitle>
                  <Badge variant="success" size="sm">
                    {lang === "hi" ? scheme.category_hi : (scheme.category_id === "central" ? "Central Scheme" : scheme.category_id === "insurance" ? "Crop Insurance" : scheme.category_id === "irrigation" ? "Irrigation & Solar" : scheme.category_id === "subsidy" ? "Farm Subsidy" : "State Scheme")}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-4 text-xs sm:text-sm">
                <div>
                  <strong className="text-[#14532d] block mb-0.5">
                    {lang === "hi" ? "अनुदान एवं लाभ:" : "Benefits & Subsidy:"}
                  </strong>
                  <p className="text-[#374151] bg-[#f0fdf4] p-2.5 rounded-lg border border-[#bbf7d0] leading-relaxed">
                    {scheme.benefit}
                  </p>
                </div>

                <div>
                  <strong className="text-[#14532d] block mb-0.5">
                    {lang === "hi" ? "पात्रता मानदंड:" : "Eligibility Criteria:"}
                  </strong>
                  <p className="text-[#4b5563] leading-relaxed">{scheme.eligibility}</p>
                </div>
              </CardContent>
            </div>

            <div className="p-4 bg-[#f8faf5] border-t border-[#e5e7eb] flex flex-col gap-2">
              <SourceBadge sourceName={scheme.source} updatedAt={scheme.updatedAt} />
              <div className="flex gap-2 mt-1">
                <Link
                  href={`/schemes/${scheme.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-1 border border-[#15803d] text-[#15803d] hover:bg-[#dcfce7] text-xs font-bold py-2 rounded-lg transition-colors"
                >
                  <span>{lang === "hi" ? "विस्तृत विवरण देखें" : "View Details"}</span>
                  <ChevronRight className="size-3.5" />
                </Link>
                <a
                  href={scheme.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 bg-[#15803d] hover:bg-[#14532d] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                >
                  <span>{lang === "hi" ? "आधिकारिक पोर्टल" : "Official Portal"}</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
