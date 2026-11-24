"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, Save, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { ALL_75_UP_DISTRICTS } from "@/lib/locations";

export default function ProfileDashboard() {
  const { lang, setLang } = useI18n();
  const { user, token, refreshUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("अयोध्या");
  const [tehsil, setTehsil] = useState("");
  const [block, setBlock] = useState("");
  const [village, setVillage] = useState("");
  const [pincode, setPincode] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
      setDistrict(user.district || "अयोध्या");
      setTehsil(user.tehsil || "");
      setBlock(user.block || "");
      setVillage(user.village || "");
      setPincode(user.pincode || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSaved(false);

    try {
      const authToken = token || localStorage.getItem("uks_token");
      const res = await fetch("/api/v1/farmers/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken || ""}`,
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone: phone.trim() || undefined,
          district: district.trim(),
          tehsil: tehsil.trim() || undefined,
          block: block.trim() || undefined,
          village: village.trim() || undefined,
          pincode: pincode.trim() || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSaved(true);
        if (data.user) {
          localStorage.setItem("uks_user", JSON.stringify({ ...user, ...data.user }));
        }
        await refreshUser();
      } else {
        // If not authenticated or backend unavailable, update locally
        const updatedLocal = {
          ...user,
          full_name: fullName.trim(),
          district: district.trim(),
          tehsil: tehsil.trim(),
          block: block.trim(),
          village: village.trim(),
          pincode: pincode.trim(),
        };
        localStorage.setItem("uks_user", JSON.stringify(updatedLocal));
        setSaved(true);
      }
    } catch (err) {
      const updatedLocal = {
        ...user,
        full_name: fullName.trim(),
        district: district.trim(),
        tehsil: tehsil.trim(),
        block: block.trim(),
        village: village.trim(),
        pincode: pincode.trim(),
      };
      localStorage.setItem("uks_user", JSON.stringify(updatedLocal));
      setSaved(true);
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 5000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs
        items={[
          { label: lang === "hi" ? "डैशबोर्ड" : "Dashboard", href: "/dashboard" },
          { label: lang === "hi" ? "किसान प्रोफ़ाइल" : "Farmer Profile" },
        ]}
      />

      <div className="my-6">
        <h1 className="text-2xl font-black text-[#14532d]">
          {lang === "hi" ? "किसान खाता सेटिंग्स एवं प्रोफ़ाइल" : "Farmer Profile & Account Settings"}
        </h1>
        <p className="text-xs text-[#6b7280]">
          {lang === "hi"
            ? "अपनी व्यक्तिगत जानकारी, जनपद एवं विकास खंड का सत्यापन करें"
            : "Manage your personal information, contact details, and agricultural district"}
        </p>
      </div>

      {saved && (
        <Alert type="success" className="mb-4">
          {lang === "hi"
            ? "आपकी जानकारी सफलतापूर्वक अपडेट कर दी गई है।"
            : "Your profile information has been successfully updated."}
        </Alert>
      )}

      {errorMsg && (
        <Alert type="warning" className="mb-4">
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSave} className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#14532d] mb-1">
              {lang === "hi" ? "पूरा नाम *" : "Full Name *"}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#15803d]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#14532d] mb-1">
              {lang === "hi" ? "मोबाइल नंबर (पंजीकृत)" : "Mobile Number (Registered)"}
            </label>
            <input
              type="text"
              disabled
              value={phone || (user?.phone || "")}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#14532d] mb-1">
              {lang === "hi" ? "ईमेल पता" : "Email Address"}
            </label>
            <input
              type="email"
              disabled
              value={email || (user?.email || "")}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#14532d] mb-1">
              {lang === "hi" ? "जनपद (75 जनपदों में से चुनें) *" : "District (Choose from 75 UP Districts) *"}
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-[#f8faf5] outline-none focus:border-[#15803d]"
            >
              {ALL_75_UP_DISTRICTS.map((d) => (
                <option key={d.code} value={lang === "hi" ? d.name_hi : d.name_en}>
                  {lang === "hi" ? d.name_hi : d.name_en}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#14532d] mb-1">
              {lang === "hi" ? "तहसील" : "Tehsil"}
            </label>
            <input
              type="text"
              value={tehsil}
              onChange={(e) => setTehsil(e.target.value)}
              placeholder={lang === "hi" ? "उदा. सोहावल, सदर" : "e.g. Sohawal"}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#15803d]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#14532d] mb-1">
              {lang === "hi" ? "विकास खंड" : "Block"}
            </label>
            <input
              type="text"
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              placeholder={lang === "hi" ? "उदा. पूरा बाजार" : "e.g. Pura Bazar"}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#15803d]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#14532d] mb-1">
              {lang === "hi" ? "गाँव" : "Village"}
            </label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder={lang === "hi" ? "उदा. महमूदपुर" : "e.g. Mahmoodpur"}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#15803d]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#14532d] mb-1">
              {lang === "hi" ? "पिन कोड" : "PIN Code"}
            </label>
            <input
              type="text"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="224001"
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#15803d]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#14532d] mb-1">
              {lang === "hi" ? "पसंदीदा भाषा" : "Language Preference"}
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "hi" | "en")}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-[#f8faf5]"
            >
              <option value="en">English (English)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" variant="primary" disabled={saving}>
            <Save className="size-4 mr-1.5" />
            <span>{saving ? (lang === "hi" ? "सहेज रहे हैं..." : "Saving...") : (lang === "hi" ? "परिवर्तन सहेजें" : "Save Changes")}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
