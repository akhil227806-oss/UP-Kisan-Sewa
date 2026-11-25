"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Layers,
  FileCheck,
  Building,
  Phone,
  Printer,
  Share2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

interface SchemeDetail {
  slug: string;
  name_hi: string;
  name_en: string;
  category_hi: string;
  category_en: string;
  department_hi: string;
  department_en: string;
  benefit_hi: string;
  benefit_en: string;
  eligibility_hi: string[];
  eligibility_en: string[];
  documents_hi: string[];
  documents_en: string[];
  process_hi: string[];
  process_en: string[];
  officialLink: string;
  helpline: string;
  source: string;
  updatedAt: string;
}

const SCHEMES_DATABASE: Record<string, SchemeDetail> = {
  "pm-kisan": {
    slug: "pm-kisan",
    name_hi: "प्रधानमंत्री किसान सम्मान निधि योजना (PM-KISAN)",
    name_en: "PM Kisan Samman Nidhi Yojana",
    category_hi: "केन्द्रीय प्रत्यक्ष लाभ योजना",
    category_en: "Central Direct Benefit Scheme",
    department_hi: "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार",
    department_en: "Ministry of Agriculture & Farmers Welfare, Govt of India",
    benefit_hi: "पात्र कृषक परिवारों को ₹6,000 प्रति वर्ष की वित्तीय सहायता, जो ₹2,000 की तीन समान किस्तों में सीधे बैंक खाते (Aadhaar linked DBT) में अंतरित की जाती है।",
    benefit_en: "Financial assistance of ₹6,000 per year provided in three equal installments of ₹2,000 directly into Aadhaar-seeded bank accounts (DBT).",
    eligibility_hi: [
      "सभी भूमिधर कृषक परिवार जिनके नाम पर राज्य के भू-राजस्व रिकॉर्ड में खेती योग्य भूमि दर्ज है।",
      "कृषक का बैंक खाता आधार से लिंक (Aadhaar Seeded) एवं NPCI एक्टिव होना अनिवार्य है।",
      "कृषक द्वारा ई-केवाईसी (e-KYC) पूर्ण होना अनिवार्य है।",
      "संवैधानिक पदधारक, सेवारत अथवा सेवानिवृत्त सरकारी कर्मचारी (चतुर्थ श्रेणी को छोड़कर) और ₹10,000 से अधिक मासिक पेंशनभोगी अपात्र हैं।",
    ],
    eligibility_en: [
      "All landholder farmer families with cultivable land recorded in state revenue records.",
      "Bank account must be Aadhaar-seeded and NPCI-active.",
      "Completion of biometric or OTP-based e-KYC is mandatory.",
      "Constitutional post holders and institutional landholders are excluded.",
    ],
    documents_hi: [
      "आधार कार्ड (Aadhaar Card)",
      "भू-अभिलेख खतौनी / गाटा संख्या (Land Record / Khatauni)",
      "बैंक पासबुक (DBT सक्षम खाता)",
      "आधार से जुड़ा सक्रिय मोबाइल नंबर",
    ],
    documents_en: [
      "Aadhaar Card",
      "Land ownership record (Khatauni / Gata number)",
      "Bank passbook (DBT enabled)",
      "Aadhaar-linked active mobile number",
    ],
    process_hi: [
      "1. आधिकारिक पोर्टल (pmkisan.gov.in) पर जाएँ।",
      "2. 'Farmers Corner' में 'New Farmer Registration' पर क्लिक करें।",
      "3. ग्रामीण अथवा शहरी किसान का चयन करें और आधार संख्या व मोबाइल नंबर दर्ज करें।",
      "4. राज्य (उत्तर प्रदेश), जनपद, तहसील, ब्लॉक, गाँव एवं खतौनी भू-अभिलेख विवरण भरें।",
      "5. दस्तावेज अपलोड कर सबमिट करें। सत्यापन उपरांत लाभ खाते में आना आरंभ होगा।",
    ],
    process_en: [
      "1. Visit the official portal (pmkisan.gov.in).",
      "2. Click on 'New Farmer Registration' under 'Farmers Corner'.",
      "3. Select Rural or Urban farmer, enter Aadhaar and mobile number.",
      "4. Fill state (Uttar Pradesh), district, tehsil, block, village, and land details.",
      "5. Submit for district verification and track status via Aadhaar.",
    ],
    officialLink: "https://pmkisan.gov.in/",
    helpline: "155261 / 1800-180-1551 (टोल-फ्री)",
    source: "कृषि एवं किसान कल्याण मंत्रालय (pmkisan.gov.in)",
    updatedAt: "2026-03-01",
  },
  "pmfby": {
    slug: "pmfby",
    name_hi: "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
    name_en: "Pradhan Mantri Fasal Bima Yojana",
    category_hi: "फसल बीमा एवं जोखिम प्रबंधन",
    category_en: "Crop Insurance & Risk Management",
    department_hi: "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार",
    department_en: "Ministry of Agriculture & Farmers Welfare, Govt of India",
    benefit_hi: "अनावृष्टि, ओलावृष्टि, बाढ़, चक्रवात, कीट एवं रोगों से फसल नष्ट होने पर व्यापक वित्तीय सुरक्षा। खरीफ फसलों पर केवल 2%, रबी फसलों पर 1.5% एवं वाणिज्यिक/उद्यानिकी फसलों पर 5% मात्र किसान प्रीमियम।",
    benefit_en: "Comprehensive financial protection against non-preventable natural risks (drought, flood, hailstorm, pests). Farmer pays 2% premium for Kharif, 1.5% for Rabi, and 5% for commercial/horticultural crops.",
    eligibility_hi: [
      "उत्तर प्रदेश के अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले सभी कृषक।",
      "किसान क्रेडिट कार्ड (KCC) धारक ऋणी किसान एवं गैर-ऋणी बटाईदार किसान दोनों पात्र।",
      "बुवाई से कटाई उपरांत 14 दिनों तक खेत में रखी फसल चक्रवाती वर्षा से खराब होने पर भी सुरक्षा।",
    ],
    eligibility_en: [
      "All farmers growing notified crops in notified areas across Uttar Pradesh.",
      "Both loanee (KCC) and non-loanee farmers are eligible.",
      "Covers localized risks and post-harvest losses up to 14 days.",
    ],
    documents_hi: [
      "आधार कार्ड",
      "खतौनी / भू-स्वामित्व प्रमाण पत्र",
      "फसल बुवाई प्रमाण पत्र / खसरा पड़ताल",
      "बैंक पासबुक व निरस्त चेक",
    ],
    documents_en: [
      "Aadhaar Card",
      "Land record (Khatauni / tenancy agreement)",
      "Sowing certificate issued by village officer / Lekhpal",
      "Bank passbook copy",
    ],
    process_hi: [
      "1. pmfby.gov.in पोर्टल पर अथवा सीएससी (CSC) केंद्र पर जाएं।",
      "2. खरीफ/रबी बुवाई के 15 दिनों के अंदर निर्धारित प्रीमियम जमा कर रसीद प्राप्त करें।",
      "3. आपदा आने पर 72 घंटे के भीतर टोल-फ्री 14447 पर फसल क्षति की सूचना दर्ज कराएं।",
    ],
    process_en: [
      "1. Apply via pmfby.gov.in portal or visit nearest CSC / bank branch.",
      "2. Pay subsidized farmer premium before cut-off date.",
      "3. Report crop damage within 72 hours via toll-free 14447 or Crop Insurance App.",
    ],
    officialLink: "https://pmfby.gov.in/",
    helpline: "14447 / 1800-180-1551",
    source: "कृषि मंत्रालय (pmfby.gov.in)",
    updatedAt: "2026-02-28",
  },
  "kusum-solar-pump": {
    slug: "kusum-solar-pump",
    name_hi: "पीएम कुसुम योजना (सोलर सिंचाई पंप अनुदान)",
    name_en: "PM KUSUM Solar Pump Scheme",
    category_hi: "सिंचाई ऊर्जा एवं सौर कृषि",
    category_en: "Renewable Energy & Irrigation",
    department_hi: "कृषि विभाग, उत्तर प्रदेश सरकार",
    department_en: "Department of Agriculture, Government of Uttar Pradesh",
    benefit_hi: "2 एचपी से 10 एचपी तक के स्टैंडअलोन सोलर सिंचाई पंप स्थापना पर 60% तक भारी सरकारी सब्सिडी (30% केंद्र + 30% राज्य अनुदान)। बिजली बिल एवं डीजल की बचत।",
    benefit_en: "Up to 60% subsidy (30% Central + 30% State) on 2 HP to 10 HP standalone DC/AC solar irrigation pumps. Eliminates diesel and grid electricity expenses.",
    eligibility_hi: [
      "उत्तर प्रदेश कृषि विभाग के पारदर्शी किसान सेवा पोर्टल पर पंजीकृत किसान।",
      "कृषक के पास सिंचाई हेतु क्रियाशील बोरवेल/जल स्रोत उपलब्ध होना चाहिए।",
      "विद्युत कनेक्शन से वंचित कृषि भूमि को प्राथमिकता दी जाती है।",
    ],
    eligibility_en: [
      "Registered on UP Agriculture Department portal (agriculture.up.gov.in).",
      "Must have an operational borewell or water source on the agricultural land.",
      "Priority given to un-electrified agricultural lands.",
    ],
    documents_hi: [
      "किसान पंजीकरण संख्या (UP Agriculture ID)",
      "आधार कार्ड",
      "खतौनी की प्रति",
      "बोरवेल सत्यापन प्रमाण पत्र",
    ],
    documents_en: [
      "UP Agriculture Farmer Registration ID",
      "Aadhaar Card",
      "Khatauni land record",
      "Borewell verification report",
    ],
    process_hi: [
      "1. agriculture.up.gov.in पोर्टल पर 'सोलर पंप टोकन व्यवस्था' के तहत ऑनलाइन बुकिंग करें।",
      "2. टोकन कन्फर्म होने पर निर्धारित कृषक अंशदान चालान द्वारा बैंक में जमा करें।",
      "3. एजेंसी द्वारा स्थल निरीक्षण उपरांत 30-45 दिनों में सोलर पंप स्थापित कर दिया जाता है।",
    ],
    process_en: [
      "1. Book online token under Solar Pump system at agriculture.up.gov.in.",
      "2. Deposit farmer contribution in designated bank upon token confirmation.",
      "3. Installation completed by certified agency within 30-45 days following site survey.",
    ],
    officialLink: "https://agriculture.up.gov.in/",
    helpline: "1800-180-1551",
    source: "उ.प्र. कृषि विभाग (agriculture.up.gov.in)",
    updatedAt: "2026-03-05",
  },
  "up-khet-talab": {
    slug: "up-khet-talab",
    name_hi: "उत्तर प्रदेश खेत तालाब योजना",
    name_en: "UP Khet Talab Yojana",
    category_hi: "जल संचयन एवं भूजल पुनर्भरण",
    category_en: "Water Conservation & Harvesting",
    department_hi: "कृषि विभाग, उत्तर प्रदेश सरकार",
    department_en: "Department of Agriculture, Government of Uttar Pradesh",
    benefit_hi: "खेत में वर्षा जल संचयन हेतु तालाब निर्माण पर लागत का 50% सरकारी अनुदान (अधिकतम ₹1,05,000)। सिंचाई सुविधा के साथ मत्स्य पालन द्वारा अतिरिक्त आय।",
    benefit_en: "50% government subsidy (up to ₹1,05,000) for digging rain-water harvesting farm ponds on agricultural fields.",
    eligibility_hi: [
      "उत्तर प्रदेश के समस्त जनपदों (विशेष रूप से बुंदेलखंड व पूर्वांचल) के लघु व सीमांत किसान।",
      "तालाब निर्माण हेतु न्यूनतम 0.5 एकड़ उपयुक्त भूमि उपलब्ध हो।",
    ],
    eligibility_en: [
      "Small and marginal farmers across all UP districts (special focus on Bundelkhand & Purvanchal).",
      "Adequate catchment land available for pond excavation.",
    ],
    documents_hi: ["आधार कार्ड", "खतौनी", "बैंक पासबुक", "किसान पंजीकरण"],
    documents_en: ["Aadhaar Card", "Khatauni", "Bank passbook", "Farmer Registration ID"],
    process_hi: [
      "1. पारदर्शी किसान सेवा पोर्टल पर ऑनलाइन टोकन जनरेट करें।",
      "2. सहायक कृषि अभियंता द्वारा स्थल निरीक्षण व माप पुस्तिका तैयार होने पर खुदाई कराएं।",
      "3. अनुदान धनराशि दो समान किस्तों में सीधे बैंक खाते में भेजी जाती है।",
    ],
    process_en: [
      "1. Generate online token on UP Agriculture portal.",
      "2. Complete pond excavation as per Agriculture Engineering specifications.",
      "3. Subsidy credited directly into bank account in two installments upon geo-tagging.",
    ],
    officialLink: "https://agriculture.up.gov.in/",
    helpline: "1800-180-1551",
    source: "कृषि विभाग उत्तर प्रदेश",
    updatedAt: "2026-03-02",
  },
  "krishi-yantrikaran-token": {
    slug: "krishi-yantrikaran-token",
    name_hi: "कृषि यंत्रीकरण एवं कस्टम हायरिंग सेंटर अनुदान",
    name_en: "Farm Mechanization & Custom Hiring Center Subsidy",
    category_hi: "यंत्र अनुदान एवं आधुनिकीकरण",
    category_en: "Farm Machinery Subsidy",
    department_hi: "कृषि विभाग, उत्तर प्रदेश सरकार",
    department_en: "Department of Agriculture, Government of Uttar Pradesh",
    benefit_hi: "सुपर सीडर, हैप्पी सीडर, रोटावेटर, लेजर लैंड लेवलर, पैडी स्ट्रॉ चॉपर पर 40% से 50% अनुदान। कस्टम हायरिंग सेंटर (CHC) स्थापना हेतु ₹4 लाख से ₹10 लाख तक अनुदान।",
    benefit_en: "40% to 50% financial subsidy on tractors, super seeders, rotavators, and laser land levelers. Up to ₹4 Lakh subsidy for setting up Custom Hiring Centers.",
    eligibility_hi: [
      "उ.प्र. कृषि विभाग के पोर्टल पर पंजीकृत समस्त किसान, एफपीओ (FPO) एवं स्वयं सहायता समूह।",
      "ट्रैक्टर चालित यंत्रों हेतु कृषक के पास वैध ट्रैक्टर पंजीयन होना आवश्यक।",
    ],
    eligibility_en: [
      "All registered farmers, FPOs, and Self-Help Groups in Uttar Pradesh.",
      "Valid tractor registration required for tractor-driven machinery.",
    ],
    documents_hi: [
      "किसान पंजीकरण आईडी",
      "आधार कार्ड",
      "खतौनी",
      "ट्रैक्टर आरसी (RC) की प्रति",
    ],
    documents_en: [
      "Farmer Registration ID",
      "Aadhaar Card",
      "Land Record Khatauni",
      "Tractor Registration Certificate",
    ],
    process_hi: [
      "1. upagriculture.com पर यंत्र टोकन बुकिंग पोर्टल पर टोकन बुक करें।",
      "2. निर्धारित धरोहर धनराशि ई-चालान द्वारा जमा करें।",
      "3. अधिकृत डीलर से यंत्र क्रय कर सत्यापन कराएं और अनुदान सीधे बैंक खाते में पाएं।",
    ],
    process_en: [
      "1. Book machinery token online on upagriculture.com portal.",
      "2. Deposit security amount via e-Challan within designated window.",
      "3. Purchase from authorized dealer and receive subsidy upon physical verification.",
    ],
    officialLink: "https://agriculture.up.gov.in/",
    helpline: "1800-180-1551",
    source: "उ.प्र. कृषि विभाग",
    updatedAt: "2026-03-01",
  },
};

const SCHEME_IMAGES: Record<string, string> = {
  "pm-kisan": "/schemes/pm-kisan.jpg",
  "pmfby": "/schemes/pmfby.jpg",
  "kusum-solar-pump": "/schemes/solar-pump.jpg",
  "up-khet-talab": "/schemes/khet-talab.jpg",
  "krishi-yantrikaran-token": "/schemes/mechanization.jpg",
};

export default function SchemeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { lang } = useI18n();

  const scheme = SCHEMES_DATABASE[resolvedParams.slug] || SCHEMES_DATABASE["pm-kisan"];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[
          { label: lang === "hi" ? "सरकारी योजनाएँ" : "Schemes", href: "/schemes" },
          { label: lang === "hi" ? scheme.name_hi : scheme.name_en },
        ]}
      />

      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 my-4">
        <Link href="/schemes">
          <Button variant="ghost" size="sm" className="text-xs">
            <ArrowLeft className="size-4" />
            <span>{lang === "hi" ? "सभी योजनाओं पर लौटें" : "Back to Schemes"}</span>
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
                navigator.share({ title: scheme.name_hi, url: window.location.href });
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

      {/* Hero Scheme Card */}
      <div className="bg-gradient-to-r from-[#14532d] via-[#15803d] to-[#14532d] text-white rounded-2xl p-6 sm:p-8 shadow-md mb-8 overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="accent" size="sm" className="font-bold text-[#14532d]">
                {lang === "hi" ? scheme.category_hi : scheme.category_en}
              </Badge>
              <span className="text-xs text-[#86efac]">
                {lang === "hi" ? "सत्यापित सरकारी योजना" : "Verified Govt Scheme"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {lang === "hi" ? scheme.name_hi : scheme.name_en}
            </h1>

            <p className="text-xs sm:text-sm text-[#bbf7d0] flex items-center gap-1.5 pt-1">
              <Building className="size-4 text-[#86efac] shrink-0" />
              <span>{lang === "hi" ? scheme.department_hi : scheme.department_en}</span>
            </p>
          </div>

          <div className="w-full md:w-56 h-36 rounded-xl overflow-hidden shadow-lg border-2 border-white/20 shrink-0">
            <img
              src={SCHEME_IMAGES[scheme.slug] || "/schemes/pm-kisan.jpg"}
              alt={scheme.name_hi}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/20">
          <span className="text-xs font-bold text-[#fef08a] block mb-1">
            {lang === "hi" ? "मुख्य लाभ एवं वित्तीय सहायता:" : "Key Benefits & Financial Assistance:"}
          </span>
          <p className="text-xs sm:text-sm text-white leading-relaxed">
            {lang === "hi" ? scheme.benefit_hi : scheme.benefit_en}
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        {/* Eligibility Criteria */}
        <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-xs">
          <h3 className="font-bold text-lg text-[#14532d] mb-4 flex items-center gap-2">
            <CheckCircle2 className="size-5 text-[#15803d]" />
            <span>{lang === "hi" ? "पात्रता एवं शर्तें (Eligibility Criteria)" : "Eligibility Criteria"}</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#374151]">
            {(lang === "hi" ? scheme.eligibility_hi : scheme.eligibility_en).map((el, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#15803d] font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{el}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Documents Required */}
        <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-xs">
          <h3 className="font-bold text-lg text-[#14532d] mb-4 flex items-center gap-2">
            <FileCheck className="size-5 text-[#0284c7]" />
            <span>{lang === "hi" ? "आवश्यक दस्तावेज (Required Documents)" : "Required Documents"}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(lang === "hi" ? scheme.documents_hi : scheme.documents_en).map((doc, i) => (
              <div
                key={i}
                className="p-3 bg-[#f8faf5] rounded-xl border border-[#e5e7eb] text-xs font-semibold text-[#14532d] flex items-center gap-2"
              >
                <div className="size-2 rounded-full bg-[#15803d]" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Application Process */}
        <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-xs">
          <h3 className="font-bold text-lg text-[#14532d] mb-4 flex items-center gap-2">
            <Layers className="size-5 text-[#854d0e]" />
            <span>{lang === "hi" ? "आवेदन की चरणबद्ध प्रक्रिया (How to Apply)" : "Step-by-Step Application Process"}</span>
          </h3>
          <div className="space-y-3">
            {(lang === "hi" ? scheme.process_hi : scheme.process_en).map((step, i) => (
              <div
                key={i}
                className="p-3.5 bg-[#f8faf5] rounded-xl border border-[#e5e7eb] text-xs sm:text-sm text-[#374151] leading-relaxed font-medium"
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Official Portal Apply Button Banner */}
        <div className="bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] border-2 border-[#15803d] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-[#14532d] text-base mb-1">
              {lang === "hi" ? "आधिकारिक पोर्टल पर सीधा आवेदन करें" : "Apply on Official Government Portal"}
            </h4>
            <p className="text-xs text-[#4b5563]">
              {lang === "hi"
                ? "सुरक्षित सरकारी सेवा: केवल अधिकृत (.gov.in / .nic.in) पोर्टल लिंक"
                : "Secure direct link to verified official portal"}
            </p>
          </div>

          <a
            href={scheme.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button variant="primary" size="lg" className="shadow-md text-xs sm:text-sm font-bold">
              <span>{lang === "hi" ? "आधिकारिक पोर्टल खोलें" : "Open Official Portal"}</span>
              <ExternalLink className="size-4 ml-1.5" />
            </Button>
          </a>
        </div>

        {/* Helpline & Verification Note */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] flex items-center gap-3">
            <div className="size-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
              <Phone className="size-5" />
            </div>
            <div>
              <span className="text-[#6b7280] block text-[11px]">
                {lang === "hi" ? "योजना हेल्पलाइन" : "Helpline"}
              </span>
              <span className="font-bold text-[#14532d]">{scheme.helpline}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] flex items-center gap-3">
            <div className="size-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shrink-0">
              <Calendar className="size-5" />
            </div>
            <div>
              <span className="text-[#6b7280] block text-[11px]">
                {lang === "hi" ? "सत्यापन एवं अद्यतन तिथि" : "Verified & Updated"}
              </span>
              <span className="font-bold text-[#14532d]">{scheme.updatedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
