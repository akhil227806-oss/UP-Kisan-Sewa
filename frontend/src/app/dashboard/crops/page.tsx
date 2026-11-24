"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sprout, PlusCircle, Calendar, Trash2, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useI18n } from "@/lib/i18n";

interface CropRecord {
  id: string;
  name: string;
  season: string;
  area: string;
  sowingDate: string;
  stage: string;
  slug: string;
}

const DEFAULT_CROPS: CropRecord[] = [
  {
    id: "c1",
    name: "गेहूँ (DBW 187 / करण वंदना)",
    season: "रबी 2025-26",
    area: "2.5 एकड़",
    sowingDate: "2025-11-20",
    stage: "दाना पकने की अवस्था",
    slug: "gehu-sample",
  },
  {
    id: "c2",
    name: "सरसों (NDR 8501)",
    season: "रबी 2025-26",
    area: "1.0 एकड़",
    sowingDate: "2025-10-10",
    stage: "कटाई योग्य / पक्व अवस्था",
    slug: "sarson-sample",
  },
];

export default function MyCropsDashboard() {
  const { lang } = useI18n();
  const [crops, setCrops] = useState<CropRecord[]>(DEFAULT_CROPS);
  const [showAdd, setShowAdd] = useState(false);

  // Form states
  const [cropName, setCropName] = useState("गेहूँ");
  const [season, setSeason] = useState("रबी 2025-26");
  const [area, setArea] = useState("");
  const [sowingDate, setSowingDate] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("my_farmer_crops");
    if (saved) {
      try {
        setCrops(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleSaveCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!area.trim() || !sowingDate) return;

    let targetSlug = "gehu-sample";
    if (cropName.includes("धान") || cropName.toLowerCase().includes("paddy")) targetSlug = "dhan-sample";
    else if (cropName.includes("सरसों") || cropName.toLowerCase().includes("mustard")) targetSlug = "sarson-sample";
    else if (cropName.includes("अरहर") || cropName.toLowerCase().includes("arhar")) targetSlug = "arhar-sample";
    else if (cropName.includes("गन्ना") || cropName.toLowerCase().includes("sugarcane")) targetSlug = "ganna-sample";

    const newCrop: CropRecord = {
      id: `c_${Date.now()}`,
      name: cropName,
      season: season,
      area: `${area.trim()} एकड़`,
      sowingDate: sowingDate,
      stage: lang === "hi" ? "वानस्पतिक वृद्धि अवस्था" : "Vegetative Stage",
      slug: targetSlug,
    };

    const updated = [newCrop, ...crops];
    setCrops(updated);
    localStorage.setItem("my_farmer_crops", JSON.stringify(updated));
    setShowAdd(false);
    setArea("");
    setSowingDate("");
  };

  const handleDeleteCrop = (id: string) => {
    const updated = crops.filter((c) => c.id !== id);
    setCrops(updated);
    localStorage.setItem("my_farmer_crops", JSON.stringify(updated));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[
          { label: lang === "hi" ? "डैशबोर्ड" : "Dashboard", href: "/dashboard" },
          { label: lang === "hi" ? "मेरी फसलें" : "My Crops" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 my-6">
        <div>
          <h1 className="text-2xl font-black text-[#14532d]">
            {lang === "hi" ? "मेरी फसल प्रबंधन (My Crops)" : "My Crop Management"}
          </h1>
          <p className="text-xs text-[#6b7280]">
            {lang === "hi"
              ? "अपनी फसलों की बुवाई, प्रगति एवं वैज्ञानिक सलाह ट्रैक करें"
              : "Track your sown crops, growth stages, and scientific NDUAT advisories"}
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(!showAdd)}>
          <PlusCircle className="size-4 mr-1.5" />
          <span>{lang === "hi" ? "नई फसल जोड़ें" : "Add Sown Crop"}</span>
        </Button>
      </div>

      {showAdd && (
        <Card className="p-6 mb-6 border-[#bbf7d0]">
          <h3 className="font-bold text-[#14532d] mb-4">
            {lang === "hi" ? "खेत में बोई गई फसल विवरण दर्ज करें" : "Enter Sown Crop Details"}
          </h3>
          <form onSubmit={handleSaveCrop}>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-[#14532d] mb-1">
                  {lang === "hi" ? "फसल चुनें *" : "Select Crop *"}
                </label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-[#f8faf5]"
                >
                  <option value="गेहूँ (Wheat)">{lang === "hi" ? "गेहूँ" : "Wheat"}</option>
                  <option value="धान (Paddy)">{lang === "hi" ? "धान" : "Paddy"}</option>
                  <option value="सरसों (Mustard)">{lang === "hi" ? "सरसों" : "Mustard"}</option>
                  <option value="अरहर (Pigeon Pea)">{lang === "hi" ? "अरहर" : "Pigeon Pea"}</option>
                  <option value="गन्ना (Sugarcane)">{lang === "hi" ? "गन्ना" : "Sugarcane"}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#14532d] mb-1">
                  {lang === "hi" ? "सत्र" : "Season"}
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-[#f8faf5]"
                >
                  <option value="रबी 2025-26">{lang === "hi" ? "रबी 2025-26" : "Rabi 2025-26"}</option>
                  <option value="जायद 2026">{lang === "hi" ? "जायद 2026" : "Zaid 2026"}</option>
                  <option value="खरीफ 2026">{lang === "hi" ? "खरीफ 2026" : "Kharif 2026"}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#14532d] mb-1">
                  {lang === "hi" ? "क्षेत्रफल (एकड़) *" : "Area (Acres) *"}
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="उदा. 2.0"
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#15803d]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#14532d] mb-1">
                  {lang === "hi" ? "बुवाई की तिथि *" : "Sowing Date *"}
                </label>
                <input
                  type="date"
                  required
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#15803d]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>
                {lang === "hi" ? "रद्द करें" : "Cancel"}
              </Button>
              <Button type="submit" variant="primary">
                {lang === "hi" ? "सहेजें" : "Save Crop"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {crops.map((c) => (
          <div
            key={c.id}
            className="p-5 bg-white border border-[#e5e7eb] rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <Sprout className="size-5 text-[#15803d]" />
                <h3 className="text-base font-bold text-[#14532d]">{c.name}</h3>
              </div>
              <p className="text-xs text-[#6b7280] mt-1">
                {lang === "hi" ? "सत्र: " : "Season: "}<strong>{c.season}</strong> • {lang === "hi" ? "क्षेत्रफल: " : "Area: "}<strong>{c.area}</strong> • {lang === "hi" ? "बुवाई: " : "Sown: "}<strong>{c.sowingDate}</strong>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success">{c.stage}</Badge>
              <Link
                href={`/crops/${c.slug}`}
                className="text-xs font-bold text-[#15803d] hover:underline bg-[#dcfce7] px-3 py-1.5 rounded-lg"
              >
                {lang === "hi" ? "सलाह पैकेज देखें →" : "View Package →"}
              </Link>
              <button
                onClick={() => handleDeleteCrop(c.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"
                title={lang === "hi" ? "हटाएं" : "Delete"}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
