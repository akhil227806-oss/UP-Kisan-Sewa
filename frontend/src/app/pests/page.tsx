"use client";

import React, { useState } from "react";
import { Bug, Search, Filter, ShieldCheck, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useI18n } from "@/lib/i18n";

export default function PestsPage() {
  const { lang } = useI18n();
  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("all");

  const pests = [
    {
      id: "stem-borer-paddy",
      name_hi: "पीला तना छेदक",
      name_en: "Yellow Stem Borer",
      crop_hi: "धान",
      crop_en: "Paddy",
      crop_id: "paddy",
      scientific: "Scirpophaga incertulas",
      damage_hi: "वानस्पतिक अवस्था में 'डेड हार्ट' तथा बाली निकलते समय 'सफेद बाली'।",
      damage_en: "Causes 'Dead Heart' in vegetative stage and 'White Earhead' at panicle emergence.",
      ipm_hi: "फेरोमोन ट्रैप 5 प्रति एकड़ लगाएं। ट्राइकोग्रामा जैपोनिकम परजीवी कार्ड 1 लाख प्रति हेक्टेयर छोड़ें। प्रकाश प्रपंच (Light Trap) का उपयोग करें।",
      ipm_en: "Install 5 pheromone traps per acre. Release Trichogramma japonicum @ 100,000/ha. Use solar light traps.",
      chemical_hi: "आर्थिक क्षति स्तर (ETL 5% डेड हार्ट) पार होने पर क्लोरेंट्रानिलिप्रोल 0.4% जीआर (4 किग्रा/एकड़) या कारबोफ्यूरान 3जी का उपयोग।",
      chemical_en: "Apply Chlorantraniliprole 0.4% GR @ 4 kg/acre or Cartap hydrochloride 4G at economic threshold (ETL 5%).",
      source_hi: "एनडीयूएटी कीट विज्ञान विभाग",
      source_en: "NDUAT Department of Entomology",
      updatedAt: "2026-03-01",
    },
    {
      id: "aphid-mustard",
      name_hi: "माहू (चेपा कीट)",
      name_en: "Mustard Aphid",
      crop_hi: "सरसों",
      crop_en: "Mustard",
      crop_id: "mustard",
      scientific: "Lipaphis erysimi",
      damage_hi: "फूल एवं फलियां बनते समय जनवरी-फरवरी में पौधे की कोमल टहनियों व पत्तियों से रस चूसकर पौधे को कमजोर करना।",
      damage_en: "Nymphs and adults suck sap from tender shoots, inflorescence, and pods, severely reducing oil content.",
      ipm_hi: "पीले चिपचिपे कार्ड 10-12 प्रति एकड़ लगाएं। लेडीबर्ड बीटल (मित्र कीट) का संरक्षण करें। 5% नीम तेल (नीमबाण) का छिड़काव करें।",
      ipm_en: "Erect yellow sticky traps @ 10-12/acre. Conserve Ladybird beetle predators. Spray 5% Neem seed kernel extract.",
      chemical_hi: "प्रकोप अधिक होने पर इमिडाक्लोप्रिड 17.8% एसएल (1 मिली प्रति 3 लीटर पानी) में घोलकर छिड़कें।",
      chemical_en: "If infestation exceeds 25 aphids/plant, spray Imidacloprid 17.8% SL (1 ml / 3L water).",
      source_hi: "आईसीएआर-डीआरएमआर / एनडीयूएटी",
      source_en: "ICAR-DRMR / NDUAT",
      updatedAt: "2026-02-28",
    },
    {
      id: "pod-borer-chickpea",
      name_hi: "चना फली छेदक",
      name_en: "Gram Pod Borer",
      crop_hi: "चना / अरहर",
      crop_en: "Chickpea / Pigeon Pea",
      crop_id: "pulse",
      scientific: "Helicoverpa armigera",
      damage_hi: "सूंडी फलियों में छेद करके अपना आधा शरीर अंदर डालकर दानों को खा जाती है।",
      damage_en: "Caterpillars bore circular holes in developing pods and feed voraciously on seeds.",
      ipm_hi: "खेत में 'टी' आकार की खूंटियां 15-20 प्रति एकड़ लगाएं ताकि चिड़ियां सूंडी खा सकें। एचएएनपीवी (HaNPV) 250 एलई का छिड़काव करें।",
      ipm_en: "Install 15-20 T-perches per acre for predatory birds. Spray HaNPV @ 250 LE/ha in evening hours.",
      chemical_hi: "ईटीएल (1-2 सूंडी प्रति मीटर पंक्ति) पर एमामेक्टिन बेंजोएट 5% एसजी 80 ग्राम प्रति एकड़ 150 लीटर पानी में छिड़कें।",
      chemical_en: "Apply Emamectin Benzoate 5% SG @ 80 g/acre in 150 L water when pest crosses 1 larva/meter row.",
      source_hi: "एनडीयूएटी दलहन अनुभाग",
      source_en: "NDUAT Pulses Section",
      updatedAt: "2026-03-04",
    },
    {
      id: "top-borer-sugarcane",
      name_hi: "गन्ना चोटी बेधक",
      name_en: "Sugarcane Top Borer",
      crop_hi: "गन्ना",
      crop_en: "Sugarcane",
      crop_id: "sugarcane",
      scientific: "Scirpophaga excerptalis",
      damage_hi: "मध्य शिरा में छेद करना, अगोला सूखना और गुच्छेदार शीर्ष (Bunchy top) बनना।",
      damage_en: "Larvae bore into midrib of emerging spindle leaf, producing deadhearts and bunchy top formation.",
      ipm_hi: "अंड परजीवी ट्राइकोग्रामा चिलोनीस का प्रयोग। ग्रसित शीर्षों को काटकर नष्ट करना।",
      ipm_en: "Release egg parasitoid Trichogramma chilonis. Collect and rogue out affected top clusters.",
      chemical_hi: "तीसरी पीढ़ी के प्रकोप समय जून के अंत में क्लोरेंट्रानिलिप्रोल 18.5% एससी 150 मिली प्रति एकड़ जड़ों के पास ड्रेन्चिंग करें।",
      chemical_en: "Soil drenching with Chlorantraniliprole 18.5% SC @ 150 ml/acre along root zone in late June.",
      source_hi: "उ.प्र. गन्ना शोध संस्थान / एनडीयूएटी",
      source_en: "UP Council of Sugarcane Research / NDUAT",
      updatedAt: "2026-03-02",
    },
  ];

  const filtered = pests.filter((p) => {
    const matchCrop = cropFilter === "all" || p.crop_id === cropFilter;
    const matchSearch =
      search.trim() === "" ||
      p.name_hi.includes(search) ||
      p.name_en.toLowerCase().includes(search.toLowerCase()) ||
      p.crop_hi.includes(search);
    return matchCrop && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "कीट नियंत्रण" : "Pest Management" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "एकीकृत कीट प्रबंधन (IPM) मार्गदर्शिका" : "Integrated Pest Management (IPM)"}
          subtitle={
            lang === "hi"
              ? "रासायनिक दवाओं से पूर्व जैविक व मित्र कीटों की सुरक्षा एवं आर्थिक क्षति स्तर (ETL) आधारित संस्तुतियां"
              : "Biological control, pest identification, threshold-based guidance, and expert-reviewed management"
          }
        />
      </div>

      {/* Visual IPM & Bio-Control Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative rounded-2xl overflow-hidden h-40 border border-[#e5e7eb] shadow-xs group">
          <img
            src="/pests/crop-protection.jpg"
            alt="IPM Crop Protection"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
            <span className="text-[10px] font-bold bg-[#15803d] px-2 py-0.5 rounded uppercase self-start mb-1">
              {lang === "hi" ? "एकीकृत नियंत्रण" : "Biological Control"}
            </span>
            <h4 className="font-extrabold text-base">
              {lang === "hi" ? "फेरोमोन ट्रैप व मित्र कीट संरक्षण" : "Pheromone Traps & Parasitoid Cards"}
            </h4>
            <p className="text-xs text-white/80 line-clamp-1">
              {lang === "hi" ? "ट्राइकोग्रामा व नीम आधारित दवाओं से रासायनिक छिड़काव में 60% कमी" : "Trichogramma & Neem oil applications reduce spray frequency by 60%"}
            </p>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden h-40 border border-[#e5e7eb] shadow-xs group">
          <img
            src="/pests/aphids.jpg"
            alt="Aphid & Mahu"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
            <span className="text-[10px] font-bold bg-[#ca8a04] px-2 py-0.5 rounded uppercase self-start mb-1">
              {lang === "hi" ? "कीट पहचान" : "Sucking Pests"}
            </span>
            <h4 className="font-extrabold text-base">
              {lang === "hi" ? "माहू, तेला व तना छेदक का समय रहते निदान" : "Aphid, Jassid & Stem Borer Early Detection"}
            </h4>
            <p className="text-xs text-white/80 line-clamp-1">
              {lang === "hi" ? "पीले चिपचिपे ट्रैप व ईटीएल (ETL) स्तर पर लक्षित समाधान" : "Yellow sticky traps and timely targeted interventions"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 size-4 text-[#9ca3af]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "hi" ? "कीट या फसल का नाम खोजें..." : "Search pest or crop..."}
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
            <option value="paddy">{lang === "hi" ? "धान" : "Paddy"}</option>
            <option value="mustard">{lang === "hi" ? "सरसों" : "Mustard"}</option>
            <option value="pulse">{lang === "hi" ? "चना / अरहर" : "Pulses (Chickpea/Arhar)"}</option>
            <option value="sugarcane">{lang === "hi" ? "गन्ना" : "Sugarcane"}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((pest) => (
          <Card key={pest.id} className="flex flex-col justify-between">
            <div>
              <CardHeader className="bg-[#fffbeb] border-b border-[#fef3c7]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-[#92400e] flex items-center gap-1.5">
                      <Bug className="size-5 text-[#d97706] shrink-0" />
                      <span>{lang === "hi" ? pest.name_hi : pest.name_en}</span>
                    </CardTitle>
                    <p className="text-xs italic text-[#78350f] pl-6 mt-0.5">
                      {lang === "hi" ? "वैज्ञानिक नाम: " : "Scientific Name: "}{pest.scientific}
                    </p>
                  </div>
                  <Badge variant="warning" size="sm">
                    {lang === "hi" ? `फसल: ${pest.crop_hi}` : `Crop: ${pest.crop_en}`}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-4 text-xs sm:text-sm">
                <div>
                  <strong className="text-[#14532d] block mb-0.5">
                    {lang === "hi" ? "हानि की प्रकृति एवं लक्षण:" : "Nature of Damage & Symptoms:"}
                  </strong>
                  <p className="text-[#374151] bg-[#f8faf5] p-2.5 rounded-lg border border-[#e5e7eb] leading-relaxed">
                    {lang === "hi" ? pest.damage_hi : pest.damage_en}
                  </p>
                </div>

                <div>
                  <strong className="text-[#15803d] block mb-0.5 flex items-center gap-1">
                    <ShieldCheck className="size-4 text-[#15803d]" />
                    <span>{lang === "hi" ? "एकीकृत व जैविक नियंत्रण (IPM):" : "Biological & IPM Management:"}</span>
                  </strong>
                  <p className="text-[#374151] leading-relaxed bg-[#f0fdf4] p-2.5 rounded-lg border border-[#bbf7d0]">
                    {lang === "hi" ? pest.ipm_hi : pest.ipm_en}
                  </p>
                </div>

                <div>
                  <strong className="text-[#b91c1c] block mb-0.5">
                    {lang === "hi" ? "रासायनिक संस्तुति (केवल ETL स्तर पर):" : "Chemical Recommendation (ETL Level Only):"}
                  </strong>
                  <p className="text-[#374151] leading-relaxed">
                    {lang === "hi" ? pest.chemical_hi : pest.chemical_en}
                  </p>
                </div>
              </CardContent>
            </div>

            <div className="p-4 bg-[#f8faf5] border-t border-[#e5e7eb]">
              <SourceBadge
                sourceName={lang === "hi" ? pest.source_hi : pest.source_en}
                updatedAt={pest.updatedAt}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
