"use client";

import React, { useState } from "react";
import { BookOpen, Sprout, Fish, Milk, Flower, Wheat, Search, ChevronRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { useI18n } from "@/lib/i18n";

export default function KnowledgePage() {
  const { lang } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");

  const domains = [
    {
      id: "organic",
      title_hi: "जैविक एवं प्राकृतिक खेती",
      title_en: "Organic & Natural Farming",
      image: "https://images.unsplash.com/photo-1592417817098-8f3d6ef231e2?w=700&auto=format&fit=crop&q=80",
      desc_hi: "जीवामृत, बीजामृत, घनजीवामृत निर्माण एवं शून्य बजट प्राकृतिक खेती (ZBNF) की वैज्ञानिक विधि।",
      desc_en: "Scientific techniques for Jeevamrit, Beejamrit, organic compost, and Zero Budget Natural Farming (ZBNF).",
      articlesCount_hi: "12 वैज्ञानिक लेख",
      articlesCount_en: "12 Bulletins",
      tag_hi: "प्राकृतिक खेती",
      tag_en: "Eco Farming",
    },
    {
      id: "horticulture",
      title_hi: "उद्यान एवं फल-सब्जी उत्पादन",
      title_en: "Horticulture & Vegetable Production",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=700&auto=format&fit=crop&q=80",
      desc_hi: "आम, अमरूद, आंवला बागवानी एवं संरक्षित खेती (पॉलीहाउस/शेडनेट) में बेमौसम सब्जी उत्पादन।",
      desc_en: "Commercial orcharding for mango, guava, and off-season greenhouse polyhouse vegetable cultivation.",
      articlesCount_hi: "18 वैज्ञानिक लेख",
      articlesCount_en: "18 Bulletins",
      tag_hi: "बागवानी",
      tag_en: "Horticulture",
    },
    {
      id: "dairy",
      title_hi: "डेयरी फार्मिंग एवं पशुपालन",
      title_en: "Dairy Farming & Livestock",
      image: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=700&auto=format&fit=crop&q=80",
      desc_hi: "उन्नत नस्लें (साहीवाल, मुर्राह), संतुलित पशु आहार (TMR), साइलेज निर्माण एवं टीकाकरण कैलेंडर।",
      desc_en: "High-yield breeds (Sahiwal, Murrah), Total Mixed Ration (TMR), silage making, and vaccination schedules.",
      articlesCount_hi: "15 वैज्ञानिक लेख",
      articlesCount_en: "15 Bulletins",
      tag_hi: "पशुपालन",
      tag_en: "Livestock",
    },
    {
      id: "fisheries",
      title_hi: "मत्स्य पालन एवं जलकृषि",
      title_en: "Fisheries & Aquaculture",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&auto=format&fit=crop&q=80",
      desc_hi: "तालाब निर्माण, मिश्रित मत्स्य पालन (रोहू, कतला, नैन), बायोफ्लॉक एवं प्रधानमंत्री मत्स्य संपदा योजना।",
      desc_en: "Fish pond engineering, polyculture (Rohu, Catla, Mrigal), Biofloc systems, and PM Matsya Sampada Yojana.",
      articlesCount_hi: "9 वैज्ञानिक लेख",
      articlesCount_en: "9 Bulletins",
      tag_hi: "मत्स्य पालन",
      tag_en: "Aquaculture",
    },
    {
      id: "beekeeping",
      title_hi: "मधुमक्खी पालन (मौन पालन)",
      title_en: "Beekeeping & Apiculture",
      image: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?w=700&auto=format&fit=crop&q=80",
      desc_hi: "एपिस मेलिफेरा मधुमक्खी पालन, मौन पेटिका प्रबंधन, शहद निष्कासन एवं फसल परागण में भारी लाभ।",
      desc_en: "Apis mellifera hive management, seasonal honey extraction, and enhanced crop pollination yield benefits.",
      articlesCount_hi: "8 वैज्ञानिक लेख",
      articlesCount_en: "8 Bulletins",
      tag_hi: "मौन पालन",
      tag_en: "Apiculture",
    },
    {
      id: "mushroom",
      title_hi: "मशरूम उत्पादन तकनीक",
      title_en: "Mushroom Cultivation",
      image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=700&auto=format&fit=crop&q=80",
      desc_hi: "बटन, ढ़ींगरी (ओएस्टर) एवं दुधिया मशरूम उत्पादन विधि, कम्पोस्ट निर्माण एवं आधुनिक विपणन।",
      desc_en: "White button, oyster, and milky mushroom growing practices, substrate compost, and direct marketing.",
      articlesCount_hi: "11 वैज्ञानिक लेख",
      articlesCount_en: "11 Bulletins",
      tag_hi: "मशरूम",
      tag_en: "Mushrooms",
    },
  ];

  const filtered = domains.filter((d) => {
    const q = searchTerm.toLowerCase();
    const title = lang === "hi" ? d.title_hi : d.title_en;
    const desc = lang === "hi" ? d.desc_hi : d.desc_en;
    return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "कृषि ज्ञान केंद्र" : "Knowledge Center" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "डिजिटल कृषि ज्ञान एवं अनुसंधान केंद्र" : "Agricultural Knowledge Hub"}
          subtitle={
            lang === "hi"
              ? "प्राकृतिक खेती, बागवानी, डेयरी, पशुपालन, मौन पालन व मशरूम उत्पादन पर प्रामाणिक वैज्ञानिक मार्गदर्शिकाएँ"
              : "Peer-reviewed scientific practices, package of practices, and production manuals from NDUAT"
          }
        />
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-2.5 size-4 text-[#9ca3af]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={lang === "hi" ? "विषय अथवा कृषि विधा खोजें..." : "Search topics or farming disciplines..."}
          className="w-full pl-9 pr-4 py-2 border border-[#d1d5db] rounded-xl text-xs sm:text-sm bg-white outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d]"
        />
      </div>

      {/* Grid of Knowledge Cards with Authentic Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filtered.map((dom) => (
          <div
            key={dom.id}
            className="group bg-white rounded-2xl border border-[#e5e7eb] hover:border-[#86efac] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Image Banner */}
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                <img
                  src={dom.image}
                  alt={lang === "hi" ? dom.title_hi : dom.title_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#15803d] text-white shadow-xs">
                    {lang === "hi" ? dom.tag_hi : dom.tag_en}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-xs font-semibold drop-shadow-sm">
                    {lang === "hi" ? dom.articlesCount_hi : dom.articlesCount_en}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/30">
                    <CheckCircle2 className="size-3 text-emerald-300" />
                    {lang === "hi" ? "सत्यापित" : "Verified"}
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-5">
                <h3 className="text-base sm:text-lg font-bold text-[#14532d] mb-2 group-hover:text-[#15803d] transition-colors">
                  {lang === "hi" ? dom.title_hi : dom.title_en}
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  {lang === "hi" ? dom.desc_hi : dom.desc_en}
                </p>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="p-4 bg-[#f8faf5] border-t border-[#e5e7eb] flex items-center justify-between">
              <span className="text-[11px] text-[#15803d] font-bold">
                {lang === "hi" ? "एनडीयूएटी अनुमोदित" : "NDUAT Certified"}
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#15803d] hover:text-[#14532d] transition-colors cursor-pointer"
              >
                <span>{lang === "hi" ? "विस्तृत मार्गदर्शिका पढ़ें" : "Read Full Guide"}</span>
                <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <SourceBadge
        sourceName={
          lang === "hi"
            ? "एनडीयूएटी विस्तार शिक्षा निदेशालय, कुमारगंज, अयोध्या"
            : "NDUAT Directorate of Extension Education, Kumarganj, Ayodhya"
        }
        updatedAt="2026-03-01"
      />
    </div>
  );
}
