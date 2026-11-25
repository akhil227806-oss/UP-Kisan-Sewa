"use client";

import React from "react";
import { Award, Sprout, MapPin, TrendingUp, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useI18n } from "@/lib/i18n";

export default function SuccessStoriesPage() {
  const { lang } = useI18n();

  const stories = [
    {
      farmerName_hi: "श्री राम सेवक वर्मा",
      farmerName_en: "Shri Ram Sewak Verma",
      district_hi: "बाराबंकी",
      district_en: "Barabanki",
      image: "https://images.unsplash.com/photo-1592417817098-8f3d6ef231e2?w=600&auto=format&fit=crop&q=80",
      innovation_hi: "प्राकृतिक खेती एवं मेंथा के साथ सहफसली खेती",
      innovation_en: "Natural Farming & Mentha Intercropping",
      achievement_hi: "लागत में 40% कमी एवं शुद्ध लाभ में ₹1.5 लाख प्रति एकड़ की वृद्धि।",
      achievement_en: "40% reduction in cultivation cost and ₹1.5 Lakh/acre net profit boost.",
      story_hi: "एनडीयूएटी केवीके से प्रशिक्षण प्राप्त कर रासायनिक खादों का प्रयोग बंद किया और जीवामृत व घनजीवामृत का प्रयोग शुरू किया। मिट्टी की जलधारण क्षमता बढ़ी।",
      story_en: "Trained by NDUAT KVK to transition from synthetic inputs to Jeevamrit and bio-formulations, improving soil organic matter and water retention.",
      verifiedBy_hi: "केवीके हैदरगढ़, बाराबंकी",
      verifiedBy_en: "KVK Haidergarh, Barabanki",
    },
    {
      farmerName_hi: "श्रीमती कांति देवी",
      farmerName_en: "Smt. Kanti Devi",
      district_hi: "अयोध्या",
      district_en: "Ayodhya",
      image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
      innovation_hi: "महिला स्वयं सहायता समूह द्वारा बटन व ढींगरी मशरूम उत्पादन",
      innovation_en: "Self Help Group Mushroom Enterprise",
      achievement_hi: "प्रति माह ₹25,000 की अतिरिक्त पारिवारिक आय।",
      achievement_en: "Monthly supplementary income of ₹25,000 and rural employment.",
      story_hi: "कृषि विज्ञान केंद्र कुमारगंज से मशरूम स्पॉन एवं कंपोस्ट तैयार करने का प्रशिक्षण प्राप्त किया। अब गाँव की 15 अन्य महिलाओं को भी स्वरोजगार से जोड़ा है।",
      story_en: "Acquired training in oyster & button mushroom cultivation from KVK Kumarganj. Currently empowers 15 village women with sustainable livelihoods.",
      verifiedBy_hi: "एनडीयूएटी प्रसार निदेशालय",
      verifiedBy_en: "NDUAT Directorate of Extension",
    },
    {
      farmerName_hi: "श्री दिनेश चन्द्र त्रिपाठी",
      farmerName_en: "Shri Dinesh Chandra Tripathi",
      district_hi: "सुल्तानपुर",
      district_en: "Sultanpur",
      image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80",
      innovation_hi: "ड्रिप सिंचाई व मल्चिंग से शिमला मिर्च व तरबूज की संरक्षित खेती",
      innovation_en: "Precision Drip & Mulch Vegetable Farming",
      achievement_hi: "पारंपरिक धान-गेहूँ चक्र की तुलना में 3 गुना अधिक शुद्ध आय।",
      achievement_en: "3X higher net return compared to traditional cereal mono-cropping.",
      story_hi: "उद्यान विभाग की 50% सब्सिडी योजना से ड्रिप सिंचाई संयंत्र स्थापित किया। कम पानी और नियंत्रित पोषक तत्वों से बंपर पैदावार प्राप्त की।",
      story_en: "Installed drip irrigation system under 50% state subsidy, achieving bumper bell pepper harvest with 40% water conservation.",
      verifiedBy_hi: "केवीके कटका, सुल्तानपुर",
      verifiedBy_en: "KVK Katka, Sultanpur",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "सफलता की कहानियाँ" : "Success Stories" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "उत्तर प्रदेश के प्रगतिशील किसानों की सफलता की कहानियाँ" : "Farmer Success Stories"}
          subtitle={
            lang === "hi"
              ? "केवीके एवं एनडीयूएटी वैज्ञानिकों के मार्गदर्शन में नवाचार कर स्वावलंबी बने किसानों के वास्तविक प्रेरणादायक अनुभव"
              : "Documented case studies of progressive farmers adopting modern agronomic practices in Uttar Pradesh"
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stories.map((st, idx) => (
          <Card key={idx} className="flex flex-col justify-between overflow-hidden">
            <div>
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                <img
                  src={st.image}
                  alt={lang === "hi" ? st.farmerName_hi : st.farmerName_en}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="success" className="bg-[#15803d] text-white">
                    <MapPin className="size-3 mr-1" />
                    {lang === "hi" ? st.district_hi : st.district_en}
                  </Badge>
                </div>
              </div>

              <CardHeader className="bg-[#f8faf5]">
                <CardTitle className="text-[#14532d] flex items-center gap-1.5">
                  <Award className="size-5 text-[#eab308] shrink-0" />
                  <span>{lang === "hi" ? st.farmerName_hi : st.farmerName_en}</span>
                </CardTitle>
                <p className="text-xs font-semibold text-[#15803d] mt-1">
                  {lang === "hi" ? st.innovation_hi : st.innovation_en}
                </p>
              </CardHeader>

              <CardContent className="space-y-3 pt-4 text-xs sm:text-sm">
                <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg">
                  <span className="font-bold text-[#14532d] block text-xs mb-0.5">
                    {lang === "hi" ? "उपलब्धि व प्रभाव:" : "Key Achievement:"}
                  </span>
                  <p className="text-[#15803d] font-semibold">
                    {lang === "hi" ? st.achievement_hi : st.achievement_en}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[#374151] block text-xs mb-0.5">
                    {lang === "hi" ? "सफलता गाथा:" : "Case Summary:"}
                  </span>
                  <p className="text-[#4b5563] leading-relaxed">
                    {lang === "hi" ? st.story_hi : st.story_en}
                  </p>
                </div>
              </CardContent>
            </div>

            <div className="p-3 bg-[#f8faf5] border-t border-[#e5e7eb] flex items-center justify-between text-[11px] text-[#6b7280]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-[#15803d]" />
                <span>{lang === "hi" ? `सत्यापित: ${st.verifiedBy_hi}` : `Verified: ${st.verifiedBy_en}`}</span>
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
