"use client";

import React from "react";
import { Layers, TestTube2, CheckCircle2, MapPin, FileText, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

export default function SoilHealthPage() {
  const { lang } = useI18n();

  const soilSteps = [
    {
      step_hi: "चरण 1",
      step_en: "Step 1",
      title_hi: "खेत से नमूना एकत्र करने का सही समय",
      title_en: "Optimal Sampling Timing",
      desc_hi: "फसल कटाई के उपरांत तथा अगली बुवाई से पूर्व जब खेत खाली हो और उचित नमी हो। खाद डालने के तुरंत बाद नमूना न लें।",
      desc_en: "Collect samples post-harvest before new sowing when field is unfertilized and has workable moisture.",
    },
    {
      step_hi: "चरण 2",
      step_en: "Step 2",
      title_hi: "'V' आकार का गड्ढा बनाना",
      title_en: "Digging 'V'-Shaped Profile",
      desc_hi: "खेत में 8-10 अलग-अलग स्थानों का चयन 'जिग-जैग' विधि से करें। खुरपी से 15 सेमी (6 इंच) गहरा 'V' आकार का गड्ढा खोदें।",
      desc_en: "Select 8-10 uniform spots in a zig-zag pattern. Dig a clean 15 cm (6-inch) deep 'V'-notch pit.",
    },
    {
      step_hi: "चरण 3",
      step_en: "Step 3",
      title_hi: "मिट्टी की परत एकत्र करना",
      title_en: "Scraping Core Slice",
      desc_hi: "गड्ढे की एक तरफ की सतह से ऊपर से नीचे तक 1 इंच मोटी मिट्टी की परत खुरचकर बाल्टी में एकत्र करें।",
      desc_en: "Scrape a uniform 1-inch thick core slice from top to bottom of the 'V' slope into a clean plastic bucket.",
    },
    {
      step_hi: "चरण 4",
      step_en: "Step 4",
      title_hi: "मिश्रण व चौथाईकरण विधि",
      title_en: "Composite Quartering",
      desc_hi: "सभी नमूनों को साफ बोरी पर मिलाकर गोल ढेर बनाएं। चार बराबर भाग करें, दो विपरीत भाग हटाएं। जब तक 500 ग्राम मिट्टी शेष न रहे, दोहराएं।",
      desc_en: "Mix all sub-samples thoroughly. Divide circular pile into four quarters, discard opposite two until 500g remains.",
    },
    {
      step_hi: "चरण 5",
      step_en: "Step 5",
      title_hi: "लेबलिंग व लैब भेजना",
      title_en: "Labeling & Lab Dispatch",
      desc_hi: "छाया में सुखाकर साफ पॉलीथीन बैग में किसान का नाम, गाटा संख्या, फसल व मोबाइल नंबर लिखकर निकटतम लैब या केवीके को भेजें।",
      desc_en: "Air dry in shade, pack in airtight polythene with farmer ID, survey/khasra number, and dispatch to nearest lab.",
    },
  ];

  const labs = [
    {
      district_hi: "अयोध्या",
      district_en: "Ayodhya",
      labName_hi: "मृदा परीक्षण प्रयोगशाला, कृषि विज्ञान केंद्र (NDUAT)",
      labName_en: "Soil Testing Laboratory, KVK (NDUAT)",
      location_hi: "कुमारगंज, अयोध्या",
      location_en: "Kumarganj, Ayodhya",
      phone: "05270-262024",
    },
    {
      district_hi: "सुल्तानपुर",
      district_en: "Sultanpur",
      labName_hi: "विभागीय मृदा परीक्षण प्रयोगशाला, उप कृषि निदेशक कार्यालय",
      labName_en: "Departmental Soil Testing Lab, Dy. Director Agriculture",
      location_hi: "सुल्तानपुर मुख्यालय",
      location_en: "Sultanpur Headquarter",
      phone: "1800-180-1551",
    },
    {
      district_hi: "बाराबंकी",
      district_en: "Barabanki",
      labName_hi: "मृदा परीक्षण लैब, कृषि विभाग",
      labName_en: "Soil Testing Lab, Dept of Agriculture",
      location_hi: "हैदरगढ़ रोड, बाराबंकी",
      location_en: "Haidergarh Road, Barabanki",
      phone: "1800-180-1551",
    },
    {
      district_hi: "बस्ती",
      district_en: "Basti",
      labName_hi: "केवीके मृदा जांच केंद्र (NDUAT)",
      labName_en: "KVK Soil Testing Facility (NDUAT)",
      location_hi: "बस्ती",
      location_en: "Basti",
      phone: "05542-282145",
    },
    {
      district_hi: "गोरखपुर",
      district_en: "Gorakhpur",
      labName_hi: "मृदा स्वास्थ्य प्रयोगशाला, कृषि भवन",
      labName_en: "Soil Health Laboratory, Krishi Bhawan",
      location_hi: "गोरखपुर",
      location_en: "Gorakhpur",
      phone: "1800-180-1551",
    },
    {
      district_hi: "वाराणसी",
      district_en: "Varanasi",
      labName_hi: "मृदा परीक्षण केंद्र, कृषि विज्ञान केंद्र",
      labName_en: "Soil Testing Centre, Krishi Vigyan Kendra",
      location_hi: "कल्लूपुर, वाराणसी",
      location_en: "Kallupur, Varanasi",
      phone: "1800-180-1551",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "मृदा स्वास्थ्य व परीक्षण" : "Soil Health & Testing" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "मृदा स्वास्थ्य कार्ड एवं परीक्षण मार्गदर्शिका" : "Soil Health Card & Soil Testing"}
          subtitle={
            lang === "hi"
              ? "खेत की मिट्टी का वैज्ञानिक नमूना लेने की सही विधि, 12 पोषक तत्वों की जांच एवं निकटतम लैब डायरेक्टरी"
              : "Standard soil sampling protocol, Soil Health Card interpretation, and accredited testing laboratories across UP"
          }
        />
      </div>

      {/* Visual Photo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-xs group">
          <div className="h-44 overflow-hidden relative">
            <img
              src="/soil/soil-sampling.jpg"
              alt="Soil Sampling"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <span className="text-[10px] font-bold bg-[#15803d] px-2 py-0.5 rounded uppercase">
                {lang === "hi" ? "चरणबद्ध विधि" : "Field Method"}
              </span>
              <h4 className="font-extrabold text-sm drop-shadow-md mt-1">
                {lang === "hi" ? "खेत से प्रामाणिक नमूना संकलन" : "Soil Sample Collection"}
              </h4>
            </div>
          </div>
          <div className="p-4 text-xs text-[#4b5563] leading-relaxed">
            {lang === "hi"
              ? "जिग-जैग पद्धति से 15 सेमी 'V' आकार का गड्ढा खोदकर 500 ग्राम प्रतिनिधि नमूना तैयार करें।"
              : "Take zig-zag core samples from 8-10 spots across the plot for representative 500g composite."}
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-xs group">
          <div className="h-44 overflow-hidden relative">
            <img
              src="/soil/soil-testing-lab.jpg"
              alt="Soil Testing Lab"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <span className="text-[10px] font-bold bg-[#0284c7] px-2 py-0.5 rounded uppercase">
                {lang === "hi" ? "प्रयोगशाला जांच" : "Laboratory Testing"}
              </span>
              <h4 className="font-extrabold text-sm drop-shadow-md mt-1">
                {lang === "hi" ? "12 मुख्य व सूक्ष्म पोषक तत्व विश्लेषण" : "12-Nutrient Diagnostic Analysis"}
              </h4>
            </div>
          </div>
          <div className="p-4 text-xs text-[#4b5563] leading-relaxed">
            {lang === "hi"
              ? "पीएच, ईसी, जैविक कार्बन, नाइट्रोजन, फास्फोरस, पोटाश, सल्फर, जिंक, आयरन व बोरोन की सटीक जांच।"
              : "Spectrophotometric analysis of pH, EC, Organic Carbon, N, P, K, Zn, Fe, and micronutrients."}
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-xs group">
          <div className="h-44 overflow-hidden relative">
            <img
              src="/soil/soil-health-card.jpg"
              alt="Soil Health Card"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <span className="text-[10px] font-bold bg-[#ca8a04] px-2 py-0.5 rounded uppercase">
                {lang === "hi" ? "डिजिटल कार्ड" : "Official Card"}
              </span>
              <h4 className="font-extrabold text-sm drop-shadow-md mt-1">
                {lang === "hi" ? "मृदा स्वास्थ्य कार्ड एवं संस्तुति" : "Soil Health Card Recommendations"}
              </h4>
            </div>
          </div>
          <div className="p-4 text-xs text-[#4b5563] leading-relaxed">
            {lang === "hi"
              ? "आवश्यकतानुसार खाद व उर्वरक देकर 20-30% लागत घटाएं तथा फसल पैदावार में वृद्धि प्राप्त करें।"
              : "Targeted fertilizer dosing recommendations to reduce input cost and prevent soil degradation."}
          </div>
        </div>
      </div>

      {/* Sampling Process */}
      <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-xs mb-8">
        <h3 className="text-lg font-bold text-[#14532d] mb-4 flex items-center gap-2">
          <TestTube2 className="size-5 text-[#15803d]" />
          <span>
            {lang === "hi" ? "मिट्टी का नमूना लेने की प्रामाणिक 5-चरणीय विधि" : "Standard 5-Step Soil Sampling Protocol"}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {soilSteps.map((st, idx) => (
            <div key={idx} className="p-4 bg-[#f8faf5] border border-[#e5e7eb] rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-[#15803d] bg-[#dcfce7] px-2 py-0.5 rounded inline-block mb-2">
                  {lang === "hi" ? st.step_hi : st.step_en}
                </span>
                <h4 className="font-bold text-sm text-[#14532d] mb-1">
                  {lang === "hi" ? st.title_hi : st.title_en}
                </h4>
                <p className="text-xs text-[#4b5563] leading-relaxed">
                  {lang === "hi" ? st.desc_hi : st.desc_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lab Directory */}
      <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-xs mb-8">
        <h3 className="text-lg font-bold text-[#14532d] mb-4 flex items-center gap-2">
          <MapPin className="size-5 text-[#f97316]" />
          <span>
            {lang === "hi"
              ? "उत्तर प्रदेश मृदा परीक्षण प्रयोगशाला डायरेक्टरी (KVK एवं विभागीय लैब)"
              : "Uttar Pradesh Soil Testing Laboratory Directory (KVK & State Labs)"}
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {labs.map((lb, idx) => (
            <div key={idx} className="p-4 bg-[#f8faf5] border border-[#e5e7eb] rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#15803d] bg-[#dcfce7] px-2 py-0.5 rounded">
                  {lang === "hi" ? `जनपद: ${lb.district_hi}` : `District: ${lb.district_en}`}
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#14532d] mt-1">
                {lang === "hi" ? lb.labName_hi : lb.labName_en}
              </h4>
              <p className="text-xs text-[#6b7280] mt-1">
                {lang === "hi" ? lb.location_hi : lb.location_en}
              </p>
              <p className="text-xs text-[#0284c7] font-semibold mt-2">
                {lang === "hi" ? "संपर्क: " : "Contact: "}{lb.phone}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#f0fdf4] border border-[#bbf7d0] p-4 rounded-xl">
        <SourceBadge
          sourceName={lang === "hi" ? "कृषि विभाग उत्तर प्रदेश / एनडीयूएटी मृदा विज्ञान विभाग" : "UP Department of Agriculture / NDUAT Soil Science"}
          sourceUrl="https://soilhealth.dac.gov.in/"
        />
        <a
          href="https://soilhealth.dac.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs sm:text-sm font-bold text-[#15803d] hover:underline"
        >
          {lang === "hi" ? "आधिकारिक सॉइल हेल्थ कार्ड पोर्टल देखें →" : "Visit Official Soil Health Card Portal →"}
        </a>
      </div>
    </div>
  );
}
