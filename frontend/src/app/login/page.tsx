"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight, ShieldCheck, Sprout, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

const API_BASE = "/api/v1";

export default function LoginPage() {
  const { lang } = useI18n();
  const { login } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || (lang === "hi" ? "लॉगिन विफल रहा।" : "Login failed."));
      }

      // Store in AuthContext
      login(data.access_token, data.user);

      // Redirect to admin panel if user is admin, else farmer dashboard
      if (data.user?.role === "super_admin" || data.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "लॉगिन में त्रुटि आई।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: lang === "hi" ? "लॉगिन" : "Sign In" }]} />

      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8 shadow-xs my-6">
        <div className="text-center mb-6">
          <div className="size-14 bg-[#dcfce7] text-[#14532d] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Sprout className="size-8 text-[#15803d]" />
          </div>
          <h1 className="text-2xl font-black text-[#14532d]">
            {lang === "hi" ? "किसान एवं उपयोगकर्ता लॉगिन" : "Farmer & User Login"}
          </h1>
          <p className="text-xs text-[#6b7280] mt-1">
            {lang === "hi"
              ? "अवध किसान सेवा पोर्टल पर अपने खाते में प्रवेश करें"
              : "Sign in to your Awadh Kisan Seva portal account"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
            <div>
              <p className="font-bold">{lang === "hi" ? "लॉगिन त्रुटि:" : "Login Error:"}</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#14532d] mb-1">
              {lang === "hi" ? "मोबाइल नंबर अथवा ईमेल *" : "Mobile Number or Email *"}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 size-4 text-[#9ca3af]" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={lang === "hi" ? "10-अंकीय मोबाइल नंबर या ईमेल" : "10-digit mobile or email"}
                className="w-full pl-9 pr-3 py-2.5 border border-[#d1d5db] rounded-lg text-sm outline-none focus:border-[#15803d]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#14532d]">
                {lang === "hi" ? "पासवर्ड *" : "Password *"}
              </label>
              <Link href="/forgot-password" className="text-xs text-[#0284c7] hover:underline font-semibold">
                {lang === "hi" ? "पासवर्ड भूल गए?" : "Forgot password?"}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 size-4 text-[#9ca3af]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2.5 border border-[#d1d5db] rounded-lg text-sm outline-none focus:border-[#15803d]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#9ca3af] hover:text-[#4b5563]"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" fullWidth disabled={loading}>
            <span>
              {loading
                ? (lang === "hi" ? "सत्यापित हो रहा है..." : "Signing in...")
                : (lang === "hi" ? "लॉगिन करें" : "Sign In")}
            </span>
            <ArrowRight className="size-4" />
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#f3f4f6] text-center text-xs text-[#4b5563]">
          {lang === "hi" ? "नया खाता बनाना चाहते हैं? " : "Don't have an account? "}
          <Link href="/register" className="font-bold text-[#15803d] hover:underline">
            {lang === "hi" ? "यहाँ निःशुल्क पंजीकरण करें" : "Register here"}
          </Link>
        </div>
      </div>
    </div>
  );
}
