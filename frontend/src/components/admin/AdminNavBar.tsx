"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Users, Sprout, FileText, HelpCircle, Video, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function AdminNavBar() {
  const pathname = usePathname();
  const { lang } = useI18n();

  const links = [
    {
      href: "/admin",
      label_hi: "नियंत्रण कक्ष अवलोकन",
      label_en: "Overview",
      icon: <ShieldCheck className="size-4" />,
      exact: true,
    },
    {
      href: "/admin/farmers",
      label_hi: "किसान डेटाबेस एवं सत्यापन",
      label_en: "Farmers Directory",
      icon: <Users className="size-4" />,
      exact: false,
    },
    {
      href: "/admin/crops",
      label_hi: "फसलें व अनुमोदित किस्में",
      label_en: "Crops Management",
      icon: <Sprout className="size-4" />,
      exact: false,
    },
    {
      href: "/admin/schemes",
      label_hi: "सरकारी योजनाएं",
      label_en: "Govt Schemes",
      icon: <FileText className="size-4" />,
      exact: false,
    },
    {
      href: "/admin/questions",
      label_hi: "किसान परामर्श प्रश्न",
      label_en: "Advisory Questions",
      icon: <HelpCircle className="size-4" />,
      exact: false,
    },
    {
      href: "/admin/videos",
      label_hi: "प्रशिक्षण वीडियो (40)",
      label_en: "Videos (40)",
      icon: <Video className="size-4" />,
      exact: false,
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#e5e7eb] mb-6">
      {links.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              isActive
                ? "bg-[#14532d] text-white shadow-xs"
                : "text-[#4b5563] hover:text-[#14532d] hover:bg-[#f0fdf4]"
            }`}
          >
            <span className={isActive ? "text-[#86efac]" : "text-[#15803d]"}>
              {link.icon}
            </span>
            <span>{lang === "hi" ? link.label_hi : link.label_en}</span>
          </Link>
        );
      })}

      <div className="ml-auto pl-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#15803d] hover:bg-[#dcfce7] border border-[#bbf7d0] transition-colors whitespace-nowrap"
        >
          <ExternalLink className="size-3.5" />
          <span>{lang === "hi" ? "मुख्य पोर्टल देखें" : "View Live Portal"}</span>
        </Link>
      </div>
    </div>
  );
}
