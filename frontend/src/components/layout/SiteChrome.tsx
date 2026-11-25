"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  Search,
  HelpCircle,

  User,
  ShieldCheck,
  TrendingUp,
  CloudSun,
  FileText,
  MapPin,
  Calendar,
  BookOpen,
  Mail,
  ExternalLink,
  GraduationCap,
  Code,
  ChevronDown,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { GoogleTranslateWidget } from "./GoogleTranslateWidget";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const { t, lang, setLang, fontSize, setFontSize } = useI18n();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = encodeURIComponent(searchQuery.trim());
    if (searchCategory === "crops") {
      window.location.href = `/crops?q=${query}`;
    } else if (searchCategory === "mandi") {
      window.location.href = `/mandi?commodity=${query}`;
    } else if (searchCategory === "schemes") {
      window.location.href = `/schemes?q=${query}`;
    } else if (searchCategory === "diseases") {
      window.location.href = `/diseases?q=${query}`;
    } else {
      window.location.href = `/crops?q=${query}`;
    }
  };

  const navGroups = [
    {
      id: "home",
      label: t("nav.home"),
      href: "/",
    },
    {
      id: "farmer-services",
      label: t("nav.farmerServices"),
      items: [
        { label: t("nav.farmerRegistration"), href: "/register", desc: lang === "hi" ? "किसान नया पंजीकरण (6-अंकीय पिन कोड सहित)" : "New farmer registration with PIN code" },
        { label: t("nav.farmerLogin"), href: "/login", desc: lang === "hi" ? "किसान एवं विशेषज्ञ लॉगिन" : "Sign in to farmer portal" },
        { label: t("nav.askExpert"), href: "/ask-expert", desc: lang === "hi" ? "विशेषज्ञ से फसल सलाह एवं समाधान" : "Direct agricultural expert consultation" },
        { label: t("nav.farmerSupport"), href: "/helpline", desc: lang === "hi" ? "टोल-फ्री किसान कॉल सेंटर" : "Farmer support & grievance redressal" },
        { label: t("nav.helpline"), href: "/helpline", desc: lang === "hi" ? "1800-180-1551 आपातकालीन हेल्पलाइन" : "1800-180-1551 Kisan Helpline" },
        { label: t("nav.dashboard"), href: "/dashboard", desc: lang === "hi" ? "व्यक्तिगत किसान डैशबोर्ड" : "Farmer profile & crop tracking" },
        { label: t("nav.faq"), href: "/faq", desc: lang === "hi" ? "प्रायः पूछे जाने वाले कृषि प्रश्न" : "Frequently asked questions" },
      ],
    },
    {
      id: "crop-knowledge",
      label: t("nav.cropKnowledge"),
      items: [
        { label: t("nav.cropInfo"), href: "/crops", desc: lang === "hi" ? "खरीफ, रबी, जायद व उद्यानिकी फसलें" : "Scientific agronomic packages" },
        { label: t("nav.cropCalendar"), href: "/crop-calendar", desc: lang === "hi" ? "माहवार बुवाई, सिंचाई व कटाई समय" : "Monthly farming calendar" },
        { label: t("nav.cropVarieties"), href: "/seeds-fertilizers", desc: lang === "hi" ? "उन्नत प्रमाणित किस्में व बीज दर" : "Certified seed varieties & sowing rates" },
        { label: t("nav.seasonalCrops"), href: "/crops", desc: lang === "hi" ? "मौसमी फसलें (खरीफ/रबी/जायद)" : "Seasonal crop guidance" },
        { label: t("nav.modernTechniques"), href: "/knowledge", desc: lang === "hi" ? "आधुनिक कृषि तकनीक व पॉलीहाउस" : "Modern agriculture techniques" },
        { label: t("nav.districts"), href: "/districts", desc: lang === "hi" ? "उ.प्र. 75 जनपदों की कृषि प्रोफाइल" : "UP 75 districts agricultural directory" },
      ],
    },
    {
      id: "crop-protection",
      label: t("nav.cropProtection"),
      items: [
        { label: t("nav.cropDiseases"), href: "/diseases", desc: lang === "hi" ? "फसल रोग पहचान व निवारण" : "Crop diseases directory & diagnosis" },
        { label: t("nav.pestManagement"), href: "/pests", desc: lang === "hi" ? "समन्वित कीट प्रबंधन (IPM)" : "Integrated pest management" },
        { label: t("nav.diseaseIdentification"), href: "/diseases", desc: lang === "hi" ? "लक्षणों के आधार पर रोग पहचान" : "Symptom-based disease identification" },
        { label: t("nav.preventionControl"), href: "/diseases", desc: lang === "hi" ? "रोकथाम एवं जैविक-रासायनिक नियंत्रण" : "Prevention and control measures" },
        { label: t("nav.plantProtection"), href: "/weather", desc: lang === "hi" ? "आईएमडी मौसम चेतावनी व पौध सुरक्षा" : "IMD agro-weather advisories" },
      ],
    },
    {
      id: "agri-resources",
      label: t("nav.agriResources"),
      items: [
        { label: t("nav.soilHealth"), href: "/soil-health", desc: lang === "hi" ? "मृदा नमूना जांच विधि व प्रयोगशाला" : "Soil testing labs & Soil Health Cards" },
        { label: t("nav.seedsFertilizers"), href: "/seeds-fertilizers", desc: lang === "hi" ? "प्रमाणित बीज व संतुलित उर्वरक (NPK)" : "Certified seeds & balanced fertilizers" },
        { label: t("nav.irrigationManagement"), href: "/knowledge", desc: lang === "hi" ? "ड्रिप व स्प्रिंकलर सूक्ष्म सिंचाई" : "Micro-irrigation & water management" },
        { label: t("nav.farmMachinery"), href: "/machinery", desc: lang === "hi" ? "ट्रैक्टर, रोटावेटर व टोकन सब्सिडी" : "Farm machinery & token subsidies" },
        { label: t("nav.organicFarming"), href: "/knowledge", desc: lang === "hi" ? "प्राकृतिक खेती व जीवामृत विधि" : "Organic & natural farming practices" },
        { label: t("nav.horticultureAllied"), href: "/knowledge", desc: lang === "hi" ? "उद्यानिकी, डेयरी व मत्स्य पालन" : "Horticulture, dairy & fisheries" },
        { label: t("nav.mandiPrices"), href: "/mandi", desc: lang === "hi" ? "एगमार्कनेट दैनिक थोक मंडी भाव" : "Agmarknet daily wholesale mandi rates" },
      ],
    },
    {
      id: "govt-schemes",
      label: t("nav.govtSchemes"),
      items: [
        { label: t("nav.centralSchemes"), href: "/schemes", desc: lang === "hi" ? "पीएम-किसान, मानधन व राष्ट्रीय योजनाएँ" : "PM-Kisan, PM-KMY & Central Schemes" },
        { label: t("nav.upSchemes"), href: "/schemes", desc: lang === "hi" ? "उत्तर प्रदेश सरकार की कल्याण योजनाएँ" : "Uttar Pradesh state farmer schemes" },
        { label: t("nav.agriSubsidies"), href: "/schemes", desc: lang === "hi" ? "सोलर पंप व कृषि यंत्र सब्सिडी" : "Machinery & solar pump subsidies" },
        { label: t("nav.cropInsurance"), href: "/schemes", desc: lang === "hi" ? "प्रधानमंत्री फसल बीमा योजना (PMFBY)" : "Pradhan Mantri Fasal Bima Yojana" },
        { label: t("nav.farmerBenefits"), href: "/schemes", desc: lang === "hi" ? "किसान क्रेडिट कार्ड (KCC) व अनुदान" : "Kisan Credit Card & benefits" },
      ],
    },
    {
      id: "knowledge-center",
      label: t("nav.knowledgeCenter"),
      items: [
        { label: t("nav.kvk"), href: "/kvk", desc: lang === "hi" ? "उ.प्र. 75 जिलों के केवीके संपर्क" : "KVK directory & extension cells" },
        { label: t("nav.farmerTraining"), href: "/kvk", desc: lang === "hi" ? "कृषि प्रशिक्षण कार्यक्रम व कार्यशालाएँ" : "Agricultural skill & training programs" },
        { label: t("nav.videoTutorials"), href: "/videos", desc: lang === "hi" ? "वैज्ञानिक खेती व रोग उपचार वीडियो" : "Educational farming videos" },
        { label: t("nav.eLibrary"), href: "/articles", desc: lang === "hi" ? "विश्वविद्यालय शोध लेख व प्रकाशन" : "Research publications & manual guides" },
        { label: t("nav.successStories"), href: "/success-stories", desc: lang === "hi" ? "प्रगतिशील किसानों की सफलता गाथाएँ" : "Inspiring farmer case studies" },
      ],
    },
    {
      id: "about-us",
      label: t("nav.aboutUs"),
      items: [
        { label: t("nav.aboutPlatform"), href: "/about", desc: lang === "hi" ? "अवध किसान सेवा मंच का परिचय व ध्येय" : "Platform mission & objectives" },
        { label: t("nav.missionVision"), href: "/about", desc: lang === "hi" ? "किसान की प्रगति, प्रदेश की समृद्धि" : "Mission & vision statement" },
        { label: t("nav.contactUs"), href: "/contact", desc: lang === "hi" ? "परियोजना सलाहकार व डेवलपर संपर्क" : "Academic mentor & developer contacts" },
        { label: t("nav.disclaimer"), href: "/disclaimer", desc: lang === "hi" ? "सत्यापित स्रोत एवं नियम शर्तें" : "Data source policy & disclaimer" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf5] text-[#1f2937]">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        {t("a11y.skip")}
      </a>

      {/* Tricolor Identity Accent Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#f97316] via-white to-[#15803d]" />

      {/* Top Utility & Accessibility Bar */}
      <div className="bg-[#14532d] text-white py-1.5 px-3 sm:px-6 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-[#86efac] animate-pulse" />
            <span className="font-medium text-white/95">
              {lang === "hi"
                ? "अवध किसान सेवा • डिजिटल किसान सहायता मंच"
                : "Awadh Kisan Seva • Digital Farmer Support Platform"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Helpline quick link */}
            <a
              href="tel:18001801551"
              className="inline-flex items-center gap-1.5 text-white/95 hover:text-[#fef08a] transition-colors"
            >
              <Phone className="size-3.5" />
              <span>1800-180-1551 ({lang === "hi" ? "टोल-फ्री" : "Toll-Free"})</span>
            </a>

            {/* Font size controller */}
            <div className="hidden sm:flex items-center gap-1 border-l border-white/20 pl-3">
              <span className="text-[11px] text-white/70 mr-1">{t("a11y.fontSize")}:</span>
              <button
                type="button"
                onClick={() => setFontSize("sm")}
                className={clsx(
                  "px-1.5 py-0.5 rounded text-xs font-semibold cursor-pointer",
                  fontSize === "sm" ? "bg-white text-[#14532d]" : "hover:bg-white/20 text-white"
                )}
                title="छोटा आकार"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize("md")}
                className={clsx(
                  "px-1.5 py-0.5 rounded text-xs font-semibold cursor-pointer",
                  fontSize === "md" ? "bg-white text-[#14532d]" : "hover:bg-white/20 text-white"
                )}
                title="सामान्य आकार"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("lg")}
                className={clsx(
                  "px-1.5 py-0.5 rounded text-xs font-semibold cursor-pointer",
                  fontSize === "lg" ? "bg-white text-[#14532d]" : "hover:bg-white/20 text-white"
                )}
                title="बड़ा आकार"
              >
                A+
              </button>
            </div>

            {/* Google Translate Integration + Native Lang Toggle */}
            <div className="flex items-center gap-2 border-l border-white/20 pl-3">
              <GoogleTranslateWidget />

              <div className="flex items-center gap-1 border-l border-white/20 pl-2">
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={clsx(
                    "px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer",
                    lang === "en"
                      ? "bg-[#eab308] text-[#1f2937]"
                      : "text-white hover:bg-white/20"
                  )}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLang("hi")}
                  className={clsx(
                    "px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer",
                    lang === "hi"
                      ? "bg-[#eab308] text-[#1f2937]"
                      : "text-white hover:bg-white/20"
                  )}
                >
                  हिन्दी
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <header className="bg-white border-b border-[#e5e7eb] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Logo and Platform Name */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 no-underline group min-w-0">
              <div
                className="relative rounded-full overflow-hidden border-2 border-[#15803d] shadow-xs group-hover:scale-105 transition-transform bg-white flex items-center justify-center p-0.5 shrink-0 size-11 sm:size-14"
              >
                <img
                  src="/logo/awadh-kisan-seva.png"
                  alt="अवध किसान सेवा लोगो"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-base sm:text-2xl font-black text-[#14532d] tracking-tight truncate">
                    {t("meta.siteName")}
                  </h1>
                  <span className="text-[10px] font-bold bg-[#dcfce7] text-[#14532d] px-1.5 sm:px-2 py-0.5 rounded-full border border-[#86efac] shrink-0">
                    {lang === "hi" ? "उ.प्र." : "UP"}
                  </span>
                </div>
                <p className="text-[11px] sm:text-sm font-semibold text-[#15803d] truncate">
                  {t("meta.tagline")}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#6b7280] hidden sm:block truncate">
                  {lang === "hi" ? "समग्र डिजिटल कृषि संदर्शिका एवं किसान सेवा" : "Digital Agriculture & Farmer Support"}
                </p>
              </div>
            </Link>

            {/* Central Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center flex-1 max-w-lg mx-4 border-2 border-[#15803d] rounded-lg overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-[#15803d]"
            >
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="bg-[#f8faf5] text-xs font-semibold text-[#14532d] px-3 py-2 border-r border-[#e5e7eb] outline-none cursor-pointer"
              >
                <option value="all">{lang === "hi" ? "सभी" : "All"}</option>
                <option value="crops">{lang === "hi" ? "फसलें" : "Crops"}</option>
                <option value="mandi">{lang === "hi" ? "मंडी" : "Mandi"}</option>
                <option value="schemes">{lang === "hi" ? "योजनाएँ" : "Schemes"}</option>
                <option value="diseases">{lang === "hi" ? "रोग/कीट" : "Diseases"}</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("common.searchPlaceholder")}
                className="flex-1 px-3 py-2 text-sm text-[#1f2937] outline-none"
              />
              <button
                type="submit"
                className="bg-[#15803d] text-white px-4 py-2 hover:bg-[#14532d] transition-colors cursor-pointer flex items-center justify-center"
                title={t("common.search")}
              >
                <Search className="size-4" />
              </button>
            </form>

            {/* Right Action CTAs */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/ask-expert"
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#eab308] hover:bg-[#ca8a04] text-[#1f2937] font-bold text-xs sm:text-sm px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <HelpCircle className="size-4" />
                <span>{t("nav.askExpert")}</span>
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="inline-flex items-center gap-1.5 bg-[#dcfce7] border border-[#86efac] text-[#14532d] hover:bg-[#bbf7d0] font-bold text-xs sm:text-sm px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs"
                  >
                    <div className="size-6 bg-[#15803d] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="max-w-[130px] truncate">{user.full_name}</span>
                    <ChevronDown className={clsx("size-3.5 transition-transform", userMenuOpen && "rotate-180")} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#e5e7eb] py-2 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-[#f3f4f6]">
                        <p className="font-extrabold text-[#14532d] text-sm truncate">{user.full_name}</p>
                        <p className="text-[#6b7280] truncate">{user.email || user.phone}</p>
                        {user.district && (
                          <span className="inline-block mt-1 bg-[#f0fdf4] text-[#15803d] font-semibold px-2 py-0.5 rounded text-[10px] border border-[#bbf7d0]">
                            📍 {user.district}
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-[#374151] hover:bg-[#f8faf5] hover:text-[#15803d] font-semibold"
                        >
                          <User className="size-4 text-[#15803d]" />
                          <span>{t("nav.dashboard")}</span>
                        </Link>
                        {user.role === "super_admin" || user.role === "admin" ? (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-[#b45309] hover:bg-[#fefce8] font-semibold"
                          >
                            <ShieldCheck className="size-4 text-[#eab308]" />
                            <span>{t("nav.admin")}</span>
                          </Link>
                        ) : null}
                      </div>

                      <div className="pt-1 border-t border-[#f3f4f6]">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 font-semibold cursor-pointer"
                        >
                          <LogOut className="size-4" />
                          <span>{lang === "hi" ? "लॉगआउट करें" : "Sign Out"}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 border border-[#15803d] text-[#15803d] hover:bg-[#dcfce7] font-bold text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors"
                  >
                    <User className="size-3.5 sm:size-4" />
                    <span>{t("nav.login")}</span>
                  </Link>
                  <Link
                    href="/register"
                    className="hidden sm:inline-flex items-center gap-1.5 bg-[#15803d] text-white hover:bg-[#14532d] font-bold text-xs sm:text-sm px-3.5 py-2 rounded-lg shadow-xs transition-colors"
                  >
                    <span>{t("nav.register")}</span>
                  </Link>
                </div>
              )}

              {/* Hamburger Mobile Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg border border-[#e5e7eb] hover:bg-[#f3f4f6] text-[#14532d] cursor-pointer"
                aria-label={t("a11y.menu")}
              >
                {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex lg:hidden mt-2.5 border border-[#15803d] rounded-lg overflow-hidden bg-white shadow-xs"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("common.searchPlaceholder")}
              className="flex-1 px-3 py-2 text-xs sm:text-sm text-[#1f2937] outline-none"
            />
            <button
              type="submit"
              className="bg-[#15803d] text-white px-3 py-2 cursor-pointer flex items-center justify-center"
            >
              <Search className="size-4" />
            </button>
          </form>
        </div>

        {/* Primary Desktop Single-Row Navigation with Dropdowns */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:block bg-[#15803d] text-white border-t border-[#14532d] shadow-xs relative z-30"
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <ul className="flex items-center justify-between text-xs sm:text-sm font-semibold py-1">
              {navGroups.map((group) => {
                const isSingle = !group.items || group.items.length === 0;
                const isGroupActive =
                  (group.href && pathname === group.href) ||
                  (group.items && group.items.some((sub) => pathname === sub.href));
                const isOpen = openDropdown === group.id;

                if (isSingle) {
                  return (
                    <li key={group.id}>
                      <Link
                        href={group.href || "/"}
                        className={clsx(
                          "px-3 py-1.5 rounded-md inline-flex items-center transition-all",
                          isGroupActive
                            ? "bg-[#14532d] text-[#fef08a] font-bold shadow-xs"
                            : "text-white/95 hover:bg-[#14532d] hover:text-[#fef08a]"
                        )}
                      >
                        {group.label}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li
                    key={group.id}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(group.id)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(isOpen ? null : group.id)}
                      className={clsx(
                        "px-2.5 py-1.5 rounded-md inline-flex items-center gap-1 transition-all cursor-pointer",
                        isGroupActive || isOpen
                          ? "bg-[#14532d] text-[#fef08a] font-bold shadow-xs"
                          : "text-white/95 hover:bg-[#14532d] hover:text-[#fef08a]"
                      )}
                    >
                      <span>{group.label}</span>
                      <ChevronDown
                        className={clsx(
                          "size-3.5 transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Dropdown Menu Popup */}
                    <div
                      className={clsx(
                        "absolute left-0 top-full pt-1.5 w-64 transition-all duration-200 z-50",
                        isOpen
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-1 pointer-events-none"
                      )}
                    >
                      <div className="bg-white rounded-xl shadow-xl border border-[#e5e7eb] py-1.5 overflow-hidden ring-1 ring-black/5">
                        {group.items?.map((item) => {
                          const isSubActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href + item.label}
                              href={item.href}
                              onClick={() => setOpenDropdown(null)}
                              className={clsx(
                                "block px-3.5 py-2 transition-colors",
                                isSubActive
                                  ? "bg-[#dcfce7] text-[#14532d] font-bold"
                                  : "text-[#374151] hover:bg-[#f8faf5]"
                              )}
                            >
                              <div className="text-xs font-bold text-[#14532d]">
                                {item.label}
                              </div>
                              {item.desc && (
                                <div className="text-[11px] text-[#6b7280] line-clamp-1 mt-0.5">
                                  {item.desc}
                                </div>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation with Expandable Categories */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-5/6 max-w-sm bg-white h-full shadow-2xl flex flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <div className="flex items-center gap-2">
                <img
                  src="/logo/awadh-kisan-seva.png"
                  alt="अवध किसान सेवा"
                  className="size-8 object-contain"
                />
                <span className="font-extrabold text-[#14532d]">{t("meta.siteName")}</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-md hover:bg-[#f3f4f6] text-[#4b5563]"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Quick Actions in Mobile Drawer */}
            <div className="flex flex-col gap-2 mb-4">
              <Link
                href="/ask-expert"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#eab308] text-[#1f2937] font-bold p-2.5 rounded-lg text-center"
              >
                <HelpCircle className="size-4" />
                <span>{t("nav.askExpert")}</span>
              </Link>
              {user ? (
                <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-[#14532d] text-sm">{user.full_name}</p>
                      <p className="text-[11px] text-[#6b7280]">{user.phone || user.email}</p>
                    </div>
                    <span className="bg-[#dcfce7] text-[#15803d] font-bold px-2 py-0.5 rounded text-[10px]">
                      {user.district || "उ.प्र."}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#dcfce7]">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-[#15803d] text-white font-bold p-2 rounded-lg text-center text-xs"
                    >
                      {t("nav.dashboard")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="border border-red-300 text-red-600 font-bold p-2 rounded-lg text-center text-xs"
                    >
                      {lang === "hi" ? "लॉगआउट" : "Sign Out"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="border border-[#15803d] text-[#15803d] font-bold p-2 rounded-lg text-center text-xs"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-[#15803d] text-white font-bold p-2 rounded-lg text-center text-xs"
                  >
                    {t("nav.register")}
                  </Link>
                </div>
              )}
            </div>

            {/* Expandable Navigation List */}
            <p className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">
              {lang === "hi" ? "मुख्य कृषि श्रेणियाँ एवं सेवाएँ" : "Main Categories & Services"}
            </p>
            <div className="space-y-1.5">
              {navGroups.map((group) => {
                const isSingle = !group.items || group.items.length === 0;
                const isExpanded = expandedMobile === group.id;

                if (isSingle) {
                  return (
                    <Link
                      key={group.id}
                      href={group.href || "/"}
                      onClick={() => setMobileMenuOpen(false)}
                      className={clsx(
                        "block px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                        pathname === group.href
                          ? "bg-[#dcfce7] text-[#14532d] font-bold"
                          : "text-[#374151] hover:bg-[#f8faf5]"
                      )}
                    >
                      {group.label}
                    </Link>
                  );
                }

                return (
                  <div key={group.id} className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedMobile(isExpanded ? null : group.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-[#f8faf5] text-sm font-bold text-[#14532d]"
                    >
                      <span>{group.label}</span>
                      <ChevronDown className={clsx("size-4 transition-transform", isExpanded && "rotate-180")} />
                    </button>
                    {isExpanded && (
                      <div className="bg-white p-1 space-y-0.5">
                        {group.items?.map((sub) => (
                          <Link
                            key={sub.href + sub.label}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={clsx(
                              "block px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                              pathname === sub.href
                                ? "bg-[#dcfce7] text-[#14532d] font-bold"
                                : "text-[#4b5563] hover:bg-[#f8faf5]"
                            )}
                          >
                            <div>{sub.label}</div>
                            {sub.desc && <div className="text-[10px] text-[#6b7280] mt-0.5">{sub.desc}</div>}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-[#e5e7eb] text-xs text-[#6b7280]">
              <p className="font-semibold text-[#14532d] mb-1">{lang === "hi" ? "किसान कॉल सेंटर" : "Kisan Call Centre"}</p>
              <a href="tel:18001801551" className="text-[#0284c7] font-bold block mb-3">
                1800-180-1551 ({lang === "hi" ? "टोल-फ्री" : "Toll-Free"})
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main id="main-content" className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e5e7eb] shadow-lg flex items-center justify-around py-1.5 px-1 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        <Link
          href="/"
          className={clsx(
            "flex flex-col items-center text-[10px] font-semibold min-w-[56px] py-1",
            pathname === "/" ? "text-[#15803d]" : "text-[#6b7280]"
          )}
        >
          <img src="/logo/awadh-kisan-seva.png" alt="" className="size-5 object-contain" />
          <span className="mt-0.5">{t("nav.home")}</span>
        </Link>
        <Link
          href="/crops"
          className={clsx(
            "flex flex-col items-center text-[10px] font-semibold min-w-[56px] py-1",
            pathname === "/crops" ? "text-[#15803d]" : "text-[#6b7280]"
          )}
        >
          <BookOpen className="size-5" />
          <span className="mt-0.5">{t("nav.crops")}</span>
        </Link>
        <Link
          href="/mandi"
          className={clsx(
            "flex flex-col items-center text-[10px] font-semibold min-w-[56px] py-1",
            pathname === "/mandi" ? "text-[#15803d]" : "text-[#6b7280]"
          )}
        >
          <TrendingUp className="size-5" />
          <span className="mt-0.5">{t("nav.mandi")}</span>
        </Link>
        <Link
          href="/weather"
          className={clsx(
            "flex flex-col items-center text-[10px] font-semibold min-w-[56px] py-1",
            pathname === "/weather" ? "text-[#15803d]" : "text-[#6b7280]"
          )}
        >
          <CloudSun className="size-5" />
          <span className="mt-0.5">{t("nav.weather")}</span>
        </Link>
        <Link
          href="/ask-expert"
          className={clsx(
            "flex flex-col items-center text-[10px] font-semibold min-w-[56px] py-1",
            pathname === "/ask-expert" ? "text-[#15803d]" : "text-[#6b7280]"
          )}
        >
          <HelpCircle className="size-5" />
          <span className="mt-0.5">{t("nav.askExpert")}</span>
        </Link>
      </div>

      {/* Institutional Global Footer */}
      <footer className="bg-[#14532d] text-white pt-12 pb-8 border-t-4 border-[#eab308]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top Brand Partnership Strip: Both Logos Side-by-Side */}
          <div className="bg-white/10 border border-white/15 rounded-2xl p-4 sm:p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 backdrop-blur-xs">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="size-14 sm:size-20 rounded-full bg-white p-1 shadow-md shrink-0 flex items-center justify-center">
                <img
                  src="/logo/awadh-kisan-seva.png"
                  alt="अवध किसान सेवा"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="h-10 sm:h-12 w-px bg-white/20" />
              <div className="size-14 sm:size-20 rounded-xl bg-white p-1.5 shadow-md shrink-0 flex items-center justify-center">
                <img
                  src="/logo/anduat.png"
                  alt="NDUAT Ayodhya"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#eab308] font-bold block">
                  {lang === "hi" ? "आधिकारिक कृषि संदर्शिका एवं सहायता मंच" : "Official Agricultural Guide & Support Platform"}
                </span>
                <h3 className="text-base sm:text-xl font-black text-white truncate">
                  {lang === "hi" ? "अवध किसान सेवा" : "Awadh Kisan Seva"}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#86efac]">
                  {lang === "hi" ? "आचार्य नरेंद्र देव कृषि एवं प्रौद्योगिकी विश्वविद्यालय (NDUAT), अयोध्या सहयोग" : "In Academic Collaboration with NDUAT, Ayodhya"}
                </p>
              </div>
            </div>

            {/* Official Website Links */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://nduat.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white text-[#14532d] hover:bg-[#dcfce7] font-bold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-sm transition-all"
              >
                <GraduationCap className="size-4 text-[#15803d]" />
                <span>{lang === "hi" ? "NDUAT आधिकारिक वेबसाइट" : "NDUAT Official Website"}</span>
                <ExternalLink className="size-3.5" />
              </a>
              <a
                href="https://mcaet.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#eab308] text-[#1f2937] hover:bg-[#ca8a04] font-bold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-sm transition-all"
              >
                <span>{lang === "hi" ? "MCAET कॉलेज पोर्टल" : "MCAET College Portal"}</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/20">
            {/* Column 1: Platform About */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#eab308] mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#eab308] rounded-full inline-block" />
                {lang === "hi" ? "मंच के बारे में" : "About Platform"}
              </h4>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                {t("footer.aboutDesc")}
              </p>
              <div className="p-3 bg-white/10 rounded-lg text-xs border border-white/10 space-y-1">
                <p className="font-bold text-[#fef08a]">{lang === "hi" ? "तकनीकी विकास एवं समन्वय:" : "Technical Coordination:"}</p>
                <p className="text-white/80">{lang === "hi" ? "महामाया कृषि अभियांत्रिकी एवं प्रौद्योगिकी महाविद्यालय (MCAET), NDUAT" : "Mahamaya College of Agricultural Engineering & Technology (MCAET), NDUAT"}</p>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#eab308] mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#eab308] rounded-full inline-block" />
                {t("footer.quickLinks")}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-white/85">
                <li>
                  <Link href="/crops" className="hover:text-[#fef08a] transition-colors">
                    {t("nav.crops")}
                  </Link>
                </li>
                <li>
                  <Link href="/diseases" className="hover:text-[#fef08a] transition-colors">
                    {t("nav.cropDiseases")}
                  </Link>
                </li>
                <li>
                  <Link href="/pests" className="hover:text-[#fef08a] transition-colors">
                    {t("nav.pestManagement")}
                  </Link>
                </li>
                <li>
                  <Link href="/mandi" className="hover:text-[#fef08a] transition-colors">
                    {t("nav.mandi")}
                  </Link>
                </li>
                <li>
                  <Link href="/weather" className="hover:text-[#fef08a] transition-colors">
                    {t("nav.weather")}
                  </Link>
                </li>
                <li>
                  <Link href="/schemes" className="hover:text-[#fef08a] transition-colors">
                    {t("nav.schemes")}
                  </Link>
                </li>
                <li>
                  <Link href="/crop-calendar" className="hover:text-[#fef08a] transition-colors">
                    {t("nav.cropCalendar")}
                  </Link>
                </li>
                <li>
                  <Link href="/soil-health" className="hover:text-[#fef08a] transition-colors">
                    {t("nav.soilHealth")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Us (Lead & Developer) */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#eab308] mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#eab308] rounded-full inline-block" />
                {lang === "hi" ? "संपर्क सूत्र" : "Contact Us"}
              </h4>
              <div className="space-y-3 text-xs text-white/90">
                {/* Project Lead */}
                <div className="p-3 bg-white/10 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="size-10 rounded-lg overflow-hidden border border-[#eab308] shrink-0 bg-white shadow-xs">
                      <img
                        src="/contactus/neeraj.png"
                        alt="Dr. Neeraj Kumar Singh"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#fef08a] text-sm">Dr. Neeraj Kumar Singh</p>
                      <p className="text-[11px] text-white/90 font-medium">
                        {lang === "hi" ? "सह-प्राध्यापक (परियोजना प्रमुख)" : "Assistant Professor (Project Lead)"}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#86efac]">
                    {lang === "hi" ? "नवीकरणीय ऊर्जा अभियांत्रिकी, MCAET (NDUAT)" : "Renewable Energy Engineering, MCAET (NDUAT)"}
                  </p>
                  <div className="mt-1.5 pt-1.5 border-t border-white/10 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Phone className="size-3 text-[#eab308]" />
                      <a href="tel:+918329321490" className="hover:underline">+91 8329321490</a>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="size-3 text-[#eab308]" />
                      <a href="mailto:linknrjanduat@gmail.com" className="hover:underline break-all">linknrjanduat@gmail.com</a>
                    </p>
                    <p className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[#38bdf8] font-bold">in</span>
                      <a
                        href="https://www.linkedin.com/in/linknrj?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#38bdf8] hover:underline flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <span>{lang === "hi" ? "LinkedIn प्रोफाइल" : "LinkedIn Profile"}</span>
                        <ExternalLink className="size-2.5" />
                      </a>
                    </p>
                  </div>
                </div>

                {/* Lead Developer */}
                <div className="p-3 bg-white/10 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="size-10 rounded-lg overflow-hidden border border-[#eab308] shrink-0 bg-white shadow-xs">
                      <img
                        src="/contactus/Akhil.png"
                        alt="Akhil Yadav"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#fef08a] text-sm">Akhil Yadav</p>
                      <p className="text-[11px] text-white/90 font-medium">
                        {lang === "hi" ? "प्रमुख डेवलपर एवं सिस्टम आर्किटेक्ट" : "Lead Developer & System Architect"}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#86efac]">
                    {lang === "hi" ? "कंप्यूटर साइंस एवं इंजीनियरिंग, MCAET (NDUAT)" : "Computer Science & Engineering, MCAET (NDUAT)"}
                  </p>
                  <div className="mt-1.5 pt-1.5 border-t border-white/10 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Phone className="size-3 text-[#eab308]" />
                      <a href="tel:9794945167" className="hover:underline">+91 97949 45167</a>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="size-3 text-[#eab308]" />
                      <a href="mailto:akhil78026@gmail.com" className="hover:underline break-all">akhil78026@gmail.com</a>
                    </p>
                    <p className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[#38bdf8] font-bold">in</span>
                      <a
                        href="https://www.linkedin.com/in/akhil-yadav-4ba586266?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#38bdf8] hover:underline flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <span>{lang === "hi" ? "LinkedIn प्रोफाइल" : "LinkedIn Profile"}</span>
                        <ExternalLink className="size-2.5" />
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>


            {/* Column 4: Official Portals & Helpline */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#eab308] mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#eab308] rounded-full inline-block" />
                {t("footer.officialPortals")}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-white/85 mb-4">
                <li>
                  <a
                    href="https://nduat.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#fef08a] transition-colors flex items-center justify-between"
                  >
                    <span>NDUAT अयोध्या</span>
                    <ExternalLink className="size-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://mcaet.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#fef08a] transition-colors flex items-center justify-between"
                  >
                    <span>{lang === "hi" ? "MCAET अम्बेडकर नगर" : "MCAET Ambedkar Nagar"}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://agriculture.up.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#fef08a] transition-colors flex items-center justify-between"
                  >
                    <span>{lang === "hi" ? "कृषि विभाग उत्तर प्रदेश" : "UP Agriculture Department"}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://agridarshan.up.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#fef08a] transition-colors flex items-center justify-between"
                  >
                    <span>{lang === "hi" ? "कृषि दर्शन उ.प्र." : "Krishi Darshan UP"}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://pmkisan.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#fef08a] transition-colors flex items-center justify-between"
                  >
                    <span>{lang === "hi" ? "पीएम-किसान पोर्टल" : "PM-Kisan Portal"}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://agmarknet.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#fef08a] transition-colors flex items-center justify-between"
                  >
                    <span>{lang === "hi" ? "एगमार्कनेट (Agmarknet)" : "Agmarknet Portal"}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </li>
                <li className="pt-2 border-t border-white/15">
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-[#fef08a] transition-colors"
                  >
                    <ShieldCheck className="size-3.5 text-[#eab308]" />
                    <span>{lang === "hi" ? "प्रशासनिक लॉगिन" : "Admin Portal Login"}</span>
                  </Link>
                </li>
              </ul>

              <div className="bg-[#15803d] p-3 rounded-lg border border-[#86efac]/30">
                <p className="text-xs font-bold text-[#fef08a] flex items-center gap-1">
                  <Phone className="size-3.5" />
                  {t("footer.helplineTitle")}
                </p>
                <p className="text-lg font-extrabold text-white mt-0.5">1800-180-1551</p>
                <p className="text-[11px] text-white/70">{t("footer.helplineHours")}</p>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="py-4 my-4 bg-white/5 rounded-lg px-4 text-xs text-white/75 leading-relaxed border border-white/10">
            <p className="font-semibold text-[#fef08a] mb-1">
              {lang === "hi" ? "अस्वीकरण:" : "Disclaimer:"}
            </p>
            <p>{t("footer.disclaimer")}</p>
          </div>

          {/* Bottom Bar with Links & Verification info */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
            <p>© {new Date().getFullYear()} {t("meta.siteName")}. {t("footer.copyright")}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <Link href="/about" className="hover:text-white transition-colors">
                {t("nav.about")}
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                {t("nav.contact")}
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                {t("footer.terms")}
              </Link>
              <Link href="/disclaimer" className="hover:text-white transition-colors">
                {t("footer.disclaimerLink")}
              </Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                {t("footer.accessibility")}
              </Link>
              <Link href="/sources" className="hover:text-white transition-colors">
                {t("footer.sources")}
              </Link>
              <Link href="/faq" className="hover:text-white transition-colors">
                {t("footer.faq")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
