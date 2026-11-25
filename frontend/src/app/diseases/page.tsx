"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldAlert, Search, Filter, AlertTriangle, ChevronRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useI18n } from "@/lib/i18n";

export default function DiseasesPage() {
  const { lang } = useI18n();
  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("all");

  const diseases = [
    {
      id: "yellow-rust",
      name_hi: "पीला रतुआ",
      name_en: "Yellow Stripe Rust",
      crop_hi: "गेहूँ",
      crop_en: "Wheat",
      crop_id: "wheat",
      pathogen: "Puccinia striiformis",
      symptoms_hi: "पत्तियों की ऊपरी सतह पर पीले रंग की समानांतर धारियों के रूप में चूर्ण जैसा पाउडर दिखाई देता है। छूने पर अंगुलियों पर पीला पाउडर चिपक जाता है।",
      symptoms_en: "Yellow powdery pustules forming linear parallel stripes on leaf surface. Stunted plants and shriveled grains.",
      prevention_hi: "रतुआ रोधी किस्में (डीबीडब्ल्यू 187, डीबीडब्ल्यू 303, एचडी 3226) लगाएं। अत्यधिक यूरिया प्रयोग से बचें।",
      prevention_en: "Sow resistant cultivars (DBW 187, DBW 303, HD 3226). Avoid excess basal or top-dress nitrogen.",
      management_hi: "प्रारंभिक लक्षण दिखते ही प्रोपिकोनाजोल 25% ईसी (1 मिली प्रति लीटर पानी) का 15 दिन के अंतराल पर छिड़काव करें।",
      management_en: "At initial symptom onset, spray Propiconazole 25% EC @ 1 ml/L water in 200 L water per acre.",
      source_hi: "एनडीयूएटी पादप रोग विभाग",
      source_en: "NDUAT Department of Plant Pathology",
      updatedAt: "2026-03-01",
    },
    {
      id: "blight-paddy",
      name_hi: "जीवाणु झुलसा रोग",
      name_en: "Bacterial Leaf Blight",
      crop_hi: "धान",
      crop_en: "Paddy",
      crop_id: "paddy",
      pathogen: "Xanthomonas oryzae",
      symptoms_hi: "पत्तियों के किनारों से नोक की ओर पीलापन और बाद में भूरा सूखापन फैलना, पत्तियों के किनारे लहरदार हो जाना।",
      symptoms_en: "Water-soaked to yellowish-green wavy lesions starting from leaf tips and margins, drying inwards rapidly.",
      prevention_hi: "बीज को स्ट्रेप्टोसाइक्लिन (1 ग्राम) + थीरम/बाविस्टिन (20 ग्राम) के घोल में 25 किग्रा बीज उपचारित करें। संतुलित पोटाश का प्रयोग करें।",
      prevention_en: "Treat seed with Streptocycline (1g) + Thiram (20g) per 25 kg seed. Ensure balanced potash application.",
      management_hi: "खेत से तुरंत अतिरिक्त पानी निकालें। स्ट्रेप्टोसाइक्लिन 15 ग्राम + कॉपर ऑक्सीक्लोराइड 500 ग्राम प्रति हेक्टेयर छिड़कें।",
      management_en: "Drain excess standing water. Spray Streptocycline 15g + Copper Oxychloride 500g per hectare.",
      source_hi: "एनडीयूएटी प्रसार निदेशालय",
      source_en: "NDUAT Directorate of Extension",
      updatedAt: "2026-03-05",
    },
    {
      id: "white-rust-mustard",
      name_hi: "सफेद रतुआ (छाछिया)",
      name_en: "White Rust",
      crop_hi: "सरसों",
      crop_en: "Mustard",
      crop_id: "mustard",
      pathogen: "Albugo candida",
      symptoms_hi: "पत्तियों की निचली सतह पर सफेद या हल्के पीले उभरे हुए फफोले दिखाई देना तथा पुष्पक्रम का विकृत होना।",
      symptoms_en: "Raised chalky white pustules on abaxial leaf surfaces. Malformation of inflorescence (stag-head).",
      prevention_hi: "अक्टूबर के प्रथम पखवाड़े में समय से बुवाई करें। मेटालेक्सिल (6 ग्राम/किग्रा) से बीजोपचार अनिवार्य करें।",
      prevention_en: "Complete timely sowing before mid-October. Treat seeds with Metalaxyl @ 6g/kg seed.",
      management_hi: "मैनकोजेब 75% डब्ल्यूपी (2 ग्राम प्रति लीटर पानी) का 15 दिन के अंतराल पर 2 बार छिड़काव करें।",
      management_en: "Foliar spray of Mancozeb 75% WP @ 2g/L or Ridomil MZ @ 2g/L at 15-day intervals.",
      source_hi: "आईसीएआर-डीआरएमआर / एनडीयूएटी",
      source_en: "ICAR-DRMR / NDUAT",
      updatedAt: "2026-02-25",
    },
    {
      id: "red-rot-sugarcane",
      name_hi: "लाल सड़न रोग",
      name_en: "Red Rot",
      crop_hi: "गन्ना",
      crop_en: "Sugarcane",
      crop_id: "sugarcane",
      pathogen: "Colletotrichum falcatum",
      symptoms_hi: "तीसरी-चौथी पत्ती सूखना, तना फाड़ने पर बीच में लाल रंग का गूदा व सफेद आड़े धब्बे दिखना, सिरके जैसी गंध आना।",
      symptoms_en: "Yellowing and wilting of top leaves. Splitting stem reveals blood-red pith with white transverse patches and sour smell.",
      prevention_hi: "रोगमुक्त स्वस्थ बीज का चयन करें। ट्राइकोडर्मा विरिडी से मृदा उपचार करें। ग्रसित खेतों में पेड़ी फसल न रखें।",
      prevention_en: "Use certified disease-free setts. Soil application of Trichoderma viride. Avoid ratoon crops in infested plots.",
      management_hi: "प्रभावित थानों को उखाड़कर नष्ट करें। खेत में तुरंत जल निकासी सुनिश्चित करें।",
      management_en: "Rogue out and burn affected clumps immediately. Ensure field drainage to arrest fungal dissemination.",
      source_hi: "उ.प्र. गन्ना शोध परिषद / एनडीयूएटी",
      source_en: "UP Council of Sugarcane Research / NDUAT",
      updatedAt: "2026-03-02",
    },
    {
      id: "early-blight-potato",
      name_hi: "अगेती झुलसा",
      name_en: "Early Blight",
      crop_hi: "आलू / टमाटर",
      crop_en: "Potato / Tomato",
      crop_id: "potato",
      pathogen: "Alternaria solani",
      symptoms_hi: "निचली पत्तियों पर गोल-गोल कत्थई रंग के छल्लेदार धब्बे (टारगेट बोर्ड लक्षण) बनना और पत्तियों का सूखना।",
      symptoms_en: "Concentric brown-black circular rings (target-board spots) appearing initially on lower mature leaves.",
      prevention_hi: "प्रमाणित रोगमुक्त कंद बोएं। फसल चक्र अपनाएं और आवश्यकतानुसार पोटाश का प्रयोग करें।",
      prevention_en: "Plant certified disease-free tubers. Maintain crop rotation and adequate potassium nutrition.",
      management_hi: "मैनकोजेब 75% डब्ल्यूपी (2.5 ग्राम प्रति लीटर) अथवा प्रोपिनेब का 10-12 दिन के अंतराल पर छिड़काव करें।",
      management_en: "Spray Mancozeb 75% WP @ 2.5 g/L or Propineb 70% WP @ 2 g/L at 10-12 day intervals.",
      source_hi: "एनडीयूएटी सब्जी विज्ञान विभाग",
      source_en: "NDUAT Department of Vegetable Science",
      updatedAt: "2026-03-08",
    },
  ];

  const filtered = diseases.filter((d) => {
    const matchCrop = cropFilter === "all" || d.crop_id === cropFilter;
    const q = search.toLowerCase().trim();
    const matchSearch =
      q === "" ||
      d.name_hi.includes(q) ||
      d.name_en.toLowerCase().includes(q) ||
      d.crop_hi.includes(q) ||
      d.crop_en.toLowerCase().includes(q);
    return matchCrop && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "फसल रोग प्रबंधन" : "Crop Disease Management" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "फसल रोग पहचान एवं वैज्ञानिक प्रबंधन" : "Crop Disease Directory & Management"}
          subtitle={
            lang === "hi"
              ? "उत्तर प्रदेश की प्रमुख फसलों में लगने वाले कवक, जीवाणु एवं विषाणु जनित रोगों के वैज्ञानिक लक्षण व अनुशंसित उपचार"
              : "Scientifically reviewed disease symptoms, causes, prevention, and expert-approved treatment methods"
          }
        />
      </div>

      {/* Visual Disease Identification Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative rounded-2xl overflow-hidden h-40 border border-[#e5e7eb] shadow-xs group">
          <img
            src="/pests/yellow-rust.jpg"
            alt="Yellow Rust"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
            <span className="text-[10px] font-bold bg-[#ca8a04] px-2 py-0.5 rounded uppercase self-start mb-1">
              {lang === "hi" ? "फंगल रोग" : "Fungal Rust"}
            </span>
            <h4 className="font-extrabold text-base">
              {lang === "hi" ? "गेहूँ में पीला रतुआ पहचान" : "Yellow Stripe Rust Identification"}
            </h4>
            <p className="text-xs text-white/80 line-clamp-1">
              {lang === "hi" ? "पत्तियों पर पीली धारियां व पाउडर दिखते ही प्रोपिकोनाजोल का प्रयोग करें" : "Timely fungicide spraying halts rapid aerial spore dissemination"}
            </p>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden h-40 border border-[#e5e7eb] shadow-xs group">
          <img
            src="/pests/plant-disease.jpg"
            alt="Bacterial Blight"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
            <span className="text-[10px] font-bold bg-[#b91c1c] px-2 py-0.5 rounded uppercase self-start mb-1">
              {lang === "hi" ? "जीवाणु झुलसा" : "Bacterial Blight"}
            </span>
            <h4 className="font-extrabold text-base">
              {lang === "hi" ? "धान व सब्जियों में झुलसा रोग प्रबंधन" : "Bacterial Blight in Paddy & Veggies"}
            </h4>
            <p className="text-xs text-white/80 line-clamp-1">
              {lang === "hi" ? "बीजोपचार एवं स्ट्रेप्टोसाइक्लिन के प्रयोग से शत-प्रतिशत सुरक्षा" : "Seed treatment with bactericide protects seedlings from wilting"}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 size-4 text-[#9ca3af]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "hi" ? "रोग अथवा फसल का नाम खोजें..." : "Search disease or crop..."}
            className="w-full pl-9 pr-4 py-2 border border-[#d1d5db] rounded-lg text-sm outline-none focus:border-[#15803d]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-[#6b7280]" />
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="bg-[#f8faf5] border border-[#d1d5db] text-xs sm:text-sm font-semibold rounded-lg px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">{lang === "hi" ? "सभी फसलें" : "All Crops"}</option>
            <option value="wheat">{lang === "hi" ? "गेहूँ" : "Wheat"}</option>
            <option value="paddy">{lang === "hi" ? "धान" : "Paddy"}</option>
            <option value="mustard">{lang === "hi" ? "सरसों" : "Mustard"}</option>
            <option value="sugarcane">{lang === "hi" ? "गन्ना" : "Sugarcane"}</option>
            <option value="potato">{lang === "hi" ? "आलू / टमाटर" : "Potato / Tomato"}</option>
          </select>
        </div>
      </div>

      {/* Disease Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((dis) => (
          <Card key={dis.id} className="flex flex-col justify-between">
            <div>
              <CardHeader className="bg-[#fef2f2] border-b border-[#fee2e2]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-[#991b1b] flex items-center gap-1.5">
                      <ShieldAlert className="size-5 text-[#dc2626] shrink-0" />
                      <span>{lang === "hi" ? dis.name_hi : dis.name_en}</span>
                    </CardTitle>
                    <p className="text-xs italic text-[#7f1d1d] pl-6 mt-0.5">
                      {lang === "hi" ? "रोगजनक कारक: " : "Pathogen: "}{dis.pathogen}
                    </p>
                  </div>
                  <Badge variant="danger" size="sm">
                    {lang === "hi" ? `फसल: ${dis.crop_hi}` : `Crop: ${dis.crop_en}`}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-4 text-xs sm:text-sm">
                <div>
                  <strong className="text-[#14532d] block mb-0.5">
                    {lang === "hi" ? "प्रमुख लक्षण:" : "Diagnostic Symptoms:"}
                  </strong>
                  <p className="text-[#374151] bg-[#f8faf5] p-2.5 rounded-lg border border-[#e5e7eb] leading-relaxed">
                    {lang === "hi" ? dis.symptoms_hi : dis.symptoms_en}
                  </p>
                </div>

                <div>
                  <strong className="text-[#15803d] block mb-0.5">
                    {lang === "hi" ? "जैविक व सस्य रोकथाम:" : "Agronomic & Bio-Prevention:"}
                  </strong>
                  <p className="text-[#374151] leading-relaxed">
                    {lang === "hi" ? dis.prevention_hi : dis.prevention_en}
                  </p>
                </div>

                <div>
                  <strong className="text-[#b91c1c] block mb-0.5">
                    {lang === "hi" ? "वैज्ञानिक रासायनिक प्रबंधन (यदि आवश्यक हो):" : "Chemical Recommendation (If Required):"}
                  </strong>
                  <p className="text-[#374151] bg-[#fffbeb] p-2.5 rounded-lg border border-[#fef3c7] leading-relaxed">
                    {lang === "hi" ? dis.management_hi : dis.management_en}
                  </p>
                </div>
              </CardContent>
            </div>

            <div className="p-4 bg-[#f8faf5] border-t border-[#e5e7eb]">
              <SourceBadge
                sourceName={lang === "hi" ? dis.source_hi : dis.source_en}
                updatedAt={dis.updatedAt}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
