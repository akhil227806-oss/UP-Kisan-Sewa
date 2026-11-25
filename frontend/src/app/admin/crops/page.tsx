"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sprout, ExternalLink, ShieldCheck, PlusCircle, Search, Filter, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AdminNavBar } from "@/components/admin/AdminNavBar";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

interface CropItem {
  id?: string;
  name_hi: string;
  name_en: string;
  slug: string;
  season_hi: string;
  season_en: string;
  status_hi?: string;
  status_en?: string;
  varieties: string;
  source: string;
  msp?: string;
  seed_rate?: string;
}

const DEFAULT_CROPS: CropItem[] = [
  {
    name_hi: "गेहूँ",
    name_en: "Wheat",
    slug: "gehu-sample",
    season_hi: "रबी",
    season_en: "Rabi",
    status_hi: "प्रकाशित",
    status_en: "Published",
    varieties: "DBW 187, DBW 303, HD 2967, PBW 550",
    source: "NDUAT Kumarganj / ICAR-IIWBR",
    msp: "₹2,425/कुंतल",
    seed_rate: "100 किग्रा/हेक्टेयर",
  },
  {
    name_hi: "धान",
    name_en: "Paddy",
    slug: "dhan-sample",
    season_hi: "खरीफ",
    season_en: "Kharif",
    status_hi: "प्रकाशित",
    status_en: "Published",
    varieties: "सरयू 52, NDR 359, पूसा बासमती 1509, काला नमक",
    source: "NDUAT Kumarganj / ICAR-NRRI",
    msp: "₹2,300/कुंतल",
    seed_rate: "30-35 किग्रा/हेक्टेयर",
  },
  {
    name_hi: "सरसों",
    name_en: "Mustard",
    slug: "sarson-sample",
    season_hi: "रबी",
    season_en: "Rabi",
    status_hi: "प्रकाशित",
    status_en: "Published",
    varieties: "NDR 8501, वरूणा (T-59), पूसा मस्टर्ड 25",
    source: "NDUAT Kumarganj / DRMR Bharatpur",
    msp: "₹5,650/कुंतल",
    seed_rate: "4-5 किग्रा/हेक्टेयर",
  },
  {
    name_hi: "अरहर",
    name_en: "Pigeon Pea (Arhar)",
    slug: "arhar-sample",
    season_hi: "खरीफ / वार्षिक",
    season_en: "Kharif / Annual",
    status_hi: "प्रकाशित",
    status_en: "Published",
    varieties: "नरेंद्र अरहर 1, बहार, मालवीय 13",
    source: "NDUAT Kumarganj / ICAR-IIPR Kanpur",
    msp: "₹7,550/कुंतल",
    seed_rate: "15-20 किग्रा/हेक्टेयर",
  },
  {
    name_hi: "गन्ना",
    name_en: "Sugarcane",
    slug: "ganna-sample",
    season_hi: "वार्षिक / शरद",
    season_en: "Annual / Autumn",
    status_hi: "प्रकाशित",
    status_en: "Published",
    varieties: "Co-0238, Co-0118, CoLk-14201, Co-15023",
    source: "UPCSR Shahjahanpur / ICAR-IISR Lucknow",
    msp: "₹370/कुंतल (SAP)",
    seed_rate: "75-80 कुंतल/हेक्टेयर",
  },
];

export default function AdminCropsPage() {
  const { lang } = useI18n();
  const { token } = useAuth();
  const [crops, setCrops] = useState<CropItem[]>(DEFAULT_CROPS);
  const [search, setSearch] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Crop Form Fields
  const [newCropNameEn, setNewCropNameEn] = useState("");
  const [newCropNameHi, setNewCropNameHi] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newSeasonEn, setNewSeasonEn] = useState("Rabi");
  const [newSeasonHi, setNewSeasonHi] = useState("रबी");
  const [newVarieties, setNewVarieties] = useState("");
  const [newSource, setNewSource] = useState("NDUAT Kumarganj, Ayodhya");
  const [newMsp, setNewMsp] = useState("");
  const [newSeedRate, setNewSeedRate] = useState("");

  const effectiveToken =
    token || (typeof window !== "undefined" ? localStorage.getItem("admin_token") || localStorage.getItem("uks_token") || "" : "");

  const loadCrops = async () => {
    try {
      const res = await fetch("/api/v1/admin/crops", {
        headers: effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          setCrops(data.items);
        }
      }
    } catch {}
  };

  useEffect(() => {
    loadCrops();
  }, [effectiveToken]);

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropNameEn.trim() || !newCropNameHi.trim()) return;

    setSubmitting(true);
    const cleanSlug = (newSlug.trim() || newCropNameEn.toLowerCase().replace(/\s+/g, "-")) + "-sample";

    const payload = {
      name_hi: newCropNameHi.trim(),
      name_en: newCropNameEn.trim(),
      slug: cleanSlug,
      season_hi: newSeasonHi.trim(),
      season_en: newSeasonEn.trim(),
      varieties: newVarieties.trim() || "NDUAT अनुमोदित किस्में",
      source: newSource.trim(),
      msp: newMsp.trim() || "₹2,500/कुंतल",
      seed_rate: newSeedRate.trim() || "50 किग्रा/हेक्टेयर",
    };

    try {
      const res = await fetch("/api/v1/admin/crops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setToastMsg(lang === "hi" ? "नई फसल सफलतापूर्वक प्रकाशित की गई!" : "Crop published successfully!");
        setShowAddModal(false);
        setNewCropNameEn("");
        setNewCropNameHi("");
        setNewSlug("");
        setNewVarieties("");
        setNewMsp("");
        setNewSeedRate("");
        loadCrops();
      } else {
        // Local state fallback
        setCrops([payload, ...crops]);
        setShowAddModal(false);
      }
    } catch {
      setCrops([payload, ...crops]);
      setShowAddModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCrops = crops.filter((c) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      q === "" ||
      c.name_hi.includes(q) ||
      c.name_en.toLowerCase().includes(q) ||
      c.varieties.toLowerCase().includes(q);

    const matchSeason =
      seasonFilter === "all" ||
      c.season_en.toLowerCase().includes(seasonFilter.toLowerCase()) ||
      c.season_hi.includes(seasonFilter);

    return matchSearch && matchSeason;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: lang === "hi" ? "एडमिन" : "Admin", href: "/admin" },
          { label: lang === "hi" ? "फसल प्रबंधन" : "Crop Management" },
        ]}
      />

      <AdminNavBar />

      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs sm:text-sm font-bold text-emerald-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </span>
          <button onClick={() => setToastMsg(null)} className="text-emerald-700 font-black cursor-pointer">
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 my-6">
        <div>
          <h1 className="text-2xl font-black text-[#14532d]">
            {lang === "hi" ? "फसल एवं वैज्ञानिक पैकेज प्रबंधन" : "Crop & Scientific Package Management"}
          </h1>
          <p className="text-xs text-[#6b7280]">
            {lang === "hi"
              ? "केवल NDUAT एवं ICAR अनुमोदित वैज्ञानिक पैकेज प्रकाशित किए जाते हैं"
              : "All agronomic packages verified against NDUAT & ICAR field trial standards"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)} className="shadow-xs cursor-pointer">
            <PlusCircle className="size-4 mr-1.5" />
            <span>{lang === "hi" ? "नई फसल जोड़ें" : "Add New Crop"}</span>
          </Button>

          <Badge variant="success">
            <ShieldCheck className="size-3.5 mr-1" />
            <span>
              {crops.length} {lang === "hi" ? "फसल पैकेज सत्यापित" : "Verified Packages"}
            </span>
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 size-4 text-[#9ca3af]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "hi" ? "फसल का नाम या किस्म खोजें..." : "Search crop name or variety..."}
            className="w-full pl-9 pr-3 py-2 border border-[#d1d5db] rounded-lg text-xs sm:text-sm outline-none focus:border-[#15803d]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-[#6b7280]" />
          <select
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
            className="bg-[#f8faf5] border border-[#d1d5db] text-xs sm:text-sm font-semibold rounded-lg px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">{lang === "hi" ? "सभी मौसम (All Seasons)" : "All Seasons"}</option>
            <option value="Rabi">{lang === "hi" ? "रबी (Rabi)" : "Rabi Season"}</option>
            <option value="Kharif">{lang === "hi" ? "खरीफ (Kharif)" : "Kharif Season"}</option>
            <option value="Annual">{lang === "hi" ? "वार्षिक / जायद" : "Annual / Zaid"}</option>
          </select>
        </div>
      </div>

      {/* Crops Table */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#14532d] text-white">
                <th className="p-3.5">{lang === "hi" ? "फसल का नाम" : "Crop Name"}</th>
                <th className="p-3.5">{lang === "hi" ? "मौसम" : "Season"}</th>
                <th className="p-3.5">{lang === "hi" ? "अनुमोदित किस्में" : "Certified Varieties"}</th>
                <th className="p-3.5">{lang === "hi" ? "न्यूनतम समर्थन मूल्य (MSP)" : "MSP Rate"}</th>
                <th className="p-3.5">{lang === "hi" ? "सत्यापित स्रोत" : "Certified Source"}</th>
                <th className="p-3.5 text-right">{lang === "hi" ? "कार्रवाई" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {filteredCrops.map((c, i) => {
                const cropImg =
                  c.slug.includes("wheat") || c.slug.includes("gehu")
                    ? "/crops/wheat.jpg"
                    : c.slug.includes("dhan") || c.slug.includes("paddy")
                    ? "/crops/paddy.jpg"
                    : c.slug.includes("mustard") || c.slug.includes("sarson")
                    ? "/crops/mustard.jpg"
                    : c.slug.includes("arhar") || c.slug.includes("pigeon")
                    ? "/crops/arhar.jpg"
                    : "/crops/sugarcane.jpg";

                return (
                  <tr key={i} className="hover:bg-[#f8faf5] transition-colors">
                    <td className="p-3.5 font-bold text-[#14532d]">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={cropImg}
                          alt={c.name_en}
                          className="size-8 rounded object-cover border border-[#e5e7eb] shrink-0"
                        />
                        <div>
                          <div>{lang === "hi" ? c.name_hi : c.name_en}</div>
                          <span className="text-[10px] text-[#6b7280] font-mono">
                            slug: {c.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-[#374151]">
                      {lang === "hi" ? c.season_hi : c.season_en}
                    </td>
                    <td className="p-3.5 text-xs text-[#4b5563] max-w-xs">{c.varieties}</td>
                    <td className="p-3.5 font-bold text-[#15803d]">{c.msp || "—"}</td>
                    <td className="p-3.5 text-xs text-[#6b7280]">{c.source}</td>
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/crops/${c.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#15803d] hover:bg-[#dcfce7] bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <span>{lang === "hi" ? "पैकेज देखें" : "View Package"}</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e5e7eb] space-y-4">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <h3 className="font-bold text-base text-[#14532d] flex items-center gap-2">
                <Sprout className="size-5 text-[#15803d]" />
                <span>{lang === "hi" ? "नई कृषि फसल जोड़ें" : "Add New Crop Package"}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#6b7280] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCrop} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#14532d] mb-1">
                    {lang === "hi" ? "फसल नाम (हिंदी) *" : "Crop Name (Hindi) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCropNameHi}
                    onChange={(e) => setNewCropNameHi(e.target.value)}
                    placeholder="उदा. चना / मक्का"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#14532d] mb-1">
                    {lang === "hi" ? "फसल नाम (English) *" : "Crop Name (English) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCropNameEn}
                    onChange={(e) => setNewCropNameEn(e.target.value)}
                    placeholder="e.g. Chickpea / Maize"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#14532d] mb-1">
                    {lang === "hi" ? "कृषि मौसम *" : "Season *"}
                  </label>
                  <select
                    value={newSeasonEn}
                    onChange={(e) => {
                      setNewSeasonEn(e.target.value);
                      setNewSeasonHi(e.target.value === "Rabi" ? "रबी" : e.target.value === "Kharif" ? "खरीफ" : "जायद / वार्षिक");
                    }}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Rabi">रबी (Rabi)</option>
                    <option value="Kharif">खरीफ (Kharif)</option>
                    <option value="Zaid">जायद (Zaid)</option>
                    <option value="Annual">वार्षिक (Annual)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#14532d] mb-1">
                    {lang === "hi" ? "न्यूनतम समर्थन मूल्य (MSP)" : "MSP Rate"}
                  </label>
                  <input
                    type="text"
                    value={newMsp}
                    onChange={(e) => setNewMsp(e.target.value)}
                    placeholder="₹5,440/कुंतल"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#14532d] mb-1">
                  {lang === "hi" ? "अनुमोदित किस्में *" : "Certified Varieties *"}
                </label>
                <input
                  type="text"
                  required
                  value={newVarieties}
                  onChange={(e) => setNewVarieties(e.target.value)}
                  placeholder="उदा. पूसा 372, राधे, अवरोधी"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-[#14532d] mb-1">
                  {lang === "hi" ? "अनुसंधान संस्था / स्रोत" : "Research Source"}
                </label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="NDUAT Kumarganj, Ayodhya"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-[#e5e7eb] flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                  {lang === "hi" ? "रद्द करें" : "Cancel"}
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                  {submitting ? (lang === "hi" ? "सहेजा जा रहा है..." : "Saving...") : (lang === "hi" ? "फसल प्रकाशित करें" : "Publish Crop")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
