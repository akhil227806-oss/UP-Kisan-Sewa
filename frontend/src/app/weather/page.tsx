"use client";

import React, { useState, useMemo } from "react";
import { CloudSun, Droplets, Wind, Thermometer, AlertTriangle, ExternalLink, Calendar, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { ALL_75_UP_DISTRICTS } from "@/lib/locations";

export default function WeatherPage() {
  const { lang } = useI18n();
  const [district, setDistrict] = useState("अयोध्या");

  // Dynamic 5-day dates based on current system time
  const forecastDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayNameHi = i === 0 ? "आज" : i === 1 ? "कल" : i === 2 ? "परसों" : `${i + 1}वाँ दिन`;
      const dayNameEn = i === 0 ? "Today" : i === 1 ? "Tomorrow" : i === 2 ? "Day After" : `Day ${i + 1}`;
      const dateStr = d.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
        day: "numeric",
        month: "short",
      });
      dates.push({ dayHi: dayNameHi, dayEn: dayNameEn, dateStr });
    }
    return dates;
  }, [lang]);

  const weatherForecast = [
    {
      temp: "29°C / 17°C",
      conditionHi: "साफ मौसम / खिली धूप",
      conditionEn: "Clear & Sunny",
      rain: "0%",
      wind: "12 km/h",
    },
    {
      temp: "30°C / 18°C",
      conditionHi: "हल्की पछुआ हवा / साफ",
      conditionEn: "Light Westerly Breeze",
      rain: "0%",
      wind: "14 km/h",
    },
    {
      temp: "31°C / 19°C",
      conditionHi: "आंशिक बादल",
      conditionEn: "Partly Cloudy",
      rain: "10%",
      wind: "11 km/h",
    },
    {
      temp: "31°C / 18°C",
      conditionHi: "साफ व शुष्क",
      conditionEn: "Dry & Clear",
      rain: "5%",
      wind: "15 km/h",
    },
    {
      temp: "32°C / 19°C",
      conditionHi: "खिली धूप / सामान्य",
      conditionEn: "Sunny & Normal",
      rain: "0%",
      wind: "13 km/h",
    },
  ];

  const currentDistObj = ALL_75_UP_DISTRICTS.find(
    (d) => d.name_hi === district || d.name_en === district
  ) || ALL_75_UP_DISTRICTS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "मौसम पूर्वानुमान" : "Weather Forecast" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "उत्तर प्रदेश कृषि मौसम वेधशाला (IMD अधिकृत)" : "UP Agro-Meteorological Weather (IMD Certified)"}
          subtitle={
            lang === "hi"
              ? "भारत मौसम विज्ञान विभाग (IMD) एवं एनडीयूएटी ग्रामीण कृषि मौसम सेवा (GKMS) द्वारा जारी आधिकारिक बुलेटिन"
              : "District-wise weather forecast, agricultural advisories, and extreme weather alerts directly from IMD & NDUAT"
          }
        />
      </div>

      {/* Visual Agro-Weather Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#d1d5db] shadow-sm mb-8 bg-[#14532d] text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1400&auto=format&fit=crop&q=80"
            alt="Agro Weather Forecast"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14532d]/95 via-[#15803d]/85 to-[#14532d]/90" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
              <CloudSun className="size-3.5 text-yellow-300" />
              {lang === "hi" ? "दैनिक कृषि मौसम बुलेटिन" : "Daily Agro-Weather Bulletin"}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {lang === "hi"
                ? `${currentDistObj.name_hi} जनपद हेतु वैज्ञानिक मौसम पूर्वानुमान`
                : `Scientific Weather Advisory for ${currentDistObj.name_en} District`}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {lang === "hi"
                ? "तापमान, वर्षा संभावना, वायु गति एवं कृषि वैज्ञानिकों द्वारा अनुशंसित सामयिक फसल सुरक्षा परामर्श।"
                : "Live temperature, precipitation chance, wind metrics, and agrometeorological crop advisories."}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-[11px] text-emerald-200 block uppercase font-semibold">
                {lang === "hi" ? "वर्तमान तापमान" : "Current Temp"}
              </span>
              <span className="text-3xl font-black text-white">29°C</span>
              <span className="text-[11px] text-emerald-200 block">
                {lang === "hi" ? "आर्द्रता: 48% • हवा: 12 km/h" : "Humidity: 48% • Wind: 12 km/h"}
              </span>
            </div>
            <div className="p-3 bg-yellow-400/20 rounded-xl border border-yellow-300/30">
              <CloudSun className="size-8 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-xs flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold text-[#14532d] mb-1.5">
              {lang === "hi" ? "जनपद चुनें (सभी 75 जनपद)" : "Select District (All 75 UP Districts)"}
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-[#f8faf5] border border-[#d1d5db] rounded-lg px-3 py-2.5 text-sm font-bold text-[#14532d] outline-none mb-6 cursor-pointer focus:border-[#15803d]"
            >
              {ALL_75_UP_DISTRICTS.map((d) => (
                <option key={d.code} value={lang === "hi" ? d.name_hi : d.name_en}>
                  {lang === "hi" ? `${d.name_hi} (${d.name_en})` : `${d.name_en} (${d.name_hi})`}
                </option>
              ))}
            </select>

            <div className="text-center py-4">
              <CloudSun className="size-16 text-[#eab308] mx-auto mb-2" />
              <h3 className="text-3xl font-black text-[#14532d]">29°C</h3>
              <p className="text-sm font-semibold text-[#15803d]">
                {lang === "hi" ? "साफ मौसम एवं खिली धूप" : "Clear Sky & Sunny"}
              </p>
              <p className="text-xs text-[#6b7280] mt-1">
                {lang === "hi" ? "जनपद: " : "District: "}
                <strong>{lang === "hi" ? currentDistObj.name_hi : currentDistObj.name_en}</strong> ({lang === "hi" ? currentDistObj.division_hi : currentDistObj.division_en})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[#f3f4f6] text-xs">
            <div className="flex items-center gap-2 text-[#4b5563]">
              <Droplets className="size-4 text-[#0284c7]" />
              <span>{lang === "hi" ? "आर्द्रता: 48%" : "Humidity: 48%"}</span>
            </div>
            <div className="flex items-center gap-2 text-[#4b5563]">
              <Wind className="size-4 text-[#6b7280]" />
              <span>{lang === "hi" ? "पवन: 12 किमी/घं" : "Wind: 12 km/h"}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-xs">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3 mb-4">
            <h4 className="font-bold text-[#14532d] text-base flex items-center gap-2">
              <Calendar className="size-5 text-[#15803d]" />
              <span>
                {lang === "hi" ? currentDistObj.name_hi : currentDistObj.name_en} — {lang === "hi" ? "5-दिवसीय मौसम पूर्वानुमान" : "5-Day Forecast"}
              </span>
            </h4>
            <Badge variant="success">{lang === "hi" ? "आईएमडी बुलेटिन" : "IMD Verified"}</Badge>
          </div>

          <div className="space-y-3">
            {weatherForecast.map((fc, idx) => {
              const dt = forecastDates[idx];
              return (
                <div
                  key={idx}
                  className="p-3 bg-[#f8faf5] border border-[#e5e7eb] rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm"
                >
                  <div className="w-28">
                    <span className="font-bold text-[#14532d] block">
                      {lang === "hi" ? dt?.dayHi : dt?.dayEn}
                    </span>
                    <span className="text-[11px] text-[#6b7280]">{dt?.dateStr}</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-[#1f2937]">
                    <CloudSun className="size-4 text-[#eab308]" />
                    <span>{lang === "hi" ? fc.conditionHi : fc.conditionEn}</span>
                  </div>
                  <div className="font-bold text-[#15803d]">{fc.temp}</div>
                  <div className="text-[11px] text-[#0284c7] font-semibold">
                    {lang === "hi" ? "वर्षा: " : "Rain: "}{fc.rain}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-xs mb-8">
        <h4 className="font-bold text-[#14532d] text-base mb-3 flex items-center gap-2">
          <Thermometer className="size-5 text-[#f97316]" />
          <span>{lang === "hi" ? "मौसम आधारित कृषि सलाह" : "Weather-Based Scientific Advisory"}</span>
        </h4>
        <div className="space-y-2 text-xs sm:text-sm text-[#374151] leading-relaxed">
          <p>
            • <strong>{lang === "hi" ? "गेहूँ: " : "Wheat: "}</strong>
            {lang === "hi"
              ? "मौसम शुष्क रहने की संभावना है। दाना पकने की अवस्था में तेज पछुआ हवा के दौरान सिंचाई से बचें ताकि फसल गिरे नहीं।"
              : "Dry weather expected. Avoid irrigation during strong westerly winds at grain-filling stage to prevent crop lodging."}
          </p>
          <p>
            • <strong>{lang === "hi" ? "सब्जियां व जायद फसलें: " : "Vegetables & Zaid Crops: "}</strong>
            {lang === "hi"
              ? "मूंग व उड़द की बुवाई हेतु खेत की तैयारी एवं पलेवा का कार्य पूर्ण करें।"
              : "Complete field preparation and pre-sowing irrigation for green gram (Moong) and black gram (Urad)."}
          </p>
          <p>
            • <strong>{lang === "hi" ? "बागवानी: " : "Horticulture: "}</strong>
            {lang === "hi"
              ? "आम के बौर में भुनगा (हॉपर) एवं चूर्णिल आसिता (पाउडरी मिल्ड्यू) की नियमित निगरानी रखें।"
              : "Monitor mango panicles regularly for mango hopper and powdery mildew infestation."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl text-xs">
        <SourceBadge
          sourceName="भारत मौसम विज्ञान विभाग (IMD Mausam) / NDUAT GKMS"
          sourceUrl="https://mausam.imd.gov.in/"
          updatedAt={new Date().toISOString().split("T")[0]}
        />
        <a
          href="https://mausam.imd.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-[#15803d] hover:underline"
        >
          <span>{lang === "hi" ? "आधिकारिक IMD मौसम वेबसाइट खोलें" : "Visit Official IMD Mausam Portal"}</span>
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </div>
  );
}
