"use client";

import React from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useI18n } from "@/lib/i18n";

export default function TermsPage() {
  const { lang } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "नियम एवं शर्तें" : "Terms & Conditions" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "नियम एवं शर्तें" : "Terms and Conditions"}
          subtitle={lang === "hi" ? "पोर्टल उपयोग की सामान्य शर्तें" : "General terms for using this portal"}
        />
      </div>

      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4 text-sm sm:text-base text-[#374151] leading-relaxed">
        <h3 className="font-bold text-[#14532d] text-lg">
          {lang === "hi" ? "1. सेवाओं का उपयोग" : "1. Use of Services"}
        </h3>
        <p>
          {lang === "hi"
            ? "यू पी किसान सेवा पोर्टल का उपयोग केवल वैध कृषि मार्गदर्शन, ज्ञान संवर्धन एवं परामर्श हेतु ही किया जा सकता है।"
            : "The Awadh Kisan Seva portal may be used exclusively for lawful agricultural guidance, farmer knowledge dissemination, and advisory services."}
        </p>

        <h3 className="font-bold text-[#14532d] text-lg">
          {lang === "hi" ? "2. सामग्री की सत्यता एवं बौद्धिक संपदा" : "2. Intellectual Property & Accuracy"}
        </h3>
        <p>
          {lang === "hi"
            ? "पोर्टल पर प्रकाशित अनुसंधान लेख, बुलेटिन एवं फसल पैकेज NDUAT तथा संबंधित कृषि संस्थानों की संपदा हैं। इनका उपयोग गैर-व्यावसायिक किसान लाभ हेतु किया जा सकता है।"
            : "Research bulletins and crop packages published here belong to NDUAT and respective agricultural institutions, and are provided for non-commercial farmer benefit."}
        </p>

        <h3 className="font-bold text-[#14532d] text-lg">
          {lang === "hi" ? "3. स्वतंत्र मंच का दायित्व" : "3. Institutional Disclaimer"}
        </h3>
        <p>
          {lang === "hi"
            ? "यह मंच सरकारी योजनाओं के आधिकारिक लिंक प्रदान करता है, किंतु किसी भी योजना के अनुमोदन अथवा अस्वीकृति का अंतिम अधिकार केवल संबंधित सरकारी विभाग का होता है।"
            : "This portal facilitates access to official government links; final approval or rejection of any scheme application rests solely with the competent government authority."}
        </p>
      </div>
    </div>
  );
}
