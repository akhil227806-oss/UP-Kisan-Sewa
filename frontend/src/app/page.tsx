"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sprout,
  TrendingUp,
  CloudSun,
  FileText,
  ShieldAlert,
  Bug,
  Wrench,
  Layers,
  Calendar,
  GraduationCap,
  HelpCircle,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Video,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { useI18n } from "@/lib/i18n";

const HERO_IMAGES = [
  "/hero/hero1.png",
  "/hero/hero2.png",
  "/hero/hero3.png",
  "/hero/hero4.png",
  "/hero/hero5.png",
];

export default function HomePage() {
  const { lang } = useI18n();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  const services = [
    {
      href: "/crops",
      title_hi: "फसल जानकारी",
      title_en: "Crop Information",
      desc_hi: "खरीफ, रबी व जायद फसलों का प्रामाणिक वैज्ञानिक पैकेज व किस्में।",
      desc_en: "Agronomic packages, certified varieties, and sowing schedules.",
      icon: <Sprout className="size-6 text-[#15803d]" />,
      badge: lang === "hi" ? "सत्यापित" : "Verified",
    },
    {
      href: "/mandi",
      title_hi: "मंडी भाव",
      title_en: "Mandi Prices",
      desc_hi: "उत्तर प्रदेश की मंडियों के दैनिक थोक भाव (Agmarknet डेटा)।",
      desc_en: "Daily wholesale arrivals & modal commodity rates from Agmarknet.",
      icon: <TrendingUp className="size-6 text-[#15803d]" />,
      badge: lang === "hi" ? "दैनिक" : "Daily",
    },
    {
      href: "/weather",
      title_hi: "मौसम पूर्वानुमान",
      title_en: "Weather Forecast",
      desc_hi: "आईएमडी (IMD) मौसम वेधशाला आधारित 5-दिवसीय जिला कृषि सलाह।",
      desc_en: "5-day district agro-weather bulletin and advisory by IMD.",
      icon: <CloudSun className="size-6 text-[#eab308]" />,
      badge: lang === "hi" ? "IMD अधिकृत" : "IMD Verified",
    },
    {
      href: "/schemes",
      title_hi: "सरकारी योजनाएँ",
      title_en: "Government Schemes",
      desc_hi: "पीएम-किसान, फसल बीमा, कुसुम व राज्य कृषि अनुदान संदर्शिका।",
      desc_en: "Central & UP state farmer welfare schemes and official links.",
      icon: <FileText className="size-6 text-[#0284c7]" />,
      badge: lang === "hi" ? "सरकारी पोर्टल" : "Govt Portal",
    },
    {
      href: "/diseases",
      title_hi: "फसल रोग प्रबंधन",
      title_en: "Crop Diseases",
      desc_hi: "कवक, जीवाणु व विषाणु रोगों के लक्षण एवं वैज्ञानिक नियंत्रण।",
      desc_en: "Symptoms, causes, and expert-reviewed disease treatments.",
      icon: <ShieldAlert className="size-6 text-[#dc2626]" />,
      badge: lang === "hi" ? "वैज्ञानिक उपचार" : "Scientific",
    },
    {
      href: "/pests",
      title_hi: "कीट नियंत्रण (IPM)",
      title_en: "Pest Management",
      desc_hi: "जैविक व एकीकृत कीट प्रबंधन, फेरोमोन ट्रैप एवं मित्र कीट।",
      desc_en: "Integrated Pest Management, biological control, and safe practices.",
      icon: <Bug className="size-6 text-[#d97706]" />,
      badge: lang === "hi" ? "IPM तकनीक" : "IPM Method",
    },
    {
      href: "/crop-calendar",
      title_hi: "फसल कैलेंडर",
      title_en: "Crop Calendar",
      desc_hi: "माह-वार बुवाई, सिंचाई, खाद प्रबंधन एवं कृषि कार्य योजना।",
      desc_en: "Month-wise agronomic calendar and farming operations.",
      icon: <Calendar className="size-6 text-[#14532d]" />,
      badge: lang === "hi" ? "मासिक" : "Monthly",
    },
    {
      href: "/soil-health",
      title_hi: "मृदा स्वास्थ्य व परीक्षण",
      title_en: "Soil Health & Testing",
      desc_hi: "खेत की मिट्टी जांच की 5-चरणीय विधि एवं निकटतम लैब डायरेक्टरी।",
      desc_en: "Soil sampling protocol and state soil testing lab directory.",
      icon: <Layers className="size-6 text-[#854d0e]" />,
      badge: lang === "hi" ? "सॉइल कार्ड" : "Soil Card",
    },
    {
      href: "/machinery",
      title_hi: "कृषि यंत्र व अनुदान",
      title_en: "Farm Machinery",
      desc_hi: "सुपर सीडर, रोटावेटर एवं कृषि यंत्रों पर 50% तक सरकारी सब्सिडी।",
      desc_en: "Modern farm tools, operational guides, and token subsidies.",
      icon: <Wrench className="size-6 text-[#6b7280]" />,
      badge: lang === "hi" ? "टोकन अनुदान" : "Subsidies",
    },
    {
      href: "/kvk",
      title_hi: "केवीके व विश्वविद्यालय",
      title_en: "KVK & Universities",
      desc_hi: "उ.प्र. के कृषि विज्ञान केंद्रों के संपर्क सूत्र, प्रशिक्षण एवं शोध।",
      desc_en: "Krishi Vigyan Kendra directory and university extension cells.",
      icon: <GraduationCap className="size-6 text-[#14532d]" />,
      badge: lang === "hi" ? "NDUAT केंद्र" : "NDUAT Centers",
    },
    {
      href: "/knowledge",
      title_hi: "कृषि ज्ञान केंद्र",
      title_en: "Knowledge Center",
      desc_hi: "प्राकृतिक खेती, बागवानी, डेयरी, पशुपालन व मशरूम उत्पादन।",
      desc_en: "Scientific guides on natural farming, dairy, and horticulture.",
      icon: <BookOpen className="size-6 text-[#15803d]" />,
      badge: lang === "hi" ? "मार्गदर्शिका" : "Guides",
    },
    {
      href: "/helpline",
      title_hi: "कृषि हेल्पलाइन",
      title_en: "Helplines",
      desc_hi: "किसान कॉल सेंटर (1800-180-1551) व आपातकालीन संपर्क नंबर।",
      desc_en: "Toll-free Kisan Call Centre and emergency department contacts.",
      icon: <Phone className="size-6 text-[#15803d]" />,
      badge: lang === "hi" ? "टोल-फ्री" : "Toll-Free",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section with Rotating Background Carousel */}
      <section className="relative overflow-hidden border-b border-[#c9d5cc] pt-10 pb-12 sm:pb-16 px-4 sm:px-6 min-h-[520px] flex items-center">
        {/* Carousel Background Images with 100% Full Visibility & Crossfade */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {HERO_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              style={{
                backgroundImage: `url(${img})`,
                opacity: idx === currentSlide ? 1 : 0,
              }}
            />
          ))}
        </div>

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-white/90 hover:bg-white text-[#14532d] shadow-lg border border-[#c9d5cc] hidden sm:flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
        >
          <ChevronLeft className="size-6" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-white/90 hover:bg-white text-[#14532d] shadow-lg border border-[#c9d5cc] hidden sm:flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
        >
          <ChevronRight className="size-6" />
        </button>

        {/* Content Container - 100% Transparent Hero Intro (No white box, full background image visibility) */}
        <div className="max-w-7xl mx-auto relative z-10 w-full py-4">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/90 border border-[#86efac] text-[#14532d] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-xs">
              <CheckCircle2 className="size-4 text-[#15803d]" />
              <span>
                {lang === "hi"
                  ? "अवध किसान सेवा • प्रमाणित डिजिटल कृषि मंच"
                  : "Awadh Kisan Seva • Verified Digital Agriculture Platform"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#14532d] tracking-tight leading-tight drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]">
              {lang === "hi" ? "किसान की प्रगति, प्रदेश की समृद्धि" : "Progress of Farmers, Prosperity of UP"}
            </h1>

            <p className="text-base sm:text-lg text-[#1f2937] leading-relaxed font-semibold max-w-2xl drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
              {lang === "hi"
                ? "सम्पूर्ण उत्तर प्रदेश के किसानों के लिए पूर्णतः विश्वसनीय डिजिटल कृषि सहायता मंच। प्रदेश के सभी 75 जनपदों हेतु फसल मार्गदर्शन, रोग प्रबंधन, दैनिक मंडी भाव, मौसम पूर्वानुमान एवं सरकारी योजनाओं की प्रामाणिक जानकारी — वैज्ञानिक संस्तुतियों पर आधारित।"
                : "Complete Digital Agriculture Support Platform for Farmers Across Uttar Pradesh. Verified crop guidance, pest alerts, live mandi prices, and government schemes covering all 75 districts."}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3 pt-2">
              <Link href="/crops" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md justify-center">
                  <Sprout className="size-5" />
                  <span>{lang === "hi" ? "फसल जानकारी देखें" : "Explore Crops"}</span>
                </Button>
              </Link>

              <Link href="/ask-expert" className="w-full sm:w-auto">
                <Button variant="accent" size="lg" className="w-full sm:w-auto shadow-md text-[#14532d] justify-center">
                  <HelpCircle className="size-5" />
                  <span>{lang === "hi" ? "विशेषज्ञ से सलाह लें" : "Consult Expert"}</span>
                </Button>
              </Link>

              <Link href="/mandi" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white hover:bg-gray-50 shadow-md border-[#15803d] text-[#15803d] font-bold justify-center">
                  <TrendingUp className="size-5" />
                  <span>{lang === "hi" ? "आज के मंडी भाव" : "Mandi Prices"}</span>
                </Button>
              </Link>
            </div>

            {/* Quick Helpline Strip - Transparent pill */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#1f2937]">
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/80 shadow-xs">
                <span className="font-bold text-[#14532d] flex items-center gap-1.5">
                  <Phone className="size-4 text-[#15803d]" />
                  {lang === "hi" ? "किसान कॉल सेंटर:" : "Kisan Call Centre:"}
                </span>
                <a
                  href="tel:18001801551"
                  className="font-extrabold text-[#15803d] hover:underline"
                >
                  {lang === "hi" ? "1800-180-1551 (टोल-फ्री)" : "1800-180-1551 (Toll-Free)"}
                </a>
                <span className="text-[11px] text-[#4b5563] font-medium hidden sm:inline">
                  {lang === "hi"
                    ? "(प्रातः 6:00 से रात्रि 10:00 बजे तक)"
                    : "(6:00 AM to 10:00 PM Daily)"}
                </span>
              </div>
            </div>
          </div>

          {/* Carousel Slide Indicators */}
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-6">
            {HERO_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === currentSlide
                    ? "w-8 h-2.5 bg-[#15803d]"
                    : "w-2.5 h-2.5 bg-white/90 hover:bg-white border border-[#c9d5cc]"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="success" size="md" className="mb-2">
            {lang === "hi" ? "डिजिटल किसान सेवाएँ" : "Digital Farmer Services"}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14532d]">
            {lang === "hi" ? "उत्तर प्रदेश किसान सहायता पोर्टल सेवाएँ" : "Core Agricultural Modules"}
          </h2>
          <p className="text-sm text-[#4b5563] mt-2">
            {lang === "hi"
              ? "बुवाई से लेकर बाजार में फसल बेचने तक, हर कदम पर प्रामाणिक जानकारी व मार्गदर्शन"
              : "Comprehensive agricultural solutions from seed selection to market prices"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((srv, idx) => (
            <Link
              key={idx}
              href={srv.href}
              className="agri-card p-5 flex flex-col justify-between group no-underline"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-[#f0fdf4] group-hover:bg-[#dcfce7] transition-colors border border-[#bbf7d0]">
                    {srv.icon}
                  </div>
                  <Badge variant="outline" size="sm">{srv.badge}</Badge>
                </div>

                <h3 className="font-bold text-base text-[#14532d] group-hover:text-[#15803d] transition-colors mb-1.5">
                  {lang === "hi" ? srv.title_hi : srv.title_en}
                </h3>

                <p className="text-xs text-[#4b5563] leading-relaxed">
                  {lang === "hi" ? srv.desc_hi : srv.desc_en}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-[#f3f4f6] flex items-center justify-between text-xs font-bold text-[#15803d]">
                <span>{lang === "hi" ? "विस्तार से देखें" : "Explore"}</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Crop Knowledge & Seasonal Calendar Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <Badge variant="success" size="sm" className="mb-1">
              {lang === "hi" ? "सस्य संदर्शिका" : "Agronomic Guide"}
            </Badge>
            <h2 className="text-xl sm:text-2xl font-black text-[#14532d]">
              {lang === "hi" ? "फसल ज्ञान एवं मौसमी संदर्शिका" : "Crop Knowledge & Seasons"}
            </h2>
          </div>
          <Link href="/crops" className="text-xs font-bold text-[#15803d] hover:underline flex items-center gap-1">
            <span>{lang === "hi" ? "सभी फसलें देखें" : "View All Crops"}</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kharif */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src="/crops/paddy.jpg"
                  alt="Kharif Crops"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <span className="absolute top-3 left-3 text-xs font-bold text-[#f97316] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#ffedd5] shadow-xs flex items-center gap-1.5">
                  <Calendar className="size-3 text-[#f97316]" />
                  {lang === "hi" ? "खरीफ फसलें (जून - अक्टूबर)" : "Kharif Crops (Jun - Oct)"}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#14532d] text-base mb-1">
                  {lang === "hi" ? "धान, मक्का, बाजरा, उर्द" : "Paddy, Maize, Bajra, Urad"}
                </h3>
                <p className="text-xs text-[#4b5563] leading-relaxed">
                  {lang === "hi"
                    ? "मानसूनी वर्षा आधारित फसलें। बुवाई समय: जून-जुलाई। जल प्रबंधन, नर्सरी तैयारी एवं संतुलित एनपीके मार्गदर्शन।"
                    : "Monsoon season crops. Sowing time: June-July. Water management, nursery preparation, and balanced NPK guidance."}
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 pt-0">
              <Link href="/crops?season=kharif" className="text-xs font-bold text-[#15803d] hover:underline flex items-center gap-1">
                <span>{lang === "hi" ? "खरीफ पैकेज देखें" : "Explore Kharif Package"}</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* Rabi */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src="/crops/wheat.jpg"
                  alt="Rabi Crops"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <span className="absolute top-3 left-3 text-xs font-bold text-[#15803d] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#86efac] shadow-xs flex items-center gap-1.5">
                  <Calendar className="size-3 text-[#15803d]" />
                  {lang === "hi" ? "रबी फसलें (अक्टूबर - मार्च)" : "Rabi Crops (Oct - Mar)"}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#14532d] text-base mb-1">
                  {lang === "hi" ? "गेहूँ, सरसों, चना, मटर" : "Wheat, Mustard, Gram, Peas"}
                </h3>
                <p className="text-xs text-[#4b5563] leading-relaxed">
                  {lang === "hi"
                    ? "शीतकालीन फसलें। बुवाई समय: अक्टूबर-नवंबर। सिंचित दशा में क्राउन रूट इनिशिएशन (CRI) सिंचाई एवं खरपतवार नियंत्रण।"
                    : "Winter season crops. Sowing time: October-November. Irrigated conditions Crown Root Initiation (CRI) and weed management."}
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 pt-0">
              <Link href="/crops?season=rabi" className="text-xs font-bold text-[#15803d] hover:underline flex items-center gap-1">
                <span>{lang === "hi" ? "रबी पैकेज देखें" : "Explore Rabi Package"}</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* Zaid */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src="/crops/maize.jpg"
                  alt="Zaid Crops"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <span className="absolute top-3 left-3 text-xs font-bold text-[#ca8a04] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#fef08a] shadow-xs flex items-center gap-1.5">
                  <Calendar className="size-3 text-[#ca8a04]" />
                  {lang === "hi" ? "जायद फसलें (मार्च - जून)" : "Zaid Crops (Mar - Jun)"}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#14532d] text-base mb-1">
                  {lang === "hi" ? "मूंग, उड़द, तरबूज, खीरा" : "Moong, Urad, Watermelon, Cucumber"}
                </h3>
                <p className="text-xs text-[#4b5563] leading-relaxed">
                  {lang === "hi"
                    ? "ग्रीष्मकालीन फसलें। बुवाई समय: मार्च-अप्रैल। अतिरिक्त आय सृजन हेतु 60-70 दिनों की अल्पकालिक दलहन व कुकरबिट्स।"
                    : "Summer season crops. Sowing time: March-April. Short-duration pulses and cucurbits for extra farm income."}
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 pt-0">
              <Link href="/crops?season=zaid" className="text-xs font-bold text-[#15803d] hover:underline flex items-center gap-1">
                <span>{lang === "hi" ? "जायद पैकेज देखें" : "Explore Zaid Package"}</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disease, Pests & Soil Health Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Disease Management */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src="/pests/plant-disease.jpg"
                  alt="Crop Disease Management"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs font-bold text-white bg-red-600/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                  <ShieldAlert className="size-3.5" />
                  {lang === "hi" ? "सटीक वैज्ञानिक रोकथाम" : "Scientific Disease Control"}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-red-50 text-red-700">
                    <ShieldAlert className="size-4" />
                  </div>
                  <h3 className="font-bold text-base text-[#14532d]">
                    {lang === "hi" ? "फसल रोग एवं कीट नियंत्रण (IPM)" : "Crop Disease & Pest Management (IPM)"}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  {lang === "hi"
                    ? "गेहूँ का पीला रतुआ, धान का झुलसा, सरसों का छाछिया रोग एवं फॉल आर्मीवर्म जैसे विनाशकारी कीटों की प्रारंभिक पहचान एवं समन्वित जैविक-रासायनिक प्रबंधन।"
                    : "Early identification and integrated biological-chemical management of Yellow Rust in wheat, Blast in paddy, Powdery Mildew in mustard, and Fall Armyworm."}
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-0 flex gap-3">
              <Link href="/diseases">
                <Button variant="outline" size="sm">
                  {lang === "hi" ? "रोग निर्देशिका देखें" : "View Disease Directory"}
                </Button>
              </Link>
              <Link href="/pests">
                <Button variant="outline" size="sm">
                  {lang === "hi" ? "कीट नियंत्रण (IPM)" : "Pest Management (IPM)"}
                </Button>
              </Link>
            </div>
          </div>

          {/* Soil Health & Testing */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src="/soil/soil-health-card.jpg"
                  alt="Soil Health Testing"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs font-bold text-white bg-amber-600/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                  <Layers className="size-3.5" />
                  {lang === "hi" ? "उर्वरक बचत व जांच" : "Fertilizer Savings & Labs"}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                    <Layers className="size-4" />
                  </div>
                  <h3 className="font-bold text-base text-[#14532d]">
                    {lang === "hi" ? "मृदा स्वास्थ्य एवं प्रयोगशाला परीक्षण" : "Soil Health & Laboratory Testing"}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  {lang === "hi"
                    ? "खेत की मिट्टी का नमूना लेने की प्रामाणिक 5-चरणीय विधि, सॉइल हेल्थ कार्ड का महत्व एवं उत्तर प्रदेश के सभी 75 जिलों में स्थित सरकारी मृदा परीक्षण प्रयोगशालाओं की सूची।"
                    : "Standard 5-step soil sampling protocol, significance of Soil Health Cards, and directory of government soil testing laboratories across all 75 UP districts."}
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-0 flex gap-3">
              <Link href="/soil-health">
                <Button variant="outline" size="sm">
                  {lang === "hi" ? "मिट्टी जांच विधि" : "Soil Testing Method"}
                </Button>
              </Link>
              <Link href="/seeds-fertilizers">
                <Button variant="outline" size="sm">
                  {lang === "hi" ? "उर्वरक मात्रा (NPK)" : "Fertilizer Doses (NPK)"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Video & Articles Learning Center */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <Badge variant="accent" size="sm" className="mb-1 text-[#14532d]">
                {lang === "hi" ? "कृषि शिक्षा" : "Agri Education"}
              </Badge>
              <h2 className="text-xl sm:text-2xl font-black text-[#14532d]">
                {lang === "hi" ? "वीडियो ट्यूटोरियल एवं अनुसंधान लेख" : "Video Tutorials & Research Articles"}
              </h2>
            </div>
            <Link href="/videos" className="text-xs font-bold text-[#15803d] hover:underline flex items-center gap-1">
              <span>{lang === "hi" ? "वीडियो लाइब्रेरी देखें" : "Watch Videos"}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-xs overflow-hidden flex flex-col justify-between">
              <img src="/schemes/solar-pump.jpg" alt="Solar Pump" className="w-full h-28 object-cover" />
              <div className="p-3.5">
                <h4 className="font-bold text-sm text-[#14532d] mb-1">
                  {lang === "hi" ? "सोलर पंप अनुदान" : "Solar Pump Subsidy"}
                </h4>
                <p className="text-xs text-[#4b5563] line-clamp-2">
                  {lang === "hi"
                    ? "कुसुम योजना अंतर्गत सोलर पंप हेतु ऑनलाइन टोकन प्रक्रिया।"
                    : "Online token process for solar pump subsidies under PM-KUSUM."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-xs overflow-hidden flex flex-col justify-between">
              <img src="/seeds/organic-compost.jpg" alt="Natural Jeevamrit" className="w-full h-28 object-cover" />
              <div className="p-3.5">
                <h4 className="font-bold text-sm text-[#14532d] mb-1">
                  {lang === "hi" ? "प्राकृतिक जीवामृत निर्माण" : "Natural Jeevamrit Prep"}
                </h4>
                <p className="text-xs text-[#4b5563] line-clamp-2">
                  {lang === "hi"
                    ? "देसी गाय के गोबर-गोमूत्र से जीवामृत और घनजीवामृत बनाने की विधि।"
                    : "Preparation method of Jeevamrit and Ghan-Jeevamrit from indigenous cattle."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-xs overflow-hidden flex flex-col justify-between">
              <img src="/schemes/khet-talab.jpg" alt="Drip Irrigation" className="w-full h-28 object-cover" />
              <div className="p-3.5">
                <h4 className="font-bold text-sm text-[#14532d] mb-1">
                  {lang === "hi" ? "ड्रिप व स्प्रिंकलर सिंचाई" : "Drip & Sprinkler Irrigation"}
                </h4>
                <p className="text-xs text-[#4b5563] line-clamp-2">
                  {lang === "hi"
                    ? "प्रति बूंद अधिक फसल योजना अंतर्गत 90% तक जल बचत तकनीक।"
                    : "Up to 90% water saving techniques under Per Drop More Crop."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-xs overflow-hidden flex flex-col justify-between">
              <img src="/crops/sugarcane.jpg" alt="Farmer Success Story" className="w-full h-28 object-cover" />
              <div className="p-3.5">
                <h4 className="font-bold text-sm text-[#14532d] mb-1">
                  {lang === "hi" ? "सफलता की कहानी" : "Farmer Success Story"}
                </h4>
                <p className="text-xs text-[#4b5563] line-clamp-2">
                  {lang === "hi"
                    ? "ड्रैगन फ्रूट एवं मोती पालन से 5 लाख वार्षिक आय करने वाले किसान।"
                    : "Farmer achieving ₹5 Lakh annual income through dragon fruit cultivation."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-[#f8faf5] rounded-xl border border-[#e5e7eb]">
              <div className="size-12 bg-[#dcfce7] text-[#15803d] rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="size-6" />
              </div>
              <h4 className="font-bold text-[#14532d] text-base mb-1">
                {lang === "hi" ? "शून्य-भ्रम सत्यापन नीति" : "Zero-Misinformation Policy"}
              </h4>
              <p className="text-xs text-[#4b5563]">
                {lang === "hi"
                  ? "प्रत्येक सिफारिश पर मूल स्रोत संस्थान एवं सत्यापन तिथि अंकित होती है।"
                  : "Every recommendation carries its verified institutional source and timestamp."}
              </p>
            </div>

            <div className="p-4 bg-[#f8faf5] rounded-xl border border-[#e5e7eb]">
              <div className="size-12 bg-[#fef3c7] text-[#92400e] rounded-full flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="size-6" />
              </div>
              <h4 className="font-bold text-[#14532d] text-base mb-1">
                {lang === "hi" ? "वैज्ञानिक व विशेषज्ञ परामर्श" : "Scientific & Expert Advisory"}
              </h4>
              <p className="text-xs text-[#4b5563]">
                {lang === "hi"
                  ? "NDUAT के योग्य कृषि वैज्ञानिकों द्वारा अनुमोदित सस्य एवं पौध संरक्षण तकनीक।"
                  : "Agronomic and crop protection protocols verified by agricultural scientists."}
              </p>
            </div>

            <div className="p-4 bg-[#f8faf5] rounded-xl border border-[#e5e7eb]">
              <div className="size-12 bg-[#e0f2fe] text-[#0369a1] rounded-full flex items-center justify-center mx-auto mb-3">
                <ExternalLink className="size-6" />
              </div>
              <h4 className="font-bold text-[#14532d] text-base mb-1">
                {lang === "hi" ? "सीधे आधिकारिक पोर्टल" : "Direct Official Portals"}
              </h4>
              <p className="text-xs text-[#4b5563]">
                {lang === "hi"
                  ? "सरकारी योजनाओं हेतु केवल वैध (.gov.in / .nic.in) पोर्टलों के लिंक।"
                  : "Authoritative direct links to verified government (.gov.in / .nic.in) services."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ask an Expert CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="bg-gradient-to-r from-[#14532d] via-[#15803d] to-[#14532d] rounded-2xl p-8 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">
              {lang === "hi" ? "फसल में कोई समस्या है? कृषि वैज्ञानिक से पूछें!" : "Have a crop issue? Ask our agriculture experts!"}
            </h3>
            <p className="text-xs sm:text-sm text-[#86efac] max-w-xl">
              {lang === "hi"
                ? "पत्तियों पर धब्बे, कीट का प्रकोप या उर्वरक की मात्रा समझ न आए तो फोटो खींचकर हमारे वैज्ञानिकों को भेजें। निःशुल्क परामर्श प्राप्त करें।"
                : "Submit details or photo of crop damage to receive expert diagnosis and scientific recommendations."}
            </p>
          </div>

          <Link href="/ask-expert" className="shrink-0">
            <Button variant="accent" size="lg" className="shadow-md text-[#14532d] font-bold">
              <HelpCircle className="size-5" />
              <span>{lang === "hi" ? "अभी प्रश्न पूछें (निःशुल्क)" : "Ask a Question Now"}</span>
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
