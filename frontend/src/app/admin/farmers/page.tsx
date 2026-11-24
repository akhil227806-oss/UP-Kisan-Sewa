"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Users, CheckCircle, XCircle, Search, ShieldCheck, MapPin, Phone, Mail, RefreshCw } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

interface FarmerRecord {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  district: string;
  tehsil?: string;
  village?: string;
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

  const effectiveToken = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || token || "";
    }
    return token || "";
  }, [token]);

  const loadFarmers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/users?limit=100", {
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
    setFarmers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
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
    }
  };

  const filtered = useMemo(() => {
    if (filter === "all") return farmers;
    if (filter === "pending") return farmers.filter((f) => f.status === "pending_verification" || !f.email_verified);
    if (filter === "active") return farmers.filter((f) => f.status === "active");
    return farmers;
  }, [farmers, filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: lang === "hi" ? "एडमिन" : "Admin", href: "/admin" },
          { label: lang === "hi" ? "किसान अनुमोदन" : "Farmer Approvals" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#14532d]">
            {lang === "hi" ? "किसान पंजीकरण समीक्षा एवं अनुमोदन" : "Farmer Registration Review & Approvals"}
          </h1>
          <p className="text-xs text-[#6b7280]">
            {lang === "hi"
              ? "सुरक्षित प्रमाणीकरण प्रणाली: केवल स्वीकृत किसान ही डैशबोर्ड एक्सेस कर सकते हैं"
              : "Review, approve, and manage registered farmers across Uttar Pradesh"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadFarmers} disabled={loading}>
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{lang === "hi" ? "रिफ्रेश" : "Refresh"}</span>
          </Button>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="py-1.5 px-3 border border-[#d1d5db] rounded-lg text-xs bg-white text-[#374151]"
          >
            <option value="all">{lang === "hi" ? "सभी किसान" : "All Farmers"}</option>
            <option value="pending">{lang === "hi" ? "लंबित अनुमोदन" : "Pending Review"}</option>
            <option value="active">{lang === "hi" ? "स्वीकृत / सक्रिय" : "Active"}</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#14532d] text-white">
              <th className="p-3.5">{lang === "hi" ? "किसान का नाम" : "Farmer Name"}</th>
              <th className="p-3.5">{lang === "hi" ? "मोबाइल व ईमेल" : "Mobile & Email"}</th>
              <th className="p-3.5">{lang === "hi" ? "जनपद / गाँव" : "District / Village"}</th>
              <th className="p-3.5">{lang === "hi" ? "ईमेल सत्यापन" : "Email Verification"}</th>
              <th className="p-3.5">{lang === "hi" ? "खाता स्थिति" : "Account Status"}</th>
              <th className="p-3.5 text-center">{lang === "hi" ? "कार्रवाई" : "Action"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {filtered.map((f) => (
              <tr key={f.id} className="hover:bg-[#f8faf5]">
                <td className="p-3.5">
                  <div className="font-bold text-[#14532d]">{f.full_name}</div>
                  <span className="text-[10px] text-[#6b7280]">ID: #{f.id.slice(0, 8)}</span>
                </td>
                <td className="p-3.5">
                  <div className="font-semibold text-[#374151]">{f.phone}</div>
                  <div className="text-xs text-[#6b7280]">{f.email}</div>
                </td>
                <td className="p-3.5">
                  <span className="font-semibold">{f.district}</span>
                  {f.village ? <span className="text-xs text-[#6b7280]"> ({f.village})</span> : ""}
                </td>
                <td className="p-3.5">
                  {f.email_verified ? (
                    <Badge variant="success" size="sm">{lang === "hi" ? "सत्यापित" : "Verified"}</Badge>
                  ) : (
                    <Badge variant="warning" size="sm">{lang === "hi" ? "लंबित" : "Pending"}</Badge>
                  )}
                </td>
                <td className="p-3.5">
                  <Badge variant={f.status === "active" ? "success" : "warning"} size="sm">
                    {f.status}
                  </Badge>
                </td>
                <td className="p-3.5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {f.status !== "active" ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => updateStatus(f.id, "active")}
                        className="text-xs py-1 px-2.5"
                      >
                        <CheckCircle className="size-3.5" />
                        <span>{lang === "hi" ? "अनुमोदित करें" : "Approve"}</span>
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => updateStatus(f.id, "inactive")}
                        className="text-xs py-1 px-2.5"
                      >
                        <XCircle className="size-3.5" />
                        <span>{lang === "hi" ? "अस्वीकृत" : "Reject"}</span>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs text-[#6b7280]">
            {lang === "hi" ? "कोई किसान रिकॉर्ड उपलब्ध नहीं है।" : "No farmer records found."}
          </div>
        )}
      </div>
    </div>
  );
}
