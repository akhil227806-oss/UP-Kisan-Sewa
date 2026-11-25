"use client";

import React, { useState } from "react";
import { FlaskConical, CheckCircle, Search, Layers, AlertCircle, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useI18n } from "@/lib/i18n";

export default function SeedsFertilizersPage() {
  const { lang } = useI18n();
  const [tab, setTab] = useState<"seeds" | "fertilizers">("seeds");

  const seeds = [
    {
      crop_hi: "गेहूँ",
      crop_en: "Wheat",
      variety_hi: "डीबीडब्ल्यू 187 (करन वंदना)",
      variety_en: "DBW 187 (Karan Vandana)",
      breeder_hi: "आईसीएआर-आईआईडब्ल्यूबीआर / एनडीयूएटी",
      breeder_en: "ICAR-IIWBR / NDUAT",
      seedRate_hi: "100 किग्रा/हेक्टेयर",
      seedRate_en: "100 kg/ha",
      treatment_hi: "कार्बेन्डाजिम 2 ग्राम + थीरम 2 ग्राम प्रति किग्रा बीज",
      treatment_en: "Carbendazim 2g + Thiram 2g per kg seed",
      features_hi: "समय पर बुवाई हेतु, रतुआ रोधी, उच्च प्रोटीन (12.5%), औसत उपज 61 कुंतल/हेक्टेयर।",
      features_en: "Timely sown, rust resistant, high protein (12.5%), average yield 61 q/ha.",
      source_hi: "उ.प्र. बीज विकास निगम / एनडीयूएटी",
      source_en: "UP Seed Development Corp / NDUAT",
    },
    {
      crop_hi: "धान",
      crop_en: "Paddy",
      variety_hi: "नरेंद्र धान 359",
      variety_en: "Narendra Dhan 359",
      breeder_hi: "एनडीयूएटी कुमारगंज, अयोध्या",
      breeder_en: "NDUAT Kumarganj, Ayodhya",
      seedRate_hi: "30-35 किग्रा/हेक्टेयर (रोपाई हेतु)",
      seedRate_en: "30-35 kg/ha (transplanting)",
      treatment_hi: "स्ट्रेप्टोसाइक्लिन 1 ग्राम + थीरम 25 ग्राम (25 किग्रा बीज हेतु)",
      treatment_en: "Streptocycline 1g + Thiram 25g (for 25 kg seed)",
      features_hi: "सिंचित मध्यम अवधि (125-130 दिन), रोगरोधी, चमकदार महीन दाना, उपज 55-60 कुंतल।",
      features_en: "Irrigated medium duration (125-130 days), disease tolerant, yield 55-60 q/ha.",
      source_hi: "एनडीयूएटी बीज निदेशालय",
      source_en: "NDUAT Directorate of Seed",
    },
    {
      crop_hi: "सरसों",
      crop_en: "Mustard",
      variety_hi: "नरेंद्र राई 1 (एनडीआर 8501)",
      variety_en: "Narendra Rai 1 (NDR 8501)",
      breeder_hi: "एनडीयूएटी कुमारगंज, अयोध्या",
      breeder_en: "NDUAT Kumarganj, Ayodhya",
      seedRate_hi: "4-5 किग्रा/हेक्टेयर",
      seedRate_en: "4-5 kg/ha",
      treatment_hi: "मेटालेक्सिल 6 ग्राम प्रति किग्रा बीज",
      treatment_en: "Metalaxyl 6g per kg seed",
      features_hi: "अवधि 120-125 दिन, तेल प्रतिशत 40-41%, सफेद रतुआ सहनशील, उपज 20-22 कुंतल।",
      features_en: "Duration 120-125 days, oil content 40-41%, white rust tolerant, yield 20-22 q/ha.",
      source_hi: "एनडीयूएटी तिलहन अनुभाग",
      source_en: "NDUAT Oilseeds Section",
    },
  ];

  const fertilizers = [
    {
      name_hi: "यूरिया (46% नाइट्रोजन)",
      name_en: "Urea (46% Nitrogen)",
      type_hi: "नाइट्रोजन धारी",
      type_en: "Nitrogenous",
      role_hi: "पौधों की वानस्पतिक वृद्धि, हरियाली एवं कल्ले फूटने में सहायक।",
      role_en: "Essential for vegetative development, canopy greenness, and tillering.",
      application_hi: "नीम लेपित यूरिया का प्रयोग करें। बुवाई पर 1/3 तथा शेष दो बार सिंचाई उपरांत दें।",
      application_en: "Apply neem-coated urea: 1/3 at basal sowing, remaining split equally after 1st & 2nd irrigations.",
    },
    {
      name_hi: "डी.ए.पी. (18% N, 46% P2O5)",
      name_en: "D.A.P. (18% N, 46% P2O5)",
      type_hi: "फास्फेटिक",
      type_en: "Phosphatic",
      role_hi: "जड़ों के सुदृढ़ विकास, तने की मजबूती एवं फूल/दाना बनने हेतु अनिवार्य।",
      role_en: "Crucial for deep root proliferation, strong stem structure, and grain formation.",
      application_hi: "बुवाई के समय कूंड़ों में बीज के नीचे 3-4 सेमी गहराई पर दें। खड़ी फसल में छिड़कना अनुचित।",
      application_en: "Place 3-4 cm below seed depth in furrows at sowing time. Do not broadcast over standing crops.",
    },
    {
      name_hi: "म्यूरिएट ऑफ पोटाश (60% K2O)",
      name_en: "Muriate of Potash (60% K2O)",
      type_hi: "पोटाशिक",
      type_en: "Potassic",
      role_hi: "रोग प्रतिरोधक क्षमता, सूखा सहनशीलता एवं दाने के चमक व वजन में वृद्धि।",
      role_en: "Enhances pest & disease tolerance, drought resilience, and grain test weight.",
      application_hi: "बुवाई के समय बेसल डोज के रूप में दें।",
      application_en: "Apply as complete basal dose during final land preparation before seeding.",
    },
    {
      name_hi: "जिंक सल्फेट (21% Zn व 33% Zn)",
      name_en: "Zinc Sulphate (21% Zn & 33% Zn)",
      type_hi: "सूक्ष्म पोषक तत्व",
      type_en: "Micronutrient",
      role_hi: "धान में खैरा रोग एवं गेहूँ में बौनापन रोकथाम हेतु अति आवश्यक।",
      role_en: "Prevents Khaira disease in paddy and severe stunting in cereal crops.",
      application_hi: "धान में 25 किग्रा जिंक सल्फेट (21%) प्रति हेक्टेयर बुवाई पूर्व मिट्टी में मिलाएँ।",
      application_en: "Mix 25 kg/ha Zinc Sulphate (21%) into soil prior to puddling/transplanting.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "बीज एवं उर्वरक" : "Seeds & Fertilizers" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "प्रमाणित बीज एवं संतुलित उर्वरक मार्गदर्शिका" : "Certified Seeds & Nutrient Management"}
          subtitle={
            lang === "hi"
              ? "एनडीयूएटी विकसित प्रजातियाँ, बीजोपचार विधियाँ एवं मृदा स्वास्थ्य आधारित संतुलित पोषक तत्व प्रबंधन (INM)"
              : "Scientifically approved crop varieties, seed treatments, and integrated balanced fertilizer guidelines"
          }
        />
      </div>

      <div className="flex gap-2 border-b border-[#e5e7eb] mb-6">
        <button
          type="button"
          onClick={() => setTab("seeds")}
          className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-colors cursor-pointer ${
            tab === "seeds"
              ? "border-[#15803d] text-[#15803d]"
              : "border-transparent text-[#6b7280] hover:text-[#1f2937]"
          }`}
        >
          {lang === "hi" ? "प्रमाणित बीज एवं किस्में" : "Certified Seeds & Varieties"}
        </button>
        <button
          type="button"
          onClick={() => setTab("fertilizers")}
          className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-colors cursor-pointer ${
            tab === "fertilizers"
              ? "border-[#15803d] text-[#15803d]"
              : "border-transparent text-[#6b7280] hover:text-[#1f2937]"
          }`}
        >
          {lang === "hi" ? "संतुलित उर्वरक एवं सूक्ष्म पोषक तत्व" : "Balanced Fertilizers & Micronutrients"}
        </button>
      </div>

      {/* Visual Showcase Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative rounded-2xl overflow-hidden h-44 shadow-xs border border-[#e5e7eb]">
          <img
            src="/seeds/seed-treatment.jpg"
            alt="Seed Treatment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
            <span className="text-[11px] font-bold text-[#86efac] uppercase tracking-wider">
              {lang === "hi" ? "वैज्ञानिक बीजोपचार" : "Certified Seed Treatment"}
            </span>
            <h4 className="text-base font-black">
              {lang === "hi" ? "कवकनाशी व कीटनाशी से शत-प्रतिशत बीजोपचार" : "100% Seed Treatment Protocol"}
            </h4>
            <p className="text-xs text-white/80 line-clamp-1">
              {lang === "hi" ? "उकठा, झुलसा व जड़ गलन से सुरक्षित अंकुरण" : "Protection against blight, wilt, and root rot"}
            </p>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden h-44 shadow-xs border border-[#e5e7eb]">
          <img
            src="/seeds/balanced-npk.jpg"
            alt="Balanced Fertilizers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
            <span className="text-[11px] font-bold text-[#fef08a] uppercase tracking-wider">
              {lang === "hi" ? "संतुलित पोषण (INM)" : "Integrated Nutrient Management"}
            </span>
            <h4 className="text-base font-black">
              {lang === "hi" ? "4:2:1 अनुपात में N:P:K का वैज्ञानिक प्रयोग" : "Optimal 4:2:1 N:P:K Ratio Application"}
            </h4>
            <p className="text-xs text-white/80 line-clamp-1">
              {lang === "hi" ? "रासायनिक उर्वरकों के साथ केंचुआ खाद व नैनो यूरिया" : "Combining chemical fertilizers with organic compost & nano urea"}
            </p>
          </div>
        </div>
      </div>

      {tab === "seeds" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {seeds.map((s, idx) => (
              <Card key={idx}>
                <CardHeader className="bg-[#f0fdf4]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#14532d]">
                      {lang === "hi" ? s.variety_hi : s.variety_en}
                    </CardTitle>
                    <Badge variant="success">{lang === "hi" ? s.crop_hi : s.crop_en}</Badge>
                  </div>
                  <p className="text-xs text-[#15803d] font-semibold mt-1">
                    {lang === "hi" ? "विकासक: " : "Developer: "}{lang === "hi" ? s.breeder_hi : s.breeder_en}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 pt-4 text-xs sm:text-sm">
                  <div>
                    <strong className="text-[#14532d] block">
                      {lang === "hi" ? "अनुशंसित बीज दर:" : "Recommended Seed Rate:"}
                    </strong>
                    <span className="text-[#374151]">{lang === "hi" ? s.seedRate_hi : s.seedRate_en}</span>
                  </div>
                  <div>
                    <strong className="text-[#14532d] block">
                      {lang === "hi" ? "वैज्ञानिक बीजोपचार:" : "Seed Treatment Protocol:"}
                    </strong>
                    <span className="text-[#374151] bg-[#f8faf5] p-2 rounded block border border-[#e5e7eb] mt-0.5">
                      {lang === "hi" ? s.treatment_hi : s.treatment_en}
                    </span>
                  </div>
                  <div>
                    <strong className="text-[#14532d] block">
                      {lang === "hi" ? "प्रमुख विशेषताएं:" : "Key Agronomic Features:"}
                    </strong>
                    <p className="text-[#4b5563] leading-relaxed mt-0.5">
                      {lang === "hi" ? s.features_hi : s.features_en}
                    </p>
                  </div>
                </CardContent>
                <div className="p-3 bg-[#f8faf5] border-t border-[#e5e7eb]">
                  <SourceBadge sourceName={lang === "hi" ? s.source_hi : s.source_en} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fertilizers.map((f, idx) => (
              <Card key={idx}>
                <CardHeader className="bg-[#f8faf5]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#14532d]">
                      {lang === "hi" ? f.name_hi : f.name_en}
                    </CardTitle>
                    <Badge variant="outline">{lang === "hi" ? f.type_hi : f.type_en}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4 text-xs sm:text-sm">
                  <div>
                    <strong className="text-[#14532d] block">
                      {lang === "hi" ? "पौधे में कार्य एवं भूमिका:" : "Nutrient Function & Plant Role:"}
                    </strong>
                    <p className="text-[#374151] mt-0.5">{lang === "hi" ? f.role_hi : f.role_en}</p>
                  </div>
                  <div>
                    <strong className="text-[#15803d] block">
                      {lang === "hi" ? "वैज्ञानिक प्रयोग विधि व समय:" : "Application Method & Timing:"}
                    </strong>
                    <p className="text-[#374151] bg-[#f0fdf4] p-2.5 rounded-lg border border-[#bbf7d0] mt-0.5">
                      {lang === "hi" ? f.application_hi : f.application_en}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="p-4 bg-[#fffbeb] border border-[#fde68a] rounded-xl text-xs sm:text-sm text-[#92400e]">
            <strong>{lang === "hi" ? "गोल्डन रूल: " : "Golden Rule: "}</strong>
            {lang === "hi"
              ? "उर्वरकों का प्रयोग सदैव 'मृदा स्वास्थ्य कार्ड' (Soil Health Card) की संस्तुति के अनुसार ही करें। रासायनिक खादों के साथ गोबर की खाद या केंचुआ खाद का अवश्य प्रयोग करें।"
              : "Always apply fertilizers according to official Soil Health Card dosages. Combine chemical fertilizers with vermicompost or farmyard manure (FYM) to maintain soil microbiology."}
          </div>
        </div>
      )}
    </div>
  );
}
