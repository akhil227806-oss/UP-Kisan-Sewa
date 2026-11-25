"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle,
  XCircle,
  Search,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
  Download,
  Eye,
  X,
  Compass,
  Calendar,
  AlertTriangle,
  UserCheck,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AdminNavBar } from "@/components/admin/AdminNavBar";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

interface FarmerRecord {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  district: string;
  division?: string;
  tehsil?: string;
  block?: string;
  village?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  location_source?: string;
  status: string;
  email_verified: boolean;
  created_at: string;
}

export default function AdminFarmersPage() {
  const { lang } = useI18n();
  const { token } = useAuth();
  const [farmers, setFarmers] = useState<FarmerRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const effectiveToken = useMemo(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("admin_token") ||
        localStorage.getItem("uks_token") ||
        localStorage.getItem("auth_token") ||
        token ||
        ""
      );
    }
    return token || "";
  }, [token]);

  const loadFarmers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/users?limit=200", {
        headers: effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (data.users) {
          setFarmers(data.users.filter((u: any) => u.role === "farmer"));
        }
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmers();
  }, [effectiveToken]);

  const updateStatus = async (id: string, newStatus: string) => {
    setActionLoading(true);
    setFarmers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
    if (selectedFarmer && selectedFarmer.id === id) {
      setSelectedFarmer({ ...selectedFarmer, status: newStatus });
    }
    try {
      await fetch(`/api/v1/admin/users/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${effectiveToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // kept optimistic
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCsv = () => {
    window.open(`/api/v1/admin/export/farmers.csv`, "_blank");
  };

  const filtered = useMemo(() => {
    return farmers.filter((f) => {
      const matchesSearch =
        (f.full_name && f.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (f.phone && f.phone.includes(searchQuery)) ||
        (f.email && f.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (f.district && f.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (f.village && f.village.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        filter === "all" ||
        (filter === "pending" && (f.status === "pending_verification" || !f.email_verified)) ||
        (filter === "active" && f.status === "active") ||
        (filter === "suspended" && f.status === "suspended");

      return matchesSearch && matchesStatus;
    });
  }, [farmers, searchQuery, filter]);

  const stats = useMemo(() => {
    const total = farmers.length;
    const verified = farmers.filter((f) => f.email_verified).length;
    const active = farmers.filter((f) => f.status === "active").length;
    const pending = farmers.filter((f) => f.status === "pending_verification" || !f.email_verified).length;
    return { total, verified, active, pending };
  }, [farmers]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: lang === "hi" ? "एडमिन" : "Admin", href: "/admin" },
          { label: lang === "hi" ? "किसान अनुमोदन" : "Farmer Approvals" },
        ]}
      />

      <AdminNavBar />

      {/* Top Banner and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#14532d]">
            {lang === "hi" ? "किसान पंजीकरण समीक्षा एवं KYC अनुमोदन" : "Farmer Registration Review & KYC Approvals"}
          </h1>
          <p className="text-xs text-[#6b7280]">
            {lang === "hi"
              ? "सुरक्षित प्रमाणीकरण प्रणाली: पंजीकृत किसानों का जनपद, तहसील, ब्लॉक व जीपीएस विवरण"
              : "Enterprise Farmer Directory: Verify KYC details, track email verifications, and export audit registries"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="border-[#15803d] text-[#15803d]">
            <Download className="size-3.5" />
            <span>{lang === "hi" ? "CSV निर्यात करें" : "Export (.CSV)"}</span>
          </Button>

          <Button variant="outline" size="sm" onClick={loadFarmers} disabled={loading}>
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{lang === "hi" ? "रिफ्रेश" : "Refresh"}</span>
          </Button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs">
          <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider block">
            {lang === "hi" ? "कुल पंजीकृत किसान" : "Total Registered Farmers"}
          </span>
          <span className="text-2xl font-black text-[#14532d] mt-1 block font-mono">
            {stats.total}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs">
          <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider block">
            {lang === "hi" ? "ईमेल सत्यापित" : "Email Verified"}
          </span>
          <span className="text-2xl font-black text-[#15803d] mt-1 block font-mono">
            {stats.verified}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs">
          <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider block">
            {lang === "hi" ? "सक्रिय किसान खाते" : "Active Accounts"}
          </span>
          <span className="text-2xl font-black text-[#0369a1] mt-1 block font-mono">
            {stats.active}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs">
          <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider block">
            {lang === "hi" ? "समीक्षाधीन" : "Pending Review"}
          </span>
          <span className="text-2xl font-black text-[#b45309] mt-1 block font-mono">
            {stats.pending}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-[#9ca3af]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === "hi"
                ? "नाम, मोबाइल नंबर, ईमेल, जनपद अथवा गाँव खोजें..."
                : "Search by farmer name, phone, email, district, or village..."
            }
            className="w-full pl-9 pr-3 py-2 border border-[#d1d5db] rounded-lg text-xs sm:text-sm outline-none focus:border-[#15803d]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="py-2 px-3 border border-[#d1d5db] rounded-lg text-xs sm:text-sm bg-white text-[#374151] outline-none focus:border-[#15803d]"
          >
            <option value="all">{lang === "hi" ? "सभी किसान" : "All Farmers"}</option>
            <option value="active">{lang === "hi" ? "स्वीकृत / सक्रिय" : "Active Accounts"}</option>
            <option value="pending">{lang === "hi" ? "लंबित सत्यापन" : "Pending Review"}</option>
            <option value="suspended">{lang === "hi" ? "निलंबित खाते" : "Suspended"}</option>
          </select>

          <span className="text-xs font-semibold text-[#15803d] bg-[#dcfce7] px-3 py-1.5 rounded-lg border border-[#86efac] whitespace-nowrap">
            {filtered.length} {lang === "hi" ? "रिकॉर्ड" : "Records"}
          </span>
        </div>
      </div>

      {/* Main Farmers Table */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#14532d] text-white">
                <th className="p-3.5">{lang === "hi" ? "किसान का नाम" : "Farmer Name"}</th>
                <th className="p-3.5">{lang === "hi" ? "मोबाइल व ईमेल" : "Mobile & Email"}</th>
                <th className="p-3.5">{lang === "hi" ? "जनपद / गाँव" : "District & Location"}</th>
                <th className="p-3.5">{lang === "hi" ? "ईमेल सत्यापन" : "Email Verification"}</th>
                <th className="p-3.5">{lang === "hi" ? "खाता स्थिति" : "Account Status"}</th>
                <th className="p-3.5 text-center">{lang === "hi" ? "कार्रवाई" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#6b7280]">
                    {lang === "hi" ? "कोई किसान रिकॉर्ड नहीं मिला।" : "No farmer records found."}
                  </td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-[#f8faf5] transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-[#dcfce7] text-[#14532d] flex items-center justify-center font-bold text-xs shrink-0">
                          {f.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-[#14532d] block">{f.full_name}</span>
                          <span className="text-[11px] text-[#6b7280] font-mono">
                            ID: #{f.id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-0.5 text-xs text-[#374151]">
                        <div className="flex items-center gap-1.5 font-mono">
                          <Phone className="size-3 text-[#9ca3af]" />
                          <span>{f.phone || "—"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="size-3 text-[#9ca3af]" />
                          <span className="truncate max-w-[180px]">{f.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1 text-xs font-semibold text-[#14532d]">
                        <MapPin className="size-3 text-[#15803d] shrink-0" />
                        <span>{f.district || "उ.प्र."}</span>
                        {f.village && <span className="text-[#6b7280] font-normal">• {f.village}</span>}
                      </div>
                    </td>

                    <td className="p-3.5">
                      {f.email_verified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#15803d] bg-[#dcfce7] px-2 py-0.5 rounded-full border border-[#86efac]">
                          <CheckCircle className="size-3" />
                          <span>{lang === "hi" ? "सत्यापित" : "Verified"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-full border border-[#fde68a]">
                          <AlertTriangle className="size-3" />
                          <span>{lang === "hi" ? "अपुष्ट" : "Unverified"}</span>
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          f.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : f.status === "suspended"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {f.status === "active"
                          ? lang === "hi"
                            ? "सक्रिय"
                            : "Active"
                          : f.status === "suspended"
                          ? lang === "hi"
                            ? "निलंबित"
                            : "Suspended"
                          : lang === "hi"
                          ? "समीक्षाधीन"
                          : "Pending"}
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFarmer(f)}
                          className="h-7 px-2 text-xs"
                        >
                          <Eye className="size-3 mr-1" />
                          <span>{lang === "hi" ? "KYC जांचें" : "Inspect"}</span>
                        </Button>

                        {f.status !== "active" ? (
                          <button
                            onClick={() => updateStatus(f.id, "active")}
                            title={lang === "hi" ? "स्वीकृत करें" : "Approve"}
                            className="p-1 rounded text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                          >
                            <UserCheck className="size-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(f.id, "suspended")}
                            title={lang === "hi" ? "निलंबित करें" : "Suspend"}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            <Ban className="size-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Farmer KYC Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="size-9 rounded-full bg-[#dcfce7] text-[#14532d] flex items-center justify-center font-bold">
                  <ShieldCheck className="size-5 text-[#15803d]" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#14532d]">{selectedFarmer.full_name}</h3>
                  <p className="text-[11px] text-[#6b7280]">
                    {lang === "hi" ? "आधिकारिक किसान KYC प्रोफाइल" : "Official Farmer KYC Profile"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFarmer(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 my-4 text-xs sm:text-sm">
              {/* Account Status Strip */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#6b7280] block font-semibold">
                    {lang === "hi" ? "खाता स्थिति" : "Account Status"}
                  </span>
                  <span className="font-bold text-[#14532d] uppercase">
                    {selectedFarmer.status}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#6b7280] block font-semibold">
                    {lang === "hi" ? "ईमेल सत्यापन" : "Email Status"}
                  </span>
                  <span
                    className={`font-bold ${
                      selectedFarmer.email_verified ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {selectedFarmer.email_verified
                      ? lang === "hi"
                        ? "सत्यापित (Verified)"
                        : "Verified"
                      : lang === "hi"
                      ? "लंबित (Pending)"
                      : "Pending"}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-[#14532d] uppercase tracking-wider">
                  {lang === "hi" ? "संपर्क विवरण" : "Contact Details"}
                </h4>
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white border border-[#e5e7eb]">
                  <div>
                    <span className="text-[11px] text-[#6b7280] block">{lang === "hi" ? "मोबाइल नंबर" : "Phone"}</span>
                    <span className="font-mono font-bold text-[#374151]">{selectedFarmer.phone || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#6b7280] block">{lang === "hi" ? "ईमेल पता" : "Email"}</span>
                    <span className="font-medium text-[#374151] truncate block">{selectedFarmer.email}</span>
                  </div>
                </div>
              </div>

              {/* Geographic Hierarchy */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-[#14532d] uppercase tracking-wider">
                  {lang === "hi" ? "भौगोलिक एवं प्रशासनिक पता" : "Geographic Hierarchy"}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-white border border-[#e5e7eb]">
                  <div>
                    <span className="text-[11px] text-[#6b7280] block">{lang === "hi" ? "मण्डल" : "Division"}</span>
                    <span className="font-bold text-[#14532d]">{selectedFarmer.division || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#6b7280] block">{lang === "hi" ? "जनपद" : "District"}</span>
                    <span className="font-bold text-[#14532d]">{selectedFarmer.district || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#6b7280] block">{lang === "hi" ? "तहसील" : "Tehsil"}</span>
                    <span className="font-bold text-[#374151]">{selectedFarmer.tehsil || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#6b7280] block">{lang === "hi" ? "विकास खंड" : "Block"}</span>
                    <span className="font-bold text-[#374151]">{selectedFarmer.block || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#6b7280] block">{lang === "hi" ? "ग्राम" : "Village"}</span>
                    <span className="font-bold text-[#374151]">{selectedFarmer.village || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#6b7280] block">{lang === "hi" ? "पिन कोड" : "PIN Code"}</span>
                    <span className="font-mono font-bold text-[#15803d]">{selectedFarmer.pincode || "—"}</span>
                  </div>
                </div>
              </div>

              {/* GPS Coordinates */}
              {(selectedFarmer.latitude || selectedFarmer.longitude) && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                    <Compass className="size-3.5 text-emerald-700" />
                    <span>{lang === "hi" ? "सत्यापित जीपीएस निर्देशांक (GPS)" : "Verified GPS Coordinates"}</span>
                  </div>
                  <div className="font-mono text-emerald-800">
                    {selectedFarmer.latitude}, {selectedFarmer.longitude} ({selectedFarmer.location_source || "GPS"})
                  </div>
                </div>
              )}

              {/* Registration Timestamp */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#6b7280]">
                <Calendar className="size-3.5" />
                <span>
                  {lang === "hi" ? "पंजीकरण दिनांक:" : "Registration Date:"}{" "}
                  {selectedFarmer.created_at ? new Date(selectedFarmer.created_at).toLocaleString() : "—"}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFarmer(null)}
              >
                {lang === "hi" ? "बंद करें" : "Close"}
              </Button>

              <div className="flex items-center gap-2">
                {selectedFarmer.status !== "active" ? (
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={actionLoading}
                    onClick={() => updateStatus(selectedFarmer.id, "active")}
                  >
                    <CheckCircle2 className="size-4" />
                    <span>{lang === "hi" ? "खाता स्वीकृत करें" : "Approve Account"}</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionLoading}
                    onClick={() => updateStatus(selectedFarmer.id, "suspended")}
                    className="border-rose-300 text-rose-700 hover:bg-rose-50"
                  >
                    <Ban className="size-4" />
                    <span>{lang === "hi" ? "खाता निलंबित करें" : "Suspend Account"}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
