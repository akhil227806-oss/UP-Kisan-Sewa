"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Search, Sprout, TrendingUp, CloudSun, ChevronRight, Building } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useI18n } from "@/lib/i18n";
import { ALL_75_UP_DISTRICTS, UP_DIVISIONS_LIST } from "@/lib/locations";

export default function DistrictsPage() {
  const { lang } = useI18n();
  const [search, setSearch] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");

  const filtered = ALL_75_UP_DISTRICTS.filter((d) => {
    const s = search.trim().toLowerCase();
    const matchesSearch =
      s === "" ||
      d.name_hi.includes(s) ||
      d.name_en.toLowerCase().includes(s) ||
      d.zone_hi.includes(s) ||
      d.zone_en.toLowerCase().includes(s) ||
      d.majorCrops_hi.includes(s) ||
      d.majorCrops_en.toLowerCase().includes(s);

    const matchesDiv =
      selectedDivision === "all" ||
      d.division_hi === selectedDivision ||
      d.division_en === selectedDivision;

    return matchesSearch && matchesDiv;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "जनपद डायरेक्टरी" : "District Directory" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "उत्तर प्रदेश 75 जनपद कृषि डायरेक्टरी" : "UP 75 Districts Agriculture Directory"}
          subtitle={
            lang === "hi"
              ? "सभी 18 मंडलों के 75 जनपदों का जलवायु क्षेत्र, प्रमुख फसलें, संबंधित कृषि विज्ञान केंद्र (KVK) एवं स्थानीय थोक मंडी भाव"
              : "Comprehensive agricultural profiles for all 75 UP districts across 18 divisions with agro-climatic zones, major crops, KVK and mandis"
          }
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#e5e7eb] shadow-xs mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-3 size-4 text-[#9ca3af]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                lang === "hi"
                  ? "जनपद का नाम, फसल या क्षेत्र खोजें (उदा. अयोध्या, बाराबंकी, काला नमक, बुंदेलखंड)..."
                  : "Search district name, crop or zone (e.g. Ayodhya, Barabanki, Mustard, Tarai)..."
              }
              className="w-full pl-9 pr-4 py-2 border border-[#d1d5db] rounded-lg text-sm outline-none focus:border-[#15803d]"
            />
          </div>

          <div>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-sm bg-[#f8faf5] outline-none focus:border-[#15803d]"
            >
              <option value="all">
                {lang === "hi" ? "सभी 18 मण्डल (All 18 Divisions)" : "All 18 Divisions"}
              </option>
              {UP_DIVISIONS_LIST.map((div) => (
                <option key={div.id} value={lang === "hi" ? div.name_hi : div.name_en}>
                  {lang === "hi" ? div.name_hi : div.name_en}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="text-xs text-[#6b7280] mb-4">
        {lang === "hi"
          ? `कुल ${filtered.length} जनपद प्रदर्शित`
          : `Showing ${filtered.length} of 75 districts`}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filtered.map((d) => {
          const cropsLower = (d.majorCrops_en || "").toLowerCase();
          const cropImg = cropsLower.includes("mustard")
            ? "/crops/mustard.jpg"
            : cropsLower.includes("paddy") || cropsLower.includes("rice")
            ? "/crops/paddy.jpg"
            : cropsLower.includes("sugarcane")
            ? "/crops/sugarcane.jpg"
            : cropsLower.includes("potato")
            ? "/crops/potato.jpg"
            : cropsLower.includes("gram") || cropsLower.includes("pulse") || cropsLower.includes("arhar")
            ? "/crops/gram.jpg"
            : "/crops/wheat.jpg";

          return (
            <Card key={d.code} className="flex flex-col justify-between hover:border-[#86efac] transition-all overflow-hidden shadow-xs hover:shadow-md">
              <div>
                <div className="h-28 w-full relative overflow-hidden bg-black/10">
                  <img
                    src={cropImg}
                    alt={d.name_en}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                    <span className="font-black text-sm flex items-center gap-1">
                      <MapPin className="size-3.5 text-[#f97316]" />
                      <span>{lang === "hi" ? d.name_hi : d.name_en}</span>
                    </span>
                    <span className="text-[10px] font-bold bg-[#15803d] px-2 py-0.5 rounded-full shadow-xs">
                      {lang === "hi" ? d.division_hi : d.division_en}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2.5 text-xs sm:text-sm">
                  <div>
                    <span className="text-[11px] text-[#6b7280] font-semibold block">
                      {lang === "hi" ? d.zone_hi : d.zone_en}
                    </span>
                  </div>
                  <div>
                    <strong className="text-[#14532d] block text-xs">
                      {lang === "hi" ? "प्रमुख फसलें:" : "Major Crops:"}
                    </strong>
                    <span className="text-[#374151] font-medium">
                      {lang === "hi" ? d.majorCrops_hi : d.majorCrops_en}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="bg-[#f8faf5] p-2 rounded-lg border border-[#e5e7eb]">
                      <strong className="text-[#14532d] block text-[10px]">
                        {lang === "hi" ? "संबद्ध KVK:" : "Associated KVK:"}
                      </strong>
                      <span className="text-[#4b5563] truncate block">{d.kvk}</span>
                    </div>
                    <div className="bg-[#f8faf5] p-2 rounded-lg border border-[#e5e7eb]">
                      <strong className="text-[#14532d] block text-[10px]">
                        {lang === "hi" ? "मुख्य मंडी:" : "Principal Mandi:"}
                      </strong>
                      <span className="text-[#4b5563] truncate block">{d.mandi}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#f8faf5] border-t border-[#e5e7eb] flex items-center justify-between text-xs">
                <Link
                  href={`/mandi?district=${encodeURIComponent(lang === "hi" ? d.name_hi : d.name_en)}`}
                  className="font-bold text-[#15803d] hover:underline flex items-center gap-1"
                >
                  <TrendingUp className="size-3.5" />
                  <span>{lang === "hi" ? "मंडी भाव" : "Mandi Bhav"}</span>
                </Link>
                <Link
                  href={`/weather?district=${encodeURIComponent(lang === "hi" ? d.name_hi : d.name_en)}`}
                  className="font-bold text-[#0284c7] hover:underline flex items-center gap-1"
                >
                  <CloudSun className="size-3.5" />
                  <span>{lang === "hi" ? "मौसम" : "Weather"}</span>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
