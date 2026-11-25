"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Sprout,
  Calendar,
  CloudRain,
  Layers,
  ThermometerSun,
  ShieldAlert,
  ArrowLeft,
  Share2,
  Printer,
  FileCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

interface CropDetail {
  slug: string;
  name_hi: string;
  name_en: string;
  botanical: string;
  category_hi: string;
  category_en: string;
  season_hi: string;
  season_en: string;
  duration: string;
  suitableClimate: string;
  suitableClimate_en: string;
  soilReq: string;
  soilReq_en: string;
  sowingPeriod: string;
  sowingPeriod_en: string;
  seedRate: string;
  seedRate_en: string;
  recommendedVarieties: { name: string; yield: string; feature: string }[];
  landPrep: string;
  irrigation: { stage: string; days: string }[];
  fertilizers: string;
  weedMgmt: string;
  majorDiseases: { name: string; symptom: string; prevention: string }[];
  source: string;
  sourceUrl: string;
  updatedAt: string;
}

const CROPS_DATABASE: Record<string, CropDetail> = {
  "gehu-sample": {
    slug: "gehu-sample",
    name_hi: "गेहूँ",
    name_en: "Wheat",
    botanical: "Triticum aestivum",
    category_hi: "खाद्यान्न (अनाज)",
    category_en: "Cereals",
    season_hi: "रबी",
    season_en: "Rabi",
    duration: "115 - 130 दिन",
    suitableClimate: "समशीतोष्ण जलवायु। जमाव के समय 20-22°C और पकने के समय 25-30°C तापमान उत्तम रहता है।",
    suitableClimate_en: "Temperate climate. Optimal temperature: 20-22°C during germination and 25-30°C during ripening.",
    soilReq: "दोमट तथा बलुई दोमट भूमि जिसमें जल निकास का उचित प्रबंध हो। मृदा का पीएच मान 6.5 से 7.5 सर्वोत्तम।",
    soilReq_en: "Well-drained loam and sandy loam soil with good drainage. Soil pH 6.5 to 7.5.",
    sowingPeriod: "समय पर बुवाई: 15 से 25 नवम्बर; देर से बुवाई: 25 नवम्बर से 15 दिसम्बर।",
    sowingPeriod_en: "Timely sowing: 15-25 November; Late sowing: 25 November - 15 December.",
    seedRate: "सामान्य बुवाई हेतु 100 किग्रा/हेक्टेयर; देर से बुवाई या मोटा दाना हेतु 125 किग्रा/हेक्टेयर।",
    seedRate_en: "100 kg/ha for timely sowing; 125 kg/ha for late sowing.",
    recommendedVarieties: [
      { name: "डीबीडब्ल्यू 187 (करन वंदना)", yield: "55-65 कुंतल/हे.", feature: "पीला रतुआ रोधी, उच्च प्रोटीन (12.5%)" },
      { name: "डीबीडब्ल्यू 303 (करन वैष्णवी)", yield: "60-70 कुंतल/हे.", feature: "अगेती बुवाई, मजबूत तना गिरता नहीं" },
      { name: "एचडी 2967", yield: "50-55 कुंतल/हे.", feature: "समय से बुवाई हेतु उ.प्र. में लोकप्रिय" },
      { name: "एचडी 3086 (पूसा गौतमी)", yield: "52-58 कुंतल/हे.", feature: "ताप सहनशील, दाना चमकदार" },
    ],
    landPrep: "खरीफ फसल कटाई उपरांत मिट्टी पलटने वाले हल से 1 जुताई, फिर 2-3 जुताई कल्टीवेटर से कर पाटा लगाएं।",
    irrigation: [
      { stage: "प्रथम सिंचाई (ताज मूल अवस्था / CRI)", days: "20-25 दिन पर (सर्वाधिक महत्वपूर्ण)" },
      { stage: "द्वितीय सिंचाई (कल्ले फूटते समय)", days: "40-45 दिन पर" },
      { stage: "तृतीय सिंचाई (गाभा अवस्था)", days: "60-65 दिन पर" },
      { stage: "चतुर्थ सिंचाई (फूल आने पर)", days: "80-85 दिन पर" },
      { stage: "पंचम सिंचाई (दूधिया अवस्था)", days: "100-105 दिन पर" },
    ],
    fertilizers: "एनपीके: 120:60:40 किग्रा/हेक्टेयर। नाइट्रोजन की आधी मात्रा, फास्फोरस व पोटाश की पूरी मात्रा बुवाई के समय कूंड़ों में दें। शेष नाइट्रोजन को दो बराबर भागों में पहली व दूसरी सिंचाई पर दें।",
    weedMgmt: "सकरी पत्ती (गुल्ली डंडा) हेतु क्लोडिनाफॉप 15% डब्ल्यूपी 160 ग्राम/एकड़ बुवाई के 30-35 दिन पर 150 लीटर पानी में छिड़काव करें।",
    majorDiseases: [
      { name: "पीला रतुआ (Yellow Rust)", symptom: "पत्तियों पर पीली धारियों के रूप में चूर्ण जमना।", prevention: "रोधी किस्में लगाएं। प्रकोप दिखने पर प्रोपिकोनाजोल 25 ईसी का छिड़काव।" },
      { name: "करनाल बंट (Karnal Bunt)", symptom: "दाने आंशिक रूप से काले चूर्ण में बदल जाना व मछली जैसी दुर्गंध।", prevention: "सत्यापित बीज का प्रयोग एवं थीरम/कार्बेन्डाजिम से बीजोपचार।" },
    ],
    source: "आचार्य नरेंद्र देव कृषि एवं प्रौद्योगिकी विश्वविद्यालय (NDUAT), कुमारगंज, अयोध्या",
    sourceUrl: "https://www.nduat.org/",
    updatedAt: "2026-03-15",
  },
  "dhan-sample": {
    slug: "dhan-sample",
    name_hi: "धान",
    name_en: "Paddy / Rice",
    botanical: "Oryza sativa",
    category_hi: "खाद्यान्न (अनाज)",
    category_en: "Cereals",
    season_hi: "खरीफ",
    season_en: "Kharif",
    duration: "120 - 140 दिन",
    suitableClimate: "गर्म एवं नम जलवायु। 25 से 35°C तापमान और 100-150 सेमी वर्षा सर्वोत्तम।",
    suitableClimate_en: "Warm and humid climate. Temperature: 25-35°C and 100-150 cm rainfall.",
    soilReq: "मटियार दोमट एवं भारी दोमट भूमि जिसमें जल धारण क्षमता अधिक हो।",
    soilReq_en: "Clay loam and heavy loam soils with high water retention capacity.",
    sowingPeriod: "नर्सरी बुवाई: 20 मई से 20 जून; मुख्य खेत में रोपाई: 20 जून से 15 जुलाई।",
    sowingPeriod_en: "Nursery sowing: 20 May - 20 June; Field transplanting: 20 June - 15 July.",
    seedRate: "महीन व सुगंधित किस्में: 30-35 किग्रा/हे.; संकर (हाइब्रिड) किस्में: 15-20 किग्रा/हे.",
    seedRate_en: "Inbred varieties: 30-35 kg/ha; Hybrid varieties: 15-20 kg/ha.",
    recommendedVarieties: [
      { name: "एनडीआर 359", yield: "55-60 कुंतल/हे.", feature: "मध्यम अवधि, उ.प्र. हेतु सर्वाधिक लोकप्रिय" },
      { name: "एनडीआर 2064", yield: "50-55 कुंतल/हे.", feature: "झुलसा व तना छेदक कीट मध्यम रोधी" },
      { name: "सरजू 52", yield: "50-55 कुंतल/हे.", feature: "समय से रोपाई, उत्कृष्ट दाना" },
      { name: "पूसा बासमती 1509", yield: "45-50 कुंतल/हे.", feature: "शीघ्र पकने वाली सुगंधित बासमती" },
    ],
    landPrep: "खेत में 5-7 सेमी पानी भरकर 2-3 बार लेव (पडलिंग) चलाकर भूमि समतल करें।",
    irrigation: [
      { stage: "रोपाई के समय", days: "2-3 सेमी जल भराव" },
      { stage: "कल्ले फूटते समय", days: "पर्याप्त नमी" },
      { stage: "बाली निकलते एवं दाना भरते समय", days: "जल भराव अति आवश्यक" },
    ],
    fertilizers: "एनपीके: 120:60:40 + 25 किग्रा जिंक सल्फेट प्रति हेक्टेयर।",
    weedMgmt: "रोपाई के 2-3 दिन के भीतर प्रेटिलाक्लोर 50% ईसी 1.5 लीटर/हेक्टेयर का छिड़काव।",
    majorDiseases: [
      { name: "शीथ ब्लाइट (झुलसा)", symptom: "तने व पत्तियों पर अण्डाकार धब्बे।", prevention: "वैलिडामाइसिन 3L 2 मिली/लीटर पानी में स्प्रे करें।" },
      { name: "जीवाणु झुलसा (BLB)", symptom: "पत्तियां किनारों से सूखती हैं।", prevention: "स्ट्रेप्टोसाइक्लिन 6 ग्राम + कॉपर ऑक्सीक्लोराइड 500 ग्राम/हेक्टेयर।" },
    ],
    source: "एनडीयूएटी प्रसार निदेशालय / सस्य विज्ञान संकाय",
    sourceUrl: "https://www.nduat.org/",
    updatedAt: "2026-03-10",
  },
  "sarson-sample": {
    slug: "sarson-sample",
    name_hi: "सरसों / तोरिया",
    name_en: "Mustard",
    botanical: "Brassica juncea",
    category_hi: "तिलहन",
    category_en: "Oilseeds",
    season_hi: "रबी",
    season_en: "Rabi",
    duration: "110 - 125 दिन",
    suitableClimate: "ठंडी एवं शुष्क जलवायु। 15-25°C तापमान सर्वोत्तम।",
    suitableClimate_en: "Cool and dry climate. Optimal temperature: 15-25°C.",
    soilReq: "बलुई दोमट से मटियार दोमट भूमि।",
    soilReq_en: "Sandy loam to clay loam soil.",
    sowingPeriod: "25 सितम्बर से 20 अक्टूबर।",
    sowingPeriod_en: "25 September to 20 October.",
    seedRate: "4 से 5 किग्रा प्रति हेक्टेयर।",
    seedRate_en: "4-5 kg per hectare.",
    recommendedVarieties: [
      { name: "एनडीआर 8501 (नरेंद्र राई)", yield: "20-25 कुंतल/हे.", feature: "तेल मात्रा 40%, पाला सहनशील, एनडीयूएटी विकसित" },
      { name: "वरुणा (टी 59)", yield: "18-22 कुंतल/हे.", feature: "पारंपरिक अत्यधिक लोकप्रिय किस्म" },
      { name: "गिरिराज (DRMRIJ 31)", yield: "22-26 कुंतल/हे.", feature: "बोल्ड दाना, उच्च तेल प्रतिशत" },
    ],
    landPrep: "2-3 जुताई कल्टीवेटर से कर पाटा लगाकर खेत को भुरभुरा बनाएं।",
    irrigation: [
      { stage: "प्रथम सिंचाई", days: "फूल आने से पूर्व (30-35 दिन पर)" },
      { stage: "द्वितीय सिंचाई", days: "फलियां बनते समय (60-65 दिन पर)" },
    ],
    fertilizers: "एनपीके: 80:40:40 + 20 किग्रा गंधक (सल्फर) प्रति हेक्टेयर।",
    weedMgmt: "पेंडीमेथालिन 30% ईसी 3.3 लीटर/हेक्टेयर बुवाई के 48 घंटे में छिड़कें।",
    majorDiseases: [
      { name: "सफेद रतुआ (White Rust)", symptom: "पत्तियों के नीचे सफेद फफोले।", prevention: "रिडोमिल एमजेड 2 ग्राम/लीटर का छिड़काव।" },
      { name: "माहू कीट (Aphid)", symptom: "कोमल तनों और फलियों से रस चूसना।", prevention: "इमिडाक्लोप्रिड 17.8 SL 1 मिली प्रति 3 लीटर पानी।" },
    ],
    source: "तिलहन अनुसंधान संभाग, एनडीयूएटी कुमारगंज",
    sourceUrl: "https://www.nduat.org/",
    updatedAt: "2026-03-12",
  },
  "arhar-sample": {
    slug: "arhar-sample",
    name_hi: "अरहर (तूर)",
    name_en: "Pigeon Pea",
    botanical: "Cajanus cajan",
    category_hi: "दलहन",
    category_en: "Pulses",
    season_hi: "खरीफ",
    season_en: "Kharif",
    duration: "140 - 180 दिन",
    suitableClimate: "गर्म व अर्द्ध-शुष्क जलवायु। 20-30°C तापमान।",
    suitableClimate_en: "Warm semi-arid climate. Temperature 20-30°C.",
    soilReq: "गहरी दोमट भूमि जिसमें जल भराव न हो।",
    soilReq_en: "Deep well-drained loamy soil without waterlogging.",
    sowingPeriod: "15 जून से 10 जुलाई।",
    sowingPeriod_en: "15 June to 10 July.",
    seedRate: "15 से 20 किग्रा/हेक्टेयर।",
    seedRate_en: "15-20 kg/ha.",
    recommendedVarieties: [
      { name: "नरेंद्र अरहर 1 (NDA 1)", yield: "20-25 कुंतल/हे.", feature: "उकठा रोग रोधी, एनडीयूएटी विकसित" },
      { name: "नरेंद्र अरहर 2", yield: "22-26 कुंतल/हे.", feature: "मध्यम अवधि, शाखादार" },
      { name: "बहार", yield: "25-30 कुंतल/हे.", feature: "दीर्घकालिक, उच्च पैदावार" },
    ],
    landPrep: "1 जुताई मिट्टी पलटने वाले हल से तथा 2 जुताई कल्टीवेटर से।",
    irrigation: [
      { stage: "शाखाएं बनते समय", days: "सूखा पड़ने पर" },
      { stage: "फूल व फली बनते समय", days: "नमी अति आवश्यक" },
    ],
    fertilizers: "एनपीके: 20:50:20 किग्रा/हेक्टेयर + राइजोबियम संवर्धन से बीजोपचार।",
    weedMgmt: "खुरपी से 25-30 दिन पर एक निराई-गुड़ाई करें।",
    majorDiseases: [
      { name: "उकठा रोग (Wilt)", symptom: "पौधे का अचानक सूख जाना।", prevention: "ट्राइकोडर्मा 5 ग्राम/किग्रा से बीजोपचार।" },
      { name: "फली छेदक (Pod Borer)", symptom: "फलियों में छेद कर दाना खा जाना।", prevention: "क्लोरांट्रानिलिप्रोल 18.5 SC 0.3 मिली/लीटर पानी।" },
    ],
    source: "दलहन संभाग, एनडीयूएटी कुमारगंज",
    sourceUrl: "https://www.nduat.org/",
    updatedAt: "2026-03-08",
  },
  "ganna-sample": {
    slug: "ganna-sample",
    name_hi: "गन्ना",
    name_en: "Sugarcane",
    botanical: "Saccharum officinarum",
    category_hi: "व्यावसायिक नकदी फसल",
    category_en: "Commercial",
    season_hi: "वार्षिक",
    season_en: "Annual",
    duration: "10 - 12 माह",
    suitableClimate: "उष्णकटिबंधीय जलवायु, 20-35°C तापमान।",
    suitableClimate_en: "Tropical climate, 20-35°C temperature.",
    soilReq: "गहरी उपजाऊ दोमट भूमि, उत्तम जल निकास।",
    soilReq_en: "Deep fertile loam soil with good drainage.",
    sowingPeriod: "शरदकालीन: अक्टूबर; वसंतकालीन: फरवरी-मार्च।",
    sowingPeriod_en: "Autumn: October; Spring: February-March.",
    seedRate: "75-80 कुंतल तीन आंख वाले टुकड़े प्रति हेक्टेयर।",
    seedRate_en: "75-80 quintals 3-budded setts per hectare.",
    recommendedVarieties: [
      { name: "को. 0238 (करण 4)", yield: "800-1000 कुंतल/हे.", feature: "उच्च शर्करा मात्रा, शीघ्र पकने वाली" },
      { name: "को.शा. 13235", yield: "850-950 कुंतल/हे.", feature: "लाल सड़न रोधी, नई अगेती किस्म" },
      { name: "को. लख. 14201", yield: "800-900 कुंतल/हे.", feature: "मजबूत तना, जलभराव सहनशील" },
    ],
    landPrep: "गहरी जुताई कर 90 से 120 सेमी की दूरी पर कूंड़ बनाएं।",
    irrigation: [
      { stage: "जमाव उपरांत", days: "15-20 दिन के अंतराल पर" },
      { stage: "गर्मी के महीनों में", days: "10-12 दिन के अंतराल पर" },
    ],
    fertilizers: "एनपीके: 150:60:60 किग्रा/हेक्टेयर।",
    weedMgmt: "एट्राजीन 50% डब्ल्यूपी 2 किग्रा/हेक्टेयर बुवाई उपरांत।",
    majorDiseases: [
      { name: "लाल सड़न (Red Rot)", symptom: "तने के अंदर लाल रंग व सफेद धारियां।", prevention: "कार्बेन्डाजिम से बीजोपचार व रोगमुक्त बीज प्रयोग।" },
    ],
    source: "उ.प्र. गन्ना शोध संस्थान (UPCSR) / एनडीयूएटी",
    sourceUrl: "https://www.nduat.org/",
    updatedAt: "2026-03-01",
  },
};

const CROP_IMAGES: Record<string, string> = {
  "gehu-sample": "/crops/wheat.jpg",
  "dhan-sample": "/crops/paddy.jpg",
  "sarson-sample": "/crops/mustard.jpg",
  "arhar-sample": "/crops/arhar.jpg",
  "ganna-sample": "/crops/sugarcane.jpg",
  "aloo-sample": "/crops/potato.jpg",
  "chana-sample": "/crops/gram.jpg",
  "makka-sample": "/crops/maize.jpg",
};

export default function CropDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { lang } = useI18n();

  // Look up dynamically by slug, with fallback to gehu-sample
  const crop = CROPS_DATABASE[resolvedParams.slug] || CROPS_DATABASE["gehu-sample"];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[
          { label: lang === "hi" ? "फसलें" : "Crops", href: "/crops" },
          { label: lang === "hi" ? crop.name_hi : crop.name_en },
        ]}
      />

      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 my-4">
        <Link href="/crops">
          <Button variant="ghost" size="sm" className="text-xs">
            <ArrowLeft className="size-4" />
            <span>{lang === "hi" ? "सभी फसलों पर लौटें" : "Back to Crops"}</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs"
          >
            <Printer className="size-3.5" />
            <span>{lang === "hi" ? "प्रिंट करें" : "Print"}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: crop.name_hi, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("लिंक कॉपी हो गया!");
              }
            }}
            className="text-xs"
          >
            <Share2 className="size-3.5" />
            <span>{lang === "hi" ? "शेयर" : "Share"}</span>
          </Button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-[#14532d] via-[#15803d] to-[#14532d] text-white rounded-2xl p-6 sm:p-8 shadow-md mb-8 overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="accent" size="sm" className="font-bold text-[#14532d]">
                {lang === "hi" ? crop.season_hi : crop.season_en}
              </Badge>
              <span className="text-xs text-[#86efac]">
                {lang === "hi" ? crop.category_hi : crop.category_en}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {lang === "hi" ? crop.name_hi : crop.name_en}
            </h1>
            <p className="text-sm italic text-[#bbf7d0] font-serif">
              वानस्पतिक नाम: {crop.botanical}
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-[#86efac] block">
                {lang === "hi" ? "फसल अवधि" : "Duration"}
              </span>
              <span className="text-xl font-black text-white">{crop.duration}</span>
            </div>
          </div>

          <div className="w-full md:w-56 h-40 rounded-xl overflow-hidden shadow-lg border-2 border-white/20 shrink-0">
            <img
              src={CROP_IMAGES[crop.slug] || "/crops/wheat.jpg"}
              alt={crop.name_hi}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/20 text-xs">
          <div>
            <span className="text-[#86efac] block text-[11px]">
              {lang === "hi" ? "बुवाई समय" : "Sowing Period"}
            </span>
            <span className="font-bold">{crop.sowingPeriod.slice(0, 24)}...</span>
          </div>
          <div>
            <span className="text-[#86efac] block text-[11px]">
              {lang === "hi" ? "बीज दर" : "Seed Rate"}
            </span>
            <span className="font-bold">{crop.seedRate.slice(0, 24)}...</span>
          </div>
          <div>
            <span className="text-[#86efac] block text-[11px]">
              {lang === "hi" ? "सिंचाई संख्या" : "Irrigations"}
            </span>
            <span className="font-bold">{crop.irrigation.length} {lang === "hi" ? "सिंचाइयाँ" : "Stages"}</span>
          </div>
          <div>
            <span className="text-[#86efac] block text-[11px]">
              {lang === "hi" ? "सत्यापित स्रोत" : "Source"}
            </span>
            <span className="font-bold">NDUAT अयोध्या</span>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Climate & Soil */}
          <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-xs">
            <h3 className="font-bold text-lg text-[#14532d] mb-4 flex items-center gap-2">
              <ThermometerSun className="size-5 text-[#eab308]" />
              <span>{lang === "hi" ? "जलवायु एवं भूमि चयन" : "Climate & Soil Requirements"}</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-[#374151]">
              <p>
                <strong>{lang === "hi" ? "उपयुक्त जलवायु: " : "Climate: "}</strong>
                {lang === "hi" ? crop.suitableClimate : crop.suitableClimate_en}
              </p>
              <p>
                <strong>{lang === "hi" ? "मृदा आवश्यकता: " : "Soil: "}</strong>
                {lang === "hi" ? crop.soilReq : crop.soilReq_en}
              </p>
              <p>
                <strong>{lang === "hi" ? "खेत की तैयारी: " : "Land Preparation: "}</strong>
                {crop.landPrep}
              </p>
            </div>
          </div>

          {/* Recommended Varieties */}
          <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-xs">
            <h3 className="font-bold text-lg text-[#14532d] mb-4 flex items-center gap-2">
              <Sprout className="size-5 text-[#15803d]" />
              <span>{lang === "hi" ? "उ.प्र. हेतु अनुशंसित उन्नत किस्में" : "Recommended Certified Varieties"}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {crop.recommendedVarieties.map((v, i) => (
                <div key={i} className="p-3 bg-[#f8faf5] rounded-xl border border-[#e5e7eb] text-xs">
                  <div className="font-bold text-[#14532d] text-sm mb-1">{v.name}</div>
                  <div className="text-[#15803d] font-semibold mb-1">
                    {lang === "hi" ? "औसत पैदावार: " : "Yield: "} {v.yield}
                  </div>
                  <div className="text-[#4b5563] text-[11px]">{v.feature}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Irrigation Protocol */}
          <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-xs">
            <h3 className="font-bold text-lg text-[#14532d] mb-4 flex items-center gap-2">
              <CloudRain className="size-5 text-[#0284c7]" />
              <span>{lang === "hi" ? "वैज्ञानिक सिंचाई समय चक्र" : "Irrigation Schedule"}</span>
            </h3>
            <div className="space-y-2.5">
              {crop.irrigation.map((ir, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-[#f8faf5] rounded-xl border border-[#e5e7eb] text-xs"
                >
                  <span className="font-semibold text-[#14532d]">{ir.stage}</span>
                  <span className="font-bold text-[#0284c7]">{ir.days}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fertilizer & Weed Management */}
          <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-xs">
            <h3 className="font-bold text-lg text-[#14532d] mb-4 flex items-center gap-2">
              <Layers className="size-5 text-[#854d0e]" />
              <span>{lang === "hi" ? "उर्वरक एवं खरपतवार प्रबंधन" : "Fertilizers & Weed Management"}</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-[#374151]">
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                <span className="font-bold text-[#92400e] block mb-1">
                  {lang === "hi" ? "उर्वरक मात्रा (NPK संस्तुति):" : "Recommended NPK Doses:"}
                </span>
                <p className="leading-relaxed">{crop.fertilizers}</p>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
                <span className="font-bold text-[#14532d] block mb-1">
                  {lang === "hi" ? "खरपतवार रोकथाम:" : "Weed Control:"}
                </span>
                <p className="leading-relaxed">{crop.weedMgmt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Major Diseases */}
          <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-xs">
            <h3 className="font-bold text-base text-[#14532d] mb-3 flex items-center gap-2">
              <ShieldAlert className="size-5 text-red-600" />
              <span>{lang === "hi" ? "प्रमुख रोग एवं रोकथाम" : "Major Diseases & Treatment"}</span>
            </h3>
            <div className="space-y-3">
              {crop.majorDiseases.map((d, i) => (
                <div key={i} className="p-3 bg-red-50/50 rounded-xl border border-red-200 text-xs space-y-1">
                  <div className="font-bold text-red-800">{d.name}</div>
                  <p className="text-[#4b5563]">
                    <strong>{lang === "hi" ? "लक्षण: " : "Symptoms: "}</strong> {d.symptom}
                  </p>
                  <p className="text-[#15803d] font-semibold">
                    <strong>{lang === "hi" ? "उपचार: " : "Treatment: "}</strong> {d.prevention}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Expert Consultation Callout */}
          <div className="bg-gradient-to-br from-[#14532d] to-[#15803d] text-white p-6 rounded-2xl shadow-xs space-y-3">
            <h4 className="font-bold text-base">
              {lang === "hi" ? "फसल में कोई असामान्य लक्षण है?" : "Unidentified crop issue?"}
            </h4>
            <p className="text-xs text-[#bbf7d0] leading-relaxed">
              {lang === "hi"
                ? "पत्तियों की फोटो खींचें और NDUAT वैज्ञानिकों से 24-48 घंटे में समाधान पाएं।"
                : "Submit crop photos to NDUAT agronomists for prompt diagnosis."}
            </p>
            <Link href="/ask-expert" className="block pt-1">
              <Button variant="accent" size="sm" fullWidth className="text-[#14532d] font-bold text-xs">
                {lang === "hi" ? "विशेषज्ञ से सलाह लें" : "Consult Expert"}
              </Button>
            </Link>
          </div>

          {/* Institutional Source Verification */}
          <div className="bg-white rounded-2xl p-5 border border-[#e5e7eb] shadow-xs text-xs space-y-2">
            <span className="font-bold text-[#14532d] block">
              {lang === "hi" ? "सत्यापित सस्य संदर्शिका स्रोत:" : "Verified Source:"}
            </span>
            <p className="text-[#4b5563]">{crop.source}</p>
            <a
              href={crop.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#15803d] font-bold hover:underline"
            >
              <span>{crop.sourceUrl}</span>
              <ExternalLink className="size-3" />
            </a>
            <div className="pt-2 text-[11px] text-[#6b7280]">
              {lang === "hi" ? "अंतिम समीक्षा: " : "Last verified: "} {crop.updatedAt}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
