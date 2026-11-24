"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sprout, Search, Filter, Calendar, MapPin, ChevronRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useI18n } from "@/lib/i18n";

export default function CropsPage() {
  const { lang } = useI18n();
  const [activeSeason, setActiveSeason] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [liveCrops, setLiveCrops] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/v1/crops?page_size=50")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          const mapped = data.items.map((c: any) => ({
            slug: c.slug,
            name_hi: c.name_hi,
            name_en: c.name_en,
            botanical: c.botanical || "",
            category_hi: c.category_hi || "अनाज",
            category_en: c.category_en || "Cereals",
            category_id: c.category || "cereal",
            season_hi: c.season_hi || "रबी",
            season_en: c.season_en || "Rabi",
            season_id: Array.isArray(c.seasons) ? c.seasons[0] : "rabi",
            duration: c.duration || "120 दिन",
            sowing: c.sowing_period || "समय से बुवाई",
            zones: ["समस्त उत्तर प्रदेश"],
            summary_hi: c.suitable_climate || "",
            summary_en: "",
            source: c.source || "NDUAT कुमारगंज",
            updatedAt: "2026-11-22",
          }));
          setLiveCrops(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const seasons = [
    { id: "all", label_hi: "सभी मौसम", label_en: "All Seasons" },
    { id: "kharif", label_hi: "खरीफ", label_en: "Kharif" },
    { id: "rabi", label_hi: "रबी", label_en: "Rabi" },
    { id: "zaid", label_hi: "जायद", label_en: "Zaid" },
  ];

  const categories = [
    { id: "all", label_hi: "सभी श्रेणियां", label_en: "All Categories" },
    { id: "cereal", label_hi: "अनाज", label_en: "Cereals" },
    { id: "pulse", label_hi: "दलहन", label_en: "Pulses" },
    { id: "oilseed", label_hi: "तिलहन", label_en: "Oilseeds" },
    { id: "vegetable", label_hi: "सब्जियां", label_en: "Vegetables" },
    { id: "fruit", label_hi: "फल", label_en: "Fruits" },
    { id: "commercial", label_hi: "व्यावसायिक", label_en: "Commercial" },
  ];

  const sampleCrops = [
    {
      slug: "gehu-sample",
      name_hi: "गेहूँ",
      name_en: "Wheat",
      botanical: "Triticum aestivum",
      category_hi: "अनाज",
      category_en: "Cereals",
      category_id: "cereal",
      season_hi: "रबी",
      season_en: "Rabi",
      season_id: "rabi",
      duration: "115-130 दिन",
      sowing: "15 नवम्बर - 15 दिसम्बर",
      zones: ["पूर्वी मैदानी क्षेत्र", "मध्य क्षेत्र"],
      summary_hi: "उ.प्र. की प्रमुख खाद्यान्न रबी फसल। समशीतोष्ण जलवायु, दोमट व बलुई दोमट मिट्टी उपयुक्त।",
      summary_en: "Major food grain Rabi crop of UP. Requires temperate climate and loamy soil.",
      source: "NDUAT / Directorate of Extension",
      updatedAt: "2026-03-15",
    },
    {
      slug: "dhan-sample",
      name_hi: "धान",
      name_en: "Paddy / Rice",
      botanical: "Oryza sativa",
      category_hi: "अनाज",
      category_en: "Cereals",
      category_id: "cereal",
      season_hi: "खरीफ",
      season_en: "Kharif",
      season_id: "kharif",
      duration: "120-140 दिन",
      sowing: "15 जून - 15 जुलाई",
      zones: ["समस्त उत्तर प्रदेश"],
      summary_hi: "खरीफ मौसम की मुख्य खाद्यान्न फसल। गर्म व नम जलवायु, मटियार दोमट भूमि सर्वोत्तम।",
      summary_en: "Main staple food crop of Kharif season. Requires warm and humid climate.",
      source: "NDUAT / Directorate of Extension",
      updatedAt: "2026-03-10",
    },
    {
      slug: "arhar-sample",
      name_hi: "अरहर (तूर)",
      name_en: "Pigeon Pea",
      botanical: "Cajanus cajan",
      category_hi: "दलहन",
      category_en: "Pulses",
      category_id: "pulse",
      season_hi: "खरीफ",
      season_en: "Kharif",
      season_id: "kharif",
      duration: "150-180 दिन",
      sowing: "जून का दूसरा पखवाड़ा",
      zones: ["बुंदेलखंड", "पूर्वी उ.प्र."],
      summary_hi: "प्रमुख दलहनी फसल जो मिट्टी में नाइट्रोजन स्थिरीकरण कर उर्वरता बढ़ाती है।",
      summary_en: "Major pulse crop that enriches soil through atmospheric nitrogen fixation.",
      source: "ICAR-IIPR / NDUAT",
      updatedAt: "2026-02-28",
    },
    {
      slug: "sarson-sample",
      name_hi: "सरसों / राई",
      name_en: "Mustard",
      botanical: "Brassica juncea",
      category_hi: "तिलहन",
      category_en: "Oilseeds",
      category_id: "oilseed",
      season_hi: "रबी",
      season_en: "Rabi",
      season_id: "rabi",
      duration: "105-125 दिन",
      sowing: "अक्टूबर प्रथम पखवाड़ा",
      zones: ["पश्चिमी उ.प्र.", "मध्य क्षेत्र"],
      summary_hi: "रबी मौसम की सबसे महत्वपूर्ण तिलहनी फसल। कम सिंचाई में उत्तम पैदावार।",
      summary_en: "Prominent oilseed crop of Rabi requiring low irrigation.",
      source: "NDUAT Directorate of Research",
      updatedAt: "2026-03-01",
    },
    {
      slug: "ganna-sample",
      name_hi: "गन्ना",
      name_en: "Sugarcane",
      botanical: "Saccharum officinarum",
      category_hi: "व्यावसायिक",
      category_en: "Commercial",
      category_id: "commercial",
      season_hi: "वार्षिक",
      season_en: "Annual",
      season_id: "kharif",
      duration: "10-12 माह",
      sowing: "फरवरी-मार्च (वसंतकालीन) / अक्टूबर (शरदकालीन)",
      zones: ["तराई क्षेत्र", "पश्चिमी उ.प्र."],
      summary_hi: "उत्तर प्रदेश की प्रमुख व्यावसायिक नकदी फसल। ट्रेंच विधि से बुवाई अधिक लाभदायक।",
      summary_en: "Key cash commercial crop of Uttar Pradesh.",
      source: "UP Council of Sugarcane Research / NDUAT",
      updatedAt: "2026-03-05",
    },
    {
      slug: "moong-sample",
      name_hi: "मूंग",
      name_en: "Green Gram",
      botanical: "Vigna radiata",
      category_hi: "दलहन",
      category_en: "Pulses",
      category_id: "pulse",
      season_hi: "जायद",
      season_en: "Zaid",
      season_id: "zaid",
      duration: "60-65 दिन",
      sowing: "मार्च से अप्रैल",
      zones: ["समस्त उत्तर प्रदेश"],
      summary_hi: "गेहूँ कटाई के बाद जायद में ली जाने वाली 60 दिन की अल्पावधि दलहनी फसल।",
      summary_en: "Short duration (60-day) summer pulse crop suitable post-wheat harvest.",
      source: "NDUAT Extension Bulletin",
      updatedAt: "2026-03-12",
    },
  ];

  const allCrops = liveCrops.length > 0 ? liveCrops : sampleCrops;

  const filteredCrops = allCrops.filter((crop) => {
    const matchSeason = activeSeason === "all" || crop.season_id === activeSeason;
    const matchCategory = activeCategory === "all" || crop.category_id === activeCategory;
    const matchSearch =
      search.trim() === "" ||
      crop.name_hi.includes(search) ||
      crop.name_en.toLowerCase().includes(search.toLowerCase());
    return matchSeason && matchCategory && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "फसल जानकारी" : "Crop Information" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "उत्तर प्रदेश फसल मार्गदर्शिका" : "Uttar Pradesh Crop Guide"}
          subtitle={
            lang === "hi"
              ? "एनडीयूएटी एवं कृषि वैज्ञानिकों द्वारा अनुशंसित फसल पैकेज, बुवाई समय, उपयुक्त किस्में एवं उन्नत तकनीक"
              : "Scientifically verified crop management packages, suitable varieties, and agronomic practices by NDUAT"
          }
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#e5e7eb] shadow-xs mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 size-4 text-[#9ca3af]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "hi" ? "फसल का नाम खोजें (उदा. गेहूँ, धान, सरसों)..." : "Search crop by name..."}
              className="w-full pl-9 pr-4 py-2 border border-[#d1d5db] rounded-lg text-sm outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {seasons.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSeason(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSeason === s.id
                    ? "bg-[#15803d] text-white shadow-xs"
                    : "bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]"
                }`}
              >
                {lang === "hi" ? s.label_hi : s.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#f3f4f6]">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                activeCategory === c.id
                  ? "bg-[#dcfce7] text-[#14532d] border border-[#86efac]"
                  : "bg-white text-[#4b5563] border border-[#e5e7eb] hover:bg-[#f9fafb]"
              }`}
            >
              {lang === "hi" ? c.label_hi : c.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <Card key={crop.slug} className="flex flex-col justify-between">
            <div>
              <CardHeader className="bg-gradient-to-r from-[#f0fdf4] to-white">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="size-10 rounded-lg bg-[#15803d] text-white flex items-center justify-center font-bold">
                      <Sprout className="size-5" />
                    </div>
                    <div>
                      <CardTitle>{crop.name_hi} ({crop.name_en})</CardTitle>
                      <p className="text-[11px] italic text-[#6b7280]">{crop.botanical}</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">{crop.season_hi}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-4">
                <p className="text-xs sm:text-sm text-[#374151] leading-relaxed">
                  {lang === "hi" ? crop.summary_hi : crop.summary_en}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#f8faf5] p-3 rounded-lg border border-[#e5e7eb]">
                  <div>
                    <span className="text-[#6b7280] block">बुवाई समय:</span>
                    <span className="font-semibold text-[#14532d]">{crop.sowing}</span>
                  </div>
                  <div>
                    <span className="text-[#6b7280] block">फसल अवधि:</span>
                    <span className="font-semibold text-[#14532d]">{crop.duration}</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#4b5563]">
                  <span className="font-semibold text-[#14532d]">उपयुक्त क्षेत्र: </span>
                  {crop.zones.join(", ")}
                </div>
              </CardContent>
            </div>

            <div className="p-4 bg-[#f8faf5] border-t border-[#e5e7eb] flex flex-col gap-2">
              <SourceBadge sourceName={crop.source} updatedAt={crop.updatedAt} />
              <Link
                href={`/crops/${crop.slug}`}
                className="mt-1 w-full inline-flex items-center justify-center gap-1.5 bg-[#15803d] hover:bg-[#14532d] text-white text-xs sm:text-sm font-bold py-2 rounded-lg transition-colors"
              >
                <span>{lang === "hi" ? "सम्पूर्ण पैकेज एवं उन्नत विधियाँ देखें" : "View Full Advisory Package"}</span>
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#e5e7eb] rounded-xl my-6">
          <Sprout className="size-12 text-[#9ca3af] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#14532d]">
            {lang === "hi" ? "कोई फसल नहीं मिली" : "No crops match your filter"}
          </h3>
          <p className="text-sm text-[#6b7280] mt-1">
            {lang === "hi" ? "कृपया अन्य फ़िल्टर अथवा खोज शब्द का चयन करें।" : "Try clearing your search or season filters."}
          </p>
        </div>
      )}
    </div>
  );
}
