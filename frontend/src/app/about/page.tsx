"use client";

import React from "react";
import { GraduationCap, ShieldCheck, Sprout, CheckCircle2, Code, User, ExternalLink, Building } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const { lang } = useI18n();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[{ label: lang === "hi" ? "हमारे बारे में" : "About Us" }]}
      />

      <div className="my-6">
        <SectionHeader
          title={lang === "hi" ? "अवध किसान सेवा — परिचय एवं उद्देश्य" : "About Awadh Kisan Seva"}
          subtitle={
            lang === "hi"
              ? "किसान की प्रगति, प्रदेश की समृद्धि"
              : "Farmer Prosperity, State Progress"
          }
        />
      </div>

      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8 shadow-xs space-y-8 text-sm sm:text-base text-[#374151] leading-relaxed">
        {/* Intro */}
        <div>
          <h2 className="text-xl font-bold text-[#14532d] mb-2">
            {lang === "hi" ? "हमारा ध्येय" : "Our Mission"}
          </h2>
          <p>
            {lang === "hi" ? (
              <>
                <strong>अवध किसान सेवा</strong> अवध क्षेत्र एवं सम्पूर्ण उत्तर प्रदेश के अन्नदाताओं को समय पर सटीक, वैज्ञानिक और व्यवहारिक कृषि मार्गदर्शन उपलब्ध कराने हेतु विकसित एक आधुनिक डिजिटल कृषि सहायता मंच है। हमारा प्राथमिक लक्ष्य प्रयोगशाला के शोध और विश्वविद्यालय के वैज्ञानिक ज्ञान को सीधे किसान के खेत (Lab to Land) तक पहुँचाना है।
              </>
            ) : (
              <>
                <strong>Awadh Kisan Seva</strong> is a modern digital agricultural advisory platform developed to provide accurate, timely, scientific, and actionable farming guidance to farmers across the Awadh region and the entire state of Uttar Pradesh. Our core mission is bridging the gap between laboratory research and farmers&apos; fields (Lab to Land).
              </>
            )}
          </p>
        </div>

        {/* Academic Mentorship & Developer Credit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#f8faf5] p-6 rounded-2xl border border-[#e5e7eb]">
          <div className="space-y-2">
            <Badge variant="success">
              {lang === "hi" ? "परियोजना मार्गदर्शन" : "Academic Mentorship"}
            </Badge>
            <h3 className="text-lg font-bold text-[#14532d]">Dr. Neeraj Kumar Singh</h3>
            <p className="text-xs font-semibold text-[#15803d]">Assistant Professor</p>
            <p className="text-xs text-[#4b5563]">Specialization: Renewable Energy Engineering</p>
            <p className="text-xs text-[#6b7280]">
              {lang === "hi"
                ? "महामाया कृषि अभियांत्रिकी एवं प्रौद्योगिकी महाविद्यालय (MCAET), NDUAT"
                : "Mahamaya College of Agricultural Engineering and Technology (MCAET), NDUAT"}
            </p>
          </div>

          <div className="space-y-2">
            <Badge variant="accent">
              {lang === "hi" ? "तकनीकी विकास" : "System Development"}
            </Badge>
            <h3 className="text-lg font-bold text-[#14532d]">Akhil Yadav</h3>
            <p className="text-xs font-semibold text-[#15803d]">B.Tech 4th Year Student</p>
            <p className="text-xs text-[#4b5563]">Computer Science and Engineering</p>
            <p className="text-xs text-[#6b7280]">
              {lang === "hi"
                ? "महामाया कृषि अभियांत्रिकी एवं प्रौद्योगिकी महाविद्यालय (MCAET), अम्बेडकर नगर"
                : "Mahamaya College of Agricultural Engineering and Technology (MCAET), Ambedkar Nagar"}
            </p>
          </div>
        </div>

        {/* Institutional Affiliation */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#14532d] flex items-center gap-2">
            <GraduationCap className="size-6 text-[#15803d]" />
            <span>{lang === "hi" ? "संबद्ध शैक्षणिक संस्थान" : "Affiliated Academic Institutions"}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-white border border-[#bbf7d0] rounded-xl shadow-xs">
              <h4 className="font-bold text-[#14532d] text-base mb-1">
                {lang === "hi"
                  ? "आचार्य नरेंद्र देव कृषि एवं प्रौद्योगिकी विश्वविद्यालय (ANDUAT)"
                  : "Acharya Narendra Deva University of Agriculture and Technology (ANDUAT)"}
              </h4>
              <p className="text-xs text-[#4b5563] leading-relaxed mb-3">
                {lang === "hi"
                  ? "कुमारगंज, अयोध्या (उत्तर प्रदेश) में स्थित राज्य का शीर्ष कृषि विश्वविद्यालय, जो उन्नत बीज प्रजातियों, सस्य अनुसंधान एवं 25 से अधिक कृषि विज्ञान केंद्रों (KVK) के माध्यम से किसानों के सर्वांगीण विकास में अग्रणी है।"
                  : "Leading state agricultural university located in Kumarganj, Ayodhya (UP), pioneering high-yielding seed varieties, agronomic research, and farmer outreach through 25+ Krishi Vigyan Kendras (KVKs)."}
              </p>
              <a
                href="https://nduat.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#15803d] hover:underline"
              >
                <span>https://nduat.org/</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>

            <div className="p-5 bg-white border border-[#bbf7d0] rounded-xl shadow-xs">
              <h4 className="font-bold text-[#14532d] text-base mb-1">
                {lang === "hi"
                  ? "महामाया कृषि अभियांत्रिकी एवं प्रौद्योगिकी महाविद्यालय (MCAET)"
                  : "Mahamaya College of Agricultural Engineering and Technology (MCAET)"}
              </h4>
              <p className="text-xs text-[#4b5563] leading-relaxed mb-3">
                {lang === "hi"
                  ? "अकबरपुर, अम्बेडकर नगर में स्थित NDUAT का इंजीनियरिंग महाविद्यालय, जो कृषि यंत्रीकरण, नवीकरणीय ऊर्जा, मृदा-जल संरक्षण एवं सूचना प्रौद्योगिकी के क्षेत्र में उत्कृष्ट शिक्षा व शोध प्रदान करता है।"
                  : "Premier constituent engineering college of NDUAT situated in Akbarpur, Ambedkar Nagar, excelling in farm mechanization, renewable energy, soil-water conservation, and agricultural informatics."}
              </p>
              <a
                href="https://mcaet.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#15803d] hover:underline"
              >
                <span>https://mcaet.vercel.app/</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div>
          <h3 className="text-xl font-bold text-[#14532d] mb-3">
            {lang === "hi" ? "मंच के मुख्य स्तम्भ एवं सुविधाएँ" : "Platform Key Pillars & Services"}
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <li className="flex items-start gap-2 p-3 bg-[#f8faf5] rounded-lg border border-[#e5e7eb]">
              <CheckCircle2 className="size-4 text-[#15803d] shrink-0 mt-0.5" />
              <span>
                <strong>{lang === "hi" ? "सत्यापित फसल संदर्शिका: " : "Verified Crop Guides: "}</strong>
                {lang === "hi" ? "बुवाई से कटाई तक वैज्ञानिक सलाह व उपयुक्त किस्में।" : "Scientific advice and certified varieties from sowing to harvest."}
              </span>
            </li>
            <li className="flex items-start gap-2 p-3 bg-[#f8faf5] rounded-lg border border-[#e5e7eb]">
              <CheckCircle2 className="size-4 text-[#15803d] shrink-0 mt-0.5" />
              <span>
                <strong>{lang === "hi" ? "दैनिक मंडी भाव: " : "Daily Mandi Rates: "}</strong>
                {lang === "hi" ? "एगमार्कनेट से एकीकृत आधिकारिक थोक बाजार भाव।" : "Real-time wholesale market prices integrated from Agmarknet."}
              </span>
            </li>
            <li className="flex items-start gap-2 p-3 bg-[#f8faf5] rounded-lg border border-[#e5e7eb]">
              <CheckCircle2 className="size-4 text-[#15803d] shrink-0 mt-0.5" />
              <span>
                <strong>{lang === "hi" ? "मौसम एवं कृषि चेतावनी: " : "Weather & Agro Alerts: "}</strong>
                {lang === "hi" ? "आईएमडी वेधशाला आधारित 5-दिवसीय जिला पूर्वानुमान।" : "5-day district-level weather forecast from IMD agro-observatories."}
              </span>
            </li>
            <li className="flex items-start gap-2 p-3 bg-[#f8faf5] rounded-lg border border-[#e5e7eb]">
              <CheckCircle2 className="size-4 text-[#15803d] shrink-0 mt-0.5" />
              <span>
                <strong>{lang === "hi" ? "विशेषज्ञ सीधा परामर्श: " : "Direct Expert Advisory: "}</strong>
                {lang === "hi" ? "समस्याग्रस्त फसल की फोटो अपलोड कर वैज्ञानिकों से मार्गदर्शन।" : "Ask NDUAT agricultural scientists with direct photo upload."}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
