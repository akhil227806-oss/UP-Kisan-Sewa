"use client";

import React from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useI18n } from "@/lib/i18n";

export default function PrivacyPage() {
  const { lang } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "गोपनीयता नीति" : "Privacy Policy" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "गोपनीयता नीति" : "Privacy Policy"}
          subtitle={lang === "hi" ? "अंतिम अद्यतन: 21 मार्च 2026" : "Last updated: March 21, 2026"}
        />
      </div>

      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4 text-sm sm:text-base text-[#374151] leading-relaxed">
        <h3 className="font-bold text-[#14532d] text-lg">
          {lang === "hi" ? "1. किसान डेटा सुरक्षा एवं गोपनीयता" : "1. Farmer Data Protection & Privacy"}
        </h3>
        <p>
          {lang === "hi"
            ? "यू पी किसान सेवा पोर्टल पर किसानों द्वारा पंजीकरण के दौरान प्रदान की गई जानकारी (नाम, मोबाइल नंबर, जनपद, गाँव) का उपयोग केवल कृषि मार्गदर्शन, परामर्श एवं मौसम/योजना अलर्ट प्रेषित करने हेतु किया जाता है।"
            : "Information provided by farmers during registration (name, mobile, district, village) is strictly utilized for agricultural advisory, scheme benefits, and verified weather alerts."}
        </p>

        <h3 className="font-bold text-[#14532d] text-lg">
          {lang === "hi" ? "2. डेटा साझा न करने का संकल्प" : "2. Non-Disclosure & Data Security"}
        </h3>
        <p>
          {lang === "hi"
            ? "हम किसान के किसी भी व्यक्तिगत विवरण को किसी भी व्यावसायिक अथवा विपणन कंपनी को नहीं बेचते और न ही साझा करते हैं।"
            : "We do not sell, rent, or share personal farmer details with commercial advertising or marketing third parties."}
        </p>

        <h3 className="font-bold text-[#14532d] text-lg">
          {lang === "hi" ? "3. सुरक्षा एवं कुकीज़" : "3. Security & Local Storage"}
        </h3>
        <p>
          {lang === "hi"
            ? "उपयोगकर्ता की भाषा प्राथमिकता एवं सत्र सुरक्षा के लिए सुरक्षित कुकीज़ तथा स्थानीय संग्रहण (LocalStorage) का उपयोग किया जाता है।"
            : "Secure cookies and local browser storage are utilized solely for language preferences and authenticated session security."}
        </p>
      </div>
    </div>
  );
}
