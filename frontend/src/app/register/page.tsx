"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Building2,
  Compass,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

const API_BASE = "/api/v1";

// Fallback UP Divisions if backend fetch is offline
const FALLBACK_DIVISIONS = [
  { id: "ayodhya", name_hi: "अयोध्या मण्डल", name_en: "Ayodhya Division" },
  { id: "devipatan", name_hi: "देवीपाटन मण्डल", name_en: "Devipatan Division" },
  { id: "lucknow", name_hi: "लखनऊ मण्डल", name_en: "Lucknow Division" },
  { id: "varanasi", name_hi: "वाराणसी मण्डल", name_en: "Varanasi Division" },
  { id: "gorakhpur", name_hi: "गोरखपुर मण्डल", name_en: "Gorakhpur Division" },
  { id: "prayagraj", name_hi: "प्रयागराज मण्डल", name_en: "Prayagraj Division" },
  { id: "kanpur", name_hi: "कानपुर मण्डल", name_en: "Kanpur Division" },
  { id: "bareilly", name_hi: "बरेली मण्डल", name_en: "Bareilly Division" },
  { id: "moradabad", name_hi: "मुरादाबाद मण्डल", name_en: "Moradabad Division" },
  { id: "meerut", name_hi: "मेरठ मण्डल", name_en: "Meerut Division" },
  { id: "aligarh", name_hi: "अलीगढ़ मण्डल", name_en: "Aligarh Division" },
  { id: "agra", name_hi: "आगरा मण्डल", name_en: "Agra Division" },
  { id: "saharanpur", name_hi: "सहारनपुर मण्डल", name_en: "Saharanpur Division" },
  { id: "azangarh", name_hi: "आजमगढ़ मण्डल", name_en: "Azamgarh Division" },
  { id: "basti", name_hi: "बस्ती मण्डल", name_en: "Basti Division" },
  { id: "chitrakoot", name_hi: "चित्रकूट मण्डल", name_en: "Chitrakoot Division" },
  { id: "jhansi", name_hi: "झांसी मण्डल", name_en: "Jhansi Division" },
  { id: "mirzapur", name_hi: "मिर्जापुर मण्डल", name_en: "Mirzapur Division" },
];

// Fallback key UP districts
const FALLBACK_DISTRICTS = [
  { code: "AYO", name_hi: "अयोध्या", name_en: "Ayodhya", division: "अयोध्या मण्डल" },
  { code: "AMB", name_hi: "अम्बेडकर नगर", name_en: "Ambedkar Nagar", division: "अयोध्या मण्डल" },
  { code: "BAR", name_hi: "बाराबंकी", name_en: "Barabanki", division: "अयोध्या मण्डल" },
  { code: "SUL", name_hi: "सुल्तानपुर", name_en: "Sultanpur", division: "अयोध्या मण्डल" },
  { code: "AME", name_hi: "अमेठी", name_en: "Amethi", division: "अयोध्या मण्डल" },
  { code: "LKO", name_hi: "लखनऊ", name_en: "Lucknow", division: "लखनऊ मण्डल" },
  { code: "RAE", name_hi: "रायबरेली", name_en: "Rae Bareli", division: "लखनऊ मण्डल" },
  { code: "SIT", name_hi: "सीतापुर", name_en: "Sitapur", division: "लखनऊ मण्डल" },
  { code: "HAR", name_hi: "हरदोई", name_en: "Hardoi", division: "लखनऊ मण्डल" },
  { code: "UNN", name_hi: "उन्नाव", name_en: "Unnao", division: "लखनऊ मण्डल" },
  { code: "VAR", name_hi: "वाराणसी", name_en: "Varanasi", division: "वाराणसी मण्डल" },
  { code: "GKP", name_hi: "गोरखपुर", name_en: "Gorakhpur", division: "गोरखपुर मण्डल" },
  { code: "PRY", name_hi: "प्रयागराज", name_en: "Prayagraj", division: "प्रयागराज मण्डल" },
  { code: "KNP", name_hi: "कानपुर नगर", name_en: "Kanpur Nagar", division: "कानपुर मण्डल" },
];

/**
 * Dropdown + Manual Typing Combobox Component
 * Allows user to choose from list, filter as they type, OR enter custom text directly.
 */
interface ComboboxProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: (string | { id?: string; code?: string; name_hi: string; name_en?: string })[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

function ComboboxSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
  loading,
  icon,
}: ComboboxProps) {
  const { lang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal search with outside value changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on typed search
  const filtered = options.filter((opt) => {
    const text = typeof opt === "string" ? opt : `${opt.name_hi} ${opt.name_en || ""}`;
    return text.toLowerCase().includes((searchTerm || "").toLowerCase());
  });

  const handleSelect = (selectedText: string) => {
    onChange(selectedText);
    setSearchTerm(selectedText);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setSearchTerm(newVal);
    onChange(newVal); // Enables free typing!
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs font-bold text-[#14532d] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-2.5 text-[#9ca3af] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type="text"
          disabled={disabled}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => !disabled && setIsOpen(true)}
          placeholder={loading ? (lang === "hi" ? "खोजा जा रहा है..." : "Loading...") : placeholder || (lang === "hi" ? "चुनें अथवा टाइप करें" : "Select or type")}
          className={`w-full py-2 border rounded-lg text-xs sm:text-sm outline-none transition-all ${icon ? "pl-9 pr-8" : "pl-3 pr-8"
            } ${disabled
              ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-white border-[#d1d5db] text-[#1f2937] focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d]"
            }`}
        />

        <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
          {searchTerm && !disabled && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setSearchTerm("");
              }}
              className="text-[#9ca3af] hover:text-[#4b5563] cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className="text-[#9ca3af] hover:text-[#15803d] cursor-pointer"
          >
            <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Floating Options Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-[#d1d5db] rounded-xl shadow-xl py-1 text-xs sm:text-sm">
          {loading && (
            <div className="p-3 text-center text-[#6b7280] text-xs animate-pulse">
              {lang === "hi" ? "विकल्प लोड हो रहे हैं..." : "Loading options..."}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <>
              {filtered.map((opt, idx) => {
                const optText = typeof opt === "string" ? opt : (lang === "hi" ? opt.name_hi : (opt.name_en || opt.name_hi));
                const isSelected = optText === value || (typeof opt !== "string" && (opt.name_hi === value || opt.name_en === value));
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(optText)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${isSelected ? "bg-[#dcfce7] text-[#14532d] font-bold" : "hover:bg-[#f8faf5] text-[#374151]"
                      }`}
                  >
                    <span>
                      {optText}
                    </span>
                    {isSelected && <CheckCircle2 className="size-3.5 text-[#15803d]" />}
                  </button>
                );
              })}
            </>
          )}

          {/* Fallback Option: Free Typing Notice */}
          {!loading && searchTerm.trim() && (
            <div className="border-t border-[#e5e7eb] p-2 bg-[#f8faf5]">
              <button
                type="button"
                onClick={() => handleSelect(searchTerm.trim())}
                className="w-full text-left px-2 py-1.5 rounded-lg bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#14532d] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="size-3 text-[#15803d]" />
                <span>
                  {lang === "hi"
                    ? `सूची में नहीं है? "${searchTerm.trim()}" का उपयोग करें`
                    : `Not in list? Use "${searchTerm.trim()}"`}
                </span>
              </button>
            </div>
          )}

          {!loading && filtered.length === 0 && !searchTerm.trim() && (
            <div className="p-3 text-center text-[#6b7280] text-xs">
              {lang === "hi" ? "कोई विकल्प उपलब्ध नहीं है" : "No options available"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const { lang } = useI18n();
  const { login } = useAuth();
  const router = useRouter();

  // Location Hierarchy States
  const [divisions, setDivisions] = useState<any[]>(FALLBACK_DIVISIONS);
  const [districts, setDistricts] = useState<any[]>(FALLBACK_DISTRICTS);
  const [tehsils, setTehsils] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  const [postOffices, setPostOffices] = useState<string[]>([]);

  // Loading States
  const [loadingDivs, setLoadingDivs] = useState(false);
  const [loadingDists, setLoadingDists] = useState(false);
  const [loadingTehsils, setLoadingTehsils] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);
  const [loadingPin, setLoadingPin] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state] = useState("Uttar Pradesh");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTehsil, setSelectedTehsil] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedPostOffice, setSelectedPostOffice] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationSource, setLocationSource] = useState("manual");

  // Email OTP Verification States (Mandatory Step 1)
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Submission & Feedback States
  const [submitting, setSubmitting] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // 1. Load Initial Divisions & Districts on Mount
  useEffect(() => {
    async function loadInitial() {
      setLoadingDivs(true);
      try {
        const [divRes, distRes] = await Promise.all([
          fetch(`${API_BASE}/locations/divisions`),
          fetch(`${API_BASE}/locations/districts`),
        ]);
        if (divRes.ok) {
          const divData = await divRes.json();
          if (Array.isArray(divData) && divData.length > 0) setDivisions(divData);
        }
        if (distRes.ok) {
          const distData = await distRes.json();
          if (Array.isArray(distData) && distData.length > 0) setDistricts(distData);
        }
      } catch (e) {
        console.warn("Initial location fetch fallback to static lists:", e);
      } finally {
        setLoadingDivs(false);
      }
    }
    loadInitial();
  }, []);

  // 2. Division Change -> Filter Districts & Reset Child Fields
  const handleDivisionChange = async (divName: string) => {
    setSelectedDivision(divName);
    setSelectedDistrict("");
    setSelectedTehsil("");
    setSelectedBlock("");
    setSelectedVillage("");
    setSelectedPostOffice("");
    setPincode("");
    setTehsils([]);
    setBlocks([]);
    setVillages([]);

    if (!divName) {
      setLoadingDists(true);
      try {
        const res = await fetch(`${API_BASE}/locations/districts`);
        if (res.ok) setDistricts(await res.json());
      } catch (e) {
        setDistricts(FALLBACK_DISTRICTS);
      } finally {
        setLoadingDists(false);
      }
      return;
    }

    setLoadingDists(true);
    try {
      const res = await fetch(`${API_BASE}/locations/districts?division=${encodeURIComponent(divName)}`);
      if (res.ok) {
        const data = await res.json();
        setDistricts(data);
      }
    } catch (e) {
      console.warn("District fetch error:", e);
    } finally {
      setLoadingDists(false);
    }
  };

  // 3. District Change -> Fetch Tehsils & Reset Child Fields
  const handleDistrictChange = async (distName: string) => {
    setSelectedDistrict(distName);
    setSelectedTehsil("");
    setSelectedBlock("");
    setSelectedVillage("");
    setSelectedPostOffice("");
    setPincode("");
    setBlocks([]);
    setVillages([]);

    if (!distName) {
      setTehsils([]);
      return;
    }

    setLoadingTehsils(true);
    try {
      const res = await fetch(`${API_BASE}/locations/tehsils?district=${encodeURIComponent(distName)}`);
      if (res.ok) {
        const data = await res.json();
        setTehsils(data);
      }
    } catch (e) {
      console.warn("Tehsil fetch error:", e);
    } finally {
      setLoadingTehsils(false);
    }
  };

  // 4. Tehsil Change -> Fetch Blocks & Reset Child Fields
  const handleTehsilChange = async (tehsilName: string) => {
    setSelectedTehsil(tehsilName);
    setSelectedBlock("");
    setSelectedVillage("");
    setSelectedPostOffice("");
    setVillages([]);

    if (!tehsilName || !selectedDistrict) {
      setBlocks([]);
      return;
    }

    setLoadingBlocks(true);
    try {
      const res = await fetch(
        `${API_BASE}/locations/blocks?district=${encodeURIComponent(selectedDistrict)}&tehsil=${encodeURIComponent(tehsilName)}`
      );
      if (res.ok) {
        const data = await res.json();
        setBlocks(data);
      }
    } catch (e) {
      console.warn("Block fetch error:", e);
    } finally {
      setLoadingBlocks(false);
    }
  };

  // 5. Block Change -> Fetch Villages
  const handleBlockChange = async (blockName: string) => {
    setSelectedBlock(blockName);
    setSelectedVillage("");

    if (!blockName || !selectedDistrict) {
      setVillages([]);
      return;
    }

    setLoadingVillages(true);
    try {
      const res = await fetch(
        `${API_BASE}/locations/villages?district=${encodeURIComponent(selectedDistrict)}&block=${encodeURIComponent(blockName)}`
      );
      if (res.ok) {
        const data = await res.json();
        setVillages(data);
      }
    } catch (e) {
      console.warn("Village fetch error:", e);
    } finally {
      setLoadingVillages(false);
    }
  };

  // 6. PIN Code Input Handler -> Validate & Auto-lookup Post Offices
  const handlePincodeChange = async (pinInput: string) => {
    const cleanPin = pinInput.replace(/\D/g, "").slice(0, 6);
    setPincode(cleanPin);

    if (cleanPin.length === 6) {
      setLoadingPin(true);
      try {
        const res = await fetch(`${API_BASE}/locations/pincode/${cleanPin}`);
        if (res.ok) {
          const data = await res.json();
          if (data.post_offices && data.post_offices.length > 0) {
            setPostOffices(data.post_offices);
            setSelectedPostOffice(data.post_offices[0]);
          }
          if (data.district && !selectedDistrict) {
            handleDistrictChange(data.district);
          }
          if (data.tehsil && !selectedTehsil) {
            setSelectedTehsil(data.tehsil);
          }
          if (data.block && !selectedBlock) {
            setSelectedBlock(data.block);
          }
        }
      } catch (e) {
        console.warn("PIN code lookup error:", e);
      } finally {
        setLoadingPin(false);
      }
    } else {
      setPostOffices([]);
      setSelectedPostOffice("");
    }
  };

  // 7. GPS Geolocation Handler -> Reverse Geocode in 1 Click
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === "hi" ? "आपके डिवाइस में जीपीएस लोकेशन उपलब्ध नहीं है।" : "Geolocation is not supported on this device.");
      return;
    }

    setGeoLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setLocationSource("gps");

        try {
          const res = await fetch(`${API_BASE}/locations/reverse-geocode`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude: lat, longitude: lng }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.division) setSelectedDivision(data.division);
            if (data.district) {
              setSelectedDistrict(data.district);
              const tRes = await fetch(`${API_BASE}/locations/tehsils?district=${encodeURIComponent(data.district)}`);
              if (tRes.ok) setTehsils(await tRes.json());
            }
            if (data.tehsil) setSelectedTehsil(data.tehsil);
            if (data.block) {
              setSelectedBlock(data.block);
              const vRes = await fetch(
                `${API_BASE}/locations/villages?district=${encodeURIComponent(data.district)}&block=${encodeURIComponent(data.block)}`
              );
              if (vRes.ok) setVillages(await vRes.json());
            }
            if (data.village) setSelectedVillage(data.village);
            if (data.pincode) {
              setPincode(data.pincode);
              handlePincodeChange(data.pincode);
            }
            if (data.post_office) setSelectedPostOffice(data.post_office);
          }
        } catch (e) {
          console.warn("Reverse geocode error:", e);
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        setGeoLoading(false);
        setError("जीपीएस लोकेशन अनुमति अस्वीकृत हुई। कृपया सूची से जनपद व पिन कोड चुनें।");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Cooldown timer utility
  const startCooldown = (secs: number = 45) => {
    setResendCooldown(secs);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 8. SEND EMAIL OTP
  const handleSendEmailOtp = async () => {
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError(lang === "hi" ? "कृपया एक मान्य ईमेल पता दर्ज करें।" : "Please enter a valid email address.");
      return;
    }

    setSendingOtp(true);
    try {
      const res = await fetch(`${API_BASE}/auth/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, full_name: fullName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "OTP भेजने में त्रुटि आई।");
      }

      setOtpSent(true);
      if (data.dev_otp && data.dev_otp.length === 6) {
        setOtpDigits(data.dev_otp.split(""));
      }
      setSuccessMessage(
        lang === "hi"
          ? `सत्यापन कोड ${data.dev_otp ? `(OTP: ${data.dev_otp}) ` : ""}${cleanEmail} पर प्रेषित किया गया है। कृपया अपना इनबॉक्स या स्पैम फोल्डर देखें।`
          : `Verification code ${data.dev_otp ? `(OTP: ${data.dev_otp}) ` : ""}sent to ${cleanEmail}. Please check your inbox or spam folder.`
      );
      startCooldown(data.cooldown_seconds || 45);
      // Focus first OTP box
      setTimeout(() => otpRefs.current[0]?.focus(), 150);
    } catch (err: any) {
      setError(err.message || "OTP भेजने में विफल रहा।");
    } finally {
      setSendingOtp(false);
    }
  };

  // 9. OTP Box input handlers
  const handleOtpBoxChange = (index: number, val: string) => {
    const digit = val.slice(-1).replace(/\D/g, "");
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pasted.length && i < 6; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);
    const nextIdx = Math.min(pasted.length, 5);
    otpRefs.current[nextIdx]?.focus();
  };

  // 10. VERIFY EMAIL OTP
  const handleVerifyEmailOtp = async () => {
    setError(null);
    setSuccessMessage(null);

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setError(lang === "hi" ? "कृपया 6-अंकीय OTP कोड दर्ज करें।" : "Please enter the complete 6-digit OTP code.");
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: fullOtp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "अमान्य अथवा समाप्त हुआ OTP।");
      }

      setIsEmailVerified(true);
      setVerificationToken(data.verification_token);
      setOtpSent(false);
      setSuccessMessage(
        lang === "hi"
          ? "✓ ईमेल सफलतापूर्वक सत्यापित हुआ! अब नीचे अपना विवरण भरें।"
          : "✓ Email verified successfully! Now complete your details below."
      );
    } catch (err: any) {
      setError(err.message || "OTP सत्यापन विफल रहा।");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // 11. SUBMIT REGISTRATION (Step 2)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!isEmailVerified) {
      setError(
        lang === "hi"
          ? "कृपया पहले 'Verify Email' पर क्लिक कर अपना ईमेल सत्यापित करें।"
          : "Please verify your email address via OTP before submitting registration."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(lang === "hi" ? "पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।" : "Passwords do not match.");
      return;
    }

    if (!selectedDistrict) {
      setError(lang === "hi" ? "कृपया अपना जनपद चुनें अथवा दर्ज करें।" : "Please select or enter your district.");
      return;
    }

    if (pincode.length !== 6) {
      setError(lang === "hi" ? "कृपया 6-अंकीय वैध पिन कोड दर्ज करें।" : "Please enter a valid 6-digit PIN code.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          state: "Uttar Pradesh",
          division: selectedDivision || "अयोध्या मण्डल",
          district: selectedDistrict,
          tehsil: selectedTehsil || "सदर",
          block: selectedBlock || "सदर ब्लॉक",
          village: selectedVillage || "ग्राम",
          post_office: selectedPostOffice || "मुख्य डाकघर",
          pincode: pincode.trim(),
          password: password,
          confirm_password: confirmPassword,
          verification_token: verificationToken,
          latitude: latitude,
          longitude: longitude,
          location_source: locationSource,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "पंजीकरण विफल रहा।");
      }

      setRegistrationComplete(true);
      // Auto login user in AuthContext
      if (data.access_token && data.user) {
        login(data.access_token, data.user);
      }

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "पंजीकरण में त्रुटि आई।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: lang === "hi" ? "किसान नया पंजीकरण" : "Farmer Registration" }]} />

      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-10 shadow-xs my-6">
        {/* Registration Header */}
        <div className="text-center mb-8 pb-6 border-b border-[#f3f4f6]">
          <div className="size-16 bg-[#dcfce7] text-[#14532d] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <ShieldCheck className="size-9 text-[#15803d]" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#15803d] bg-[#dcfce7] px-3 py-1 rounded-full border border-[#86efac]">
            {lang === "hi"
              ? "अवध किसान सेवा • आधिकारिक डिजिटल पंजीकरण"
              : "Awadh Kisan Seva • Official Digital Registration"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14532d] mt-2">
            {lang === "hi" ? "किसान नया पंजीकरण" : "New Farmer Registration"}
          </h1>
          <p className="text-xs sm:text-sm text-[#6b7280] mt-1 max-w-lg mx-auto">
            {lang === "hi"
              ? "उत्तर प्रदेश के किसानों हेतु निःशुल्क, सुरक्षित एवं प्रामाणिक डिजिटल कृषि सेवा खाता"
              : "Free, secure, and verified digital farmer service account for farmers of Uttar Pradesh"}
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-600" />
            <div>
              <p className="font-bold">{lang === "hi" ? "त्रुटि:" : "Error:"}</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Global Success Banner */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5">
            <CheckCircle2 className="size-5 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-bold">{lang === "hi" ? "सत्यापन सूचना:" : "Notice:"}</p>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {/* Registration Success Screen */}
        {registrationComplete ? (
          <div className="text-center py-10 space-y-4">
            <div className="size-20 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="size-12 text-[#15803d]" />
            </div>
            <h2 className="text-2xl font-black text-[#14532d]">
              {lang === "hi" ? "पंजीकरण सफलतापूर्वक पूर्ण हुआ!" : "Registration Completed Successfully!"}
            </h2>
            <p className="text-sm text-[#4b5563] max-w-md mx-auto">
              {lang === "hi"
                ? `स्वागत है ${fullName}! आपका अवध किसान सेवा खाता सक्रिय हो चुका है। किसान डैशबोर्ड लोड हो रहा है...`
                : `Welcome ${fullName}! Your Awadh Kisan Seva account is now active. Loading dashboard...`}
            </p>
            <div className="pt-4">
              <Button onClick={() => router.push("/dashboard")} variant="primary" size="lg">
                <span>{lang === "hi" ? "किसान डैशबोर्ड पर जाएँ" : "Go to Farmer Dashboard"}</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* STEP 1: MANDATORY EMAIL OTP VERIFICATION */}
            <div className="bg-[#f8faf5] border-2 border-[#15803d]/30 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-7 bg-[#15803d] text-white rounded-full flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#14532d]">
                      {lang === "hi"
                        ? "ईमेल पता एवं अनिवार्य OTP सत्यापन"
                        : "Email Address & Mandatory OTP Verification"}
                    </h3>
                    <p className="text-[11px] text-[#6b7280]">
                      {lang === "hi"
                        ? "पंजीकरण से पूर्व ईमेल पर 6-अंकीय OTP भेजकर सत्यापित करना अनिवार्य है"
                        : "Mandatory verification via 6-digit OTP sent to your email before registration"}
                    </p>
                  </div>
                </div>

                {isEmailVerified && (
                  <span className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#15803d] text-xs font-bold px-3 py-1 rounded-full border border-[#86efac]">
                    <CheckCircle2 className="size-3.5" />
                    {lang === "hi" ? "ईमेल सत्यापित" : "Email Verified"}
                  </span>
                )}
              </div>

              {/* Email Input + Verify Email Button */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-[#14532d] mb-1">
                    {lang === "hi" ? "ईमेल पता *" : "Email Address *"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 size-4 text-[#9ca3af]" />
                    <input
                      type="email"
                      required
                      disabled={isEmailVerified || sendingOtp}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kisan@example.com"
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-xs sm:text-sm outline-none transition-all ${isEmailVerified
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold cursor-not-allowed"
                          : "bg-white border-[#d1d5db] focus:border-[#15803d]"
                        }`}
                    />
                  </div>
                </div>

                {!isEmailVerified && (
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={sendingOtp || resendCooldown > 0 || !email.includes("@")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#15803d] hover:bg-[#14532d] disabled:bg-gray-300 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-all cursor-pointer shadow-xs whitespace-nowrap h-[38px]"
                  >
                    {sendingOtp ? (
                      <RefreshCw className="size-4 animate-spin" />
                    ) : (
                      <Mail className="size-4" />
                    )}
                    <span>
                      {sendingOtp
                        ? (lang === "hi" ? "OTP भेजा जा रहा है..." : "Sending OTP...")
                        : resendCooldown > 0
                          ? (lang === "hi" ? `पुनः भेजें (${resendCooldown}s)` : `Resend (${resendCooldown}s)`)
                          : otpSent
                            ? (lang === "hi" ? "पुनः OTP भेजें" : "Resend OTP")
                            : (lang === "hi" ? "OTP भेजें" : "Verify Email (Send OTP)")}
                    </span>
                  </button>
                )}
              </div>

              {/* 6-Box OTP Input Section */}
              {otpSent && !isEmailVerified && (
                <div className="pt-3 border-t border-[#e5e7eb] space-y-3">
                  <div className="text-center sm:text-left">
                    <label className="block text-xs font-bold text-[#14532d] mb-1">
                      {lang === "hi"
                        ? "ईमेल पर प्राप्त 6-अंकीय OTP कोड यहाँ दर्ज करें *"
                        : "Enter 6-digit OTP code received on email *"}
                    </label>
                    <p className="text-[11px] text-[#6b7280]">
                      {lang === "hi"
                        ? "6 अंकों का कोड दर्ज करें अथवा सीधे पेस्ट करें"
                        : "Enter 6-digit code or paste directly"}
                    </p>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        className="size-11 sm:size-12 text-center text-lg sm:text-xl font-black font-mono border-2 border-[#d1d5db] focus:border-[#15803d] focus:ring-2 focus:ring-[#86efac] rounded-xl outline-none bg-white transition-all shadow-xs"
                      />
                    ))}

                    <Button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      disabled={verifyingOtp || otpDigits.join("").length !== 6}
                      variant="primary"
                      size="md"
                      className="ml-2 shadow-xs"
                    >
                      {verifyingOtp
                        ? (lang === "hi" ? "सत्यापित हो रहा है..." : "Verifying...")
                        : (lang === "hi" ? "OTP सत्यापित करें" : "Verify OTP")}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 2: PERSONAL & LOCATION DETAILS (Unlocked only when email verified) */}
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div
                className={`transition-all ${!isEmailVerified ? "opacity-40 pointer-events-none select-none blur-[1px]" : "opacity-100"
                  }`}
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5e7eb]">
                  <div className="flex items-center gap-2">
                    <div className="size-7 bg-[#15803d] text-white rounded-full flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-[#14532d]">
                        {lang === "hi" ? "व्यक्तिगत विवरण एवं पासवर्ड" : "Personal Details & Password"}
                      </h3>
                      <p className="text-[11px] text-[#6b7280]">
                        {lang === "hi"
                          ? "अपना पूरा नाम, मोबाइल नंबर एवं सुरक्षित पासवर्ड बनाएं"
                          : "Enter your full name, mobile number, and secure password"}
                      </p>
                    </div>
                  </div>

                  {/* GPS One-Click Location Helper */}
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={geoLoading || !isEmailVerified}
                    className="inline-flex items-center gap-1.5 bg-[#dcfce7] border border-[#86efac] text-[#14532d] hover:bg-[#bbf7d0] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    <Navigation className={`size-3.5 ${geoLoading ? "animate-spin text-[#15803d]" : "text-[#15803d]"}`} />
                    <span>
                      {geoLoading
                        ? (lang === "hi" ? "GPS खोज रहा है..." : "Locating GPS...")
                        : (lang === "hi" ? "📍 GPS से पता भरें" : "📍 Auto-fill Address with GPS")}
                    </span>
                  </button>
                </div>

                {/* Personal Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-[#14532d] mb-1">
                      {lang === "hi" ? "पूरा नाम *" : "Full Name *"}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 size-4 text-[#9ca3af]" />
                      <input
                        type="text"
                        required
                        disabled={!isEmailVerified}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={lang === "hi" ? "उदा. रामेश्वर प्रताप सिंह" : "e.g. Rameshwar Pratap Singh"}
                        className="w-full pl-9 pr-3 py-2 border border-[#d1d5db] rounded-lg text-xs sm:text-sm outline-none focus:border-[#15803d]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#14532d] mb-1">
                      {lang === "hi" ? "10-अंकीय मोबाइल नंबर *" : "10-Digit Mobile Number *"}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 size-4 text-[#9ca3af]" />
                      <input
                        type="tel"
                        required
                        disabled={!isEmailVerified}
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder={lang === "hi" ? "उदा. 9876543210" : "e.g. 9876543210"}
                        className="w-full pl-9 pr-3 py-2 border border-[#d1d5db] rounded-lg text-xs sm:text-sm outline-none focus:border-[#15803d] font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-[#14532d] mb-1">
                      {lang === "hi" ? "सुरक्षित पासवर्ड *" : "Password *"}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 size-4 text-[#9ca3af]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        disabled={!isEmailVerified}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={lang === "hi" ? "कम से कम 6 अक्षर" : "Minimum 6 characters"}
                        className="w-full pl-9 pr-9 py-2 border border-[#d1d5db] rounded-lg text-xs sm:text-sm outline-none focus:border-[#15803d]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-[#9ca3af] hover:text-[#4b5563]"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#14532d] mb-1">
                      {lang === "hi" ? "पासवर्ड की पुष्टि करें *" : "Confirm Password *"}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 size-4 text-[#9ca3af]" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={6}
                        disabled={!isEmailVerified}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={lang === "hi" ? "पासवर्ड पुनः दर्ज करें" : "Re-enter password"}
                        className="w-full pl-9 pr-9 py-2 border border-[#d1d5db] rounded-lg text-xs sm:text-sm outline-none focus:border-[#15803d]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-[#9ca3af] hover:text-[#4b5563]"
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-[10px] text-red-600 mt-1">
                        {lang === "hi" ? "पासवर्ड मेल नहीं खा रहे हैं" : "Passwords do not match"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location & Administrative Hierarchy (Dropdown + Manual Typing Comboboxes) */}
                <div className="bg-[#f8faf5] p-5 sm:p-6 rounded-2xl border border-[#e5e7eb] space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#e5e7eb]">
                    <Compass className="size-4 text-[#15803d]" />
                    <h4 className="font-bold text-xs sm:text-sm text-[#14532d] uppercase tracking-wider">
                      {lang === "hi" ? "भौगोलिक एवं प्रशासनिक पता" : "Geographic & Administrative Address"}
                    </h4>
                  </div>

                  {/* Row 1: State & Division */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#14532d] mb-1">
                        {lang === "hi" ? "राज्य" : "State"}
                      </label>
                      <input
                        type="text"
                        disabled
                        value={lang === "hi" ? "उत्तर प्रदेश" : "Uttar Pradesh"}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 font-semibold cursor-not-allowed"
                      />
                    </div>

                    <ComboboxSelect
                      label={lang === "hi" ? "मण्डल" : "Division"}
                      value={selectedDivision}
                      onChange={handleDivisionChange}
                      options={divisions}
                      placeholder={lang === "hi" ? "मण्डल चुनें अथवा टाइप करें" : "Select or type division"}
                      loading={loadingDivs}
                      disabled={!isEmailVerified}
                      icon={<Building2 className="size-4" />}
                    />
                  </div>

                  {/* Row 2: District & Tehsil */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ComboboxSelect
                      label={lang === "hi" ? "जनपद" : "District"}
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      options={districts}
                      placeholder={lang === "hi" ? "जनपद चुनें अथवा लिखें (उदा. अयोध्या)" : "Select or type district (e.g. Ayodhya)"}
                      required
                      loading={loadingDists}
                      disabled={!isEmailVerified}
                      icon={<MapPin className="size-4" />}
                    />

                    <ComboboxSelect
                      label={lang === "hi" ? "तहसील" : "Tehsil"}
                      value={selectedTehsil}
                      onChange={handleTehsilChange}
                      options={tehsils}
                      placeholder={lang === "hi" ? "तहसील चुनें अथवा टाइप करें" : "Select or type tehsil"}
                      required
                      loading={loadingTehsils}
                      disabled={!isEmailVerified || !selectedDistrict}
                    />
                  </div>

                  {/* Row 3: Block & Village */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ComboboxSelect
                      label={lang === "hi" ? "विकास खंड" : "Block"}
                      value={selectedBlock}
                      onChange={handleBlockChange}
                      options={blocks}
                      placeholder={lang === "hi" ? "विकास खंड चुनें अथवा लिखें" : "Select or type block"}
                      required
                      loading={loadingBlocks}
                      disabled={!isEmailVerified || !selectedTehsil}
                    />

                    <ComboboxSelect
                      label={lang === "hi" ? "ग्राम / वार्ड" : "Village / Ward"}
                      value={selectedVillage}
                      onChange={setSelectedVillage}
                      options={villages}
                      placeholder={lang === "hi" ? "ग्राम का नाम चुनें अथवा लिखें" : "Select or type village"}
                      required
                      loading={loadingVillages}
                      disabled={!isEmailVerified || !selectedBlock}
                    />
                  </div>

                  {/* Row 4: PIN Code & Post Office */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#14532d] mb-1">
                        {lang === "hi" ? "6-अंकीय पिन कोड *" : "6-Digit PIN Code *"}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 size-4 text-[#9ca3af]" />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          disabled={!isEmailVerified}
                          value={pincode}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                          placeholder={lang === "hi" ? "उदा. 224001, 224188" : "e.g. 224001, 224188"}
                          className="w-full pl-9 pr-3 py-2 border border-[#d1d5db] rounded-lg text-xs sm:text-sm outline-none focus:border-[#15803d] font-mono font-bold"
                        />
                      </div>
                      {loadingPin && (
                        <span className="text-[10px] text-[#15803d] font-semibold animate-pulse block mt-0.5">
                          {lang === "hi" ? "डाकघर व ब्लॉक खोजा जा रहा है..." : "Fetching post office and block details..."}
                        </span>
                      )}
                    </div>

                    <ComboboxSelect
                      label={lang === "hi" ? "डाकघर" : "Post Office"}
                      value={selectedPostOffice}
                      onChange={setSelectedPostOffice}
                      options={postOffices}
                      placeholder={lang === "hi" ? "डाकघर चुनें अथवा लिखें" : "Select or type post office"}
                      required
                      disabled={!isEmailVerified}
                    />
                  </div>
                </div>

                {/* Final Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={submitting || !isEmailVerified}
                    className="shadow-md h-12 text-base font-bold"
                  >
                    <span>
                      {submitting
                        ? (lang === "hi" ? "पंजीकरण भेजा जा रहा है..." : "Submitting Registration...")
                        : (lang === "hi" ? "किसान पंजीकरण पूर्ण करें" : "Complete Registration")}
                    </span>
                    <ArrowRight className="size-5" />
                  </Button>
                </div>
              </div>
            </form>

            {/* Bottom Links */}
            <div className="text-center pt-4 border-t border-[#f3f4f6] text-xs text-[#6b7280]">
              {lang === "hi" ? "पहले से पंजीकृत हैं? " : "Already registered? "}
              <Link href="/login" className="text-[#15803d] font-bold hover:underline">
                {lang === "hi" ? "यहाँ लॉगिन करें" : "Sign In here"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
