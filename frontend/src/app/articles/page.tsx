"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Download,
  Search,
  User,
  Calendar,
  ExternalLink,
  Eye,
  Maximize2,
  X,
  BookOpen,
  Building2,
  CheckCircle2,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Layers,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { RESEARCH_PUBLICATIONS, ResearchPublication } from "@/data/research";

const ITEMS_PER_PAGE = 9;

export default function ArticlesPage() {
  const { lang } = useI18n();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [activePdfPub, setActivePdfPub] = useState<ResearchPublication | null>(null);
  const [activeImagePub, setActiveImagePub] = useState<ResearchPublication | null>(null);
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});

  // Category list with counts
  const categories = useMemo(() => {
    const map = new Map<string, { en: string; hi: string; count: number }>();
    RESEARCH_PUBLICATIONS.forEach((p) => {
      const existing = map.get(p.category);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(p.category, {
          en: p.category,
          hi: p.category_hi || p.category,
          count: 1,
        });
      }
    });

    return [
      { id: "all", en: "All Research", hi: "सभी शोध प्रकाशन", count: RESEARCH_PUBLICATIONS.length },
      ...Array.from(map.entries()).map(([key, val]) => ({
        id: key,
        en: val.en,
        hi: val.hi,
        count: val.count,
      })),
    ];
  }, []);

  // Filtered publications
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return RESEARCH_PUBLICATIONS.filter((pub) => {
      const matchesCategory =
        selectedCategory === "all" || pub.category === selectedCategory;

      const title = lang === "hi" ? pub.title_hi || pub.title : pub.title;
      const abstract = lang === "hi" ? pub.abstract_hi || pub.abstract : pub.abstract;
      const matchesSearch =
        q === "" ||
        title.toLowerCase().includes(q) ||
        pub.authors.toLowerCase().includes(q) ||
        pub.journal.toLowerCase().includes(q) ||
        abstract.toLowerCase().includes(q) ||
        (pub.doi && pub.doi.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory, lang]);

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedPublications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const toggleAbstract = (id: string) => {
    setExpandedAbstracts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          {
            label:
              lang === "hi"
                ? "अनुसंधान पुस्तकालय एवं प्रकाशन"
                : "Agricultural Research Library & Publications",
          },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#14532d] via-[#15803d] to-[#166534] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 mb-3">
            <ShieldCheck className="size-3.5 text-emerald-300" />
            <span>
              {lang === "hi"
                ? "45 प्रामाणिक कृषि शोध पत्र • आईसीएआर एवं सहकर्मी-समीक्षित जर्नल्स"
                : "45 Authentic Research Publications • ICAR & Peer-Reviewed Journals"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
            {lang === "hi"
              ? "कृषि वैज्ञानिक लेख एवं शोध अनुसंधान पुस्तकालय"
              : "Agricultural Research Publications & Scientific Library"}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
            {lang === "hi"
              ? "भारतीय कृषि अनुसंधान परिषद (ICAR), आचार्य नरेंद्र देव कृषि विश्वविद्यालय (ANDUAT) एवं राष्ट्रीय-अंतर्राष्ट्रीय पत्रिकाओं के सत्यापित वैज्ञानिक शोध पत्र, प्रत्यक्ष पीडीएफ एवं प्रयोगात्मक डेटा।"
              : "Verified peer-reviewed research papers from the Indian Council of Agricultural Research (ICAR), Acharya Narendra Deva University (ANDUAT), and leading journals with direct PDF access and experimental findings."}
          </p>
        </div>
      </div>

      {/* Search and Quick Filters Strip */}
      <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-[#9ca3af]" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={
              lang === "hi"
                ? "शोध शीर्षक, वैज्ञानिक, पत्रिका अथवा विषय खोजें (उदा. गेहूं, धान, नैनो यूरिया)..."
                : "Search by research title, scientist, journal, or topic (e.g. wheat, rice, nano urea)..."
            }
            className="w-full pl-9 pr-9 py-2 border border-[#d1d5db] rounded-lg text-xs sm:text-sm bg-white outline-none focus:border-[#15803d]"
          />
          {search && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#15803d] bg-[#dcfce7] px-3 py-2 rounded-lg border border-[#86efac] whitespace-nowrap">
            {filtered.length} {lang === "hi" ? "शोध पत्र उपलब्ध" : "Publications Found"}
          </span>
        </div>
      </div>

      {/* Category Filter Pills (Scrollable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? "bg-[#15803d] text-white shadow-xs"
                  : "bg-white text-[#374151] border border-[#d1d5db] hover:bg-[#f8faf5]"
              }`}
            >
              <span>{lang === "hi" ? cat.hi : cat.en}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Publications Grid */}
      {paginatedPublications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-12 text-center space-y-3">
          <BookOpen className="size-12 text-[#9ca3af] mx-auto" />
          <h3 className="text-base font-bold text-[#14532d]">
            {lang === "hi" ? "कोई शोध पत्र नहीं मिला" : "No Publications Found"}
          </h3>
          <p className="text-xs text-[#6b7280] max-w-md mx-auto">
            {lang === "hi"
              ? "कृपया अपने खोज शब्दों को बदलकर देखें अथवा सभी श्रेणियां चुनें।"
              : "Try adjusting your search terms or switch back to All Research categories."}
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSearch(""); setSelectedCategory("all"); }}>
            {lang === "hi" ? "फ़िल्टर रीसेट करें" : "Reset Filters"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPublications.map((pub) => {
            const isAbstractExpanded = !!expandedAbstracts[pub.id];
            const title = lang === "hi" ? pub.title_hi || pub.title : pub.title;
            const abstract = lang === "hi" ? pub.abstract_hi || pub.abstract : pub.abstract;
            const categoryName = lang === "hi" ? pub.category_hi || pub.category : pub.category;

            return (
              <div
                key={pub.id}
                className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Research Card Image with Lightbox Zoom Trigger */}
                  <div
                    className="relative h-44 w-full bg-gray-100 overflow-hidden cursor-pointer group"
                    onClick={() => setActiveImagePub(pub)}
                    title={lang === "hi" ? "बड़ी तस्वीर देखने के लिए क्लिक करें" : "Click to view full image"}
                  >
                    <img
                      src={pub.image_url}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-xs">
                        <Maximize2 className="size-3" />
                        <span>{lang === "hi" ? "तस्वीर देखें" : "View Photo"}</span>
                      </span>
                    </div>
                    {/* Category Overlay Tag */}
                    <span className="absolute top-3 left-3 bg-[#14532d]/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
                      {categoryName}
                    </span>
                    <span className="absolute top-3 right-3 bg-white/90 text-[#14532d] text-[11px] font-black px-2 py-0.5 rounded font-mono shadow-xs">
                      {pub.year}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-black text-sm sm:text-base text-[#14532d] leading-snug line-clamp-2 hover:text-[#15803d] transition-colors">
                      <a href={pub.url} target="_blank" rel="noopener noreferrer">
                        {title}
                      </a>
                    </h3>

                    {/* Metadata Strip */}
                    <div className="space-y-1 text-xs text-[#4b5563]">
                      <div className="flex items-start gap-1.5">
                        <User className="size-3.5 text-[#15803d] shrink-0 mt-0.5" />
                        <span className="line-clamp-1 font-medium">{pub.authors}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <Building2 className="size-3.5 text-[#15803d] shrink-0 mt-0.5" />
                        <span className="line-clamp-1 text-[11px] text-[#6b7280]">{pub.journal}</span>
                      </div>
                      {pub.doi && (
                        <div className="text-[10px] text-[#0284c7] font-mono truncate">
                          DOI: {pub.doi}
                        </div>
                      )}
                    </div>

                    {/* Abstract Paragraph */}
                    <div className="pt-2 border-t border-[#f3f4f6]">
                      <p
                        className={`text-xs text-[#374151] leading-relaxed ${
                          isAbstractExpanded ? "" : "line-clamp-3"
                        }`}
                      >
                        {abstract}
                      </p>
                      {abstract.length > 150 && (
                        <button
                          type="button"
                          onClick={() => toggleAbstract(pub.id)}
                          className="text-[11px] font-bold text-[#15803d] hover:underline mt-1 cursor-pointer"
                        >
                          {isAbstractExpanded
                            ? (lang === "hi" ? "कम दिखाएं ↑" : "Show Less ↑")
                            : (lang === "hi" ? "पूरा सारांश पढ़ें ↓" : "Read Full Abstract ↓")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom 3-Action Ribbon */}
                <div className="p-4 bg-[#f8faf5] border-t border-[#e5e7eb] flex items-center justify-between gap-1.5 flex-wrap">
                  {/* 1. Read Research (Opens original article) */}
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#14532d] hover:text-[#15803d] hover:underline px-2 py-1 rounded transition-colors"
                  >
                    <span>{lang === "hi" ? "मूल आलेख" : "Read Research"}</span>
                    <ExternalLink className="size-3" />
                  </a>

                  {/* 2. Preview PDF Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => setActivePdfPub(pub)}
                    className="inline-flex items-center gap-1 bg-white hover:bg-emerald-50 text-[#15803d] border border-[#86efac] text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Eye className="size-3" />
                    <span>{lang === "hi" ? "PDF पूर्वावलोकन" : "Preview PDF"}</span>
                  </button>

                  {/* 3. Direct Download PDF (if available) */}
                  {pub.pdf_url ? (
                    <a
                      href={pub.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-1 bg-[#15803d] hover:bg-[#14532d] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-xs transition-colors"
                    >
                      <Download className="size-3" />
                      <span>{lang === "hi" ? "डाउनलोड" : "Download PDF"}</span>
                    </a>
                  ) : (
                    <span className="text-[10px] text-[#9ca3af] font-medium italic">
                      {lang === "hi" ? "केवल वेब आलेख" : "Web Article"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#6b7280]">
            {lang === "hi"
              ? `कुल ${filtered.length} में से ${(currentPage - 1) * ITEMS_PER_PAGE + 1} से ${Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filtered.length
                )} शोध पत्र प्रदर्शित`
              : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1} to ${Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filtered.length
                )} of ${filtered.length} publications`}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-[#d1d5db] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`size-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentPage === num
                    ? "bg-[#15803d] text-white shadow-xs"
                    : "border border-[#d1d5db] text-[#374151] hover:bg-gray-50"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-[#d1d5db] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* PDF PREVIEW MODAL */}
      {activePdfPub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl border border-gray-200 animate-in fade-in duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#e5e7eb] flex items-center justify-between gap-3 bg-[#f8faf5]">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="size-9 rounded-lg bg-[#dcfce7] text-[#14532d] flex items-center justify-center shrink-0">
                  <FileText className="size-5 text-[#15803d]" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-sm sm:text-base text-[#14532d] truncate">
                    {lang === "hi" ? activePdfPub.title_hi || activePdfPub.title : activePdfPub.title}
                  </h3>
                  <p className="text-[11px] text-[#6b7280] truncate">
                    {activePdfPub.authors} • {activePdfPub.journal} ({activePdfPub.year})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activePdfPub.pdf_url && (
                  <a
                    href={activePdfPub.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-1 bg-[#15803d] hover:bg-[#14532d] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                  >
                    <Download className="size-3.5" />
                    <span className="hidden sm:inline">{lang === "hi" ? "डाउनलोड" : "Download PDF"}</span>
                  </a>
                )}
                <a
                  href={activePdfPub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  title={lang === "hi" ? "वेबसाइट पर खोलें" : "Open in new tab"}
                >
                  <ExternalLink className="size-4" />
                </a>
                <button
                  onClick={() => setActivePdfPub(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Embedded Viewer or Fallback Preview Card */}
            <div className="flex-1 bg-gray-50 overflow-y-auto p-4 flex flex-col justify-between">
              {activePdfPub.pdf_url ? (
                <div className="w-full h-full min-h-[450px] rounded-xl border border-gray-300 bg-white overflow-hidden shadow-inner flex flex-col">
                  {/* Embedded PDF iframe */}
                  <iframe
                    src={activePdfPub.pdf_url}
                    className="w-full h-full flex-1 border-0"
                    title={activePdfPub.title}
                  />
                  <div className="p-3 bg-gray-100 border-t border-gray-200 text-xs text-gray-600 flex items-center justify-between flex-wrap gap-2">
                    <span>
                      {lang === "hi"
                        ? "यदि सुरक्षा कारणों से इनलाइन PDF प्रदर्शित न हो, तो नीचे दिए गए बटन से खोलें:"
                        : "If the embedded PDF is blocked by your browser's security settings, use direct access:"}
                    </span>
                    <a
                      href={activePdfPub.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#15803d] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>{lang === "hi" ? "सीधे नए टैब में PDF खोलें" : "Open PDF directly in new tab"}</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs space-y-4 my-auto">
                  <div className="size-12 rounded-full bg-emerald-100 text-[#15803d] flex items-center justify-center mx-auto">
                    <BookOpen className="size-6" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-base text-[#14532d]">
                      {lang === "hi" ? activePdfPub.title_hi || activePdfPub.title : activePdfPub.title}
                    </h4>
                    <p className="text-xs text-[#6b7280] mt-1">{activePdfPub.authors}</p>
                    <p className="text-xs text-[#15803d] font-semibold mt-0.5">{activePdfPub.journal}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl text-xs sm:text-sm text-[#374151] leading-relaxed border border-gray-200 max-h-60 overflow-y-auto">
                    <span className="font-bold text-[#14532d] block mb-1">
                      {lang === "hi" ? "आधिकारिक शोध सारांश:" : "Official Research Abstract:"}
                    </span>
                    {lang === "hi" ? activePdfPub.abstract_hi || activePdfPub.abstract : activePdfPub.abstract}
                  </div>

                  <div className="text-center pt-2">
                    <a
                      href={activePdfPub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#15803d] hover:bg-[#14532d] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm"
                    >
                      <span>{lang === "hi" ? "प्रकाशक पोर्टल पर पूरा आलेख पढ़ें" : "Read Full Article on Publisher Portal"}</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW LIGHTBOX MODAL */}
      {activeImagePub && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveImagePub(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
              <img
                src={activeImagePub.image_url}
                alt={activeImagePub.title}
                className="max-h-[65vh] w-auto object-contain mx-auto"
              />
              <button
                onClick={() => setActiveImagePub(null)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white p-1.5 rounded-full backdrop-blur-xs cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 bg-white space-y-2">
              <span className="text-[11px] font-bold text-[#15803d] uppercase tracking-wider block">
                {lang === "hi" ? activeImagePub.category_hi : activeImagePub.category}
              </span>
              <h4 className="font-black text-base text-[#14532d]">
                {lang === "hi" ? activeImagePub.title_hi || activeImagePub.title : activeImagePub.title}
              </h4>
              <p className="text-xs text-[#4b5563] bg-[#f8faf5] p-3 rounded-lg border border-[#e5e7eb]">
                <span className="font-bold text-[#14532d]">
                  {lang === "hi" ? "प्रयोगात्मक विवरण: " : "Field Trial Context: "}
                </span>
                {activeImagePub.image_caption}
              </p>
              <div className="flex items-center justify-between pt-2 text-[11px] text-[#6b7280]">
                <span>{activeImagePub.authors}</span>
                <a
                  href={activeImagePub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#15803d] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>{lang === "hi" ? "शोध पत्र देखें" : "View Paper"}</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
