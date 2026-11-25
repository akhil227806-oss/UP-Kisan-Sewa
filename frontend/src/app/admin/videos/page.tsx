"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Video,
  PlusCircle,
  Search,
  Trash2,
  Edit,
  Play,
  X,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  Eye,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AdminNavBar } from "@/components/admin/AdminNavBar";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

interface AdminVideoItem {
  id: string;
  youtube_id: string;
  title: string;
  title_hi?: string;
  channel?: string;
  category: string;
  category_en?: string;
  duration?: string;
  source?: string;
  description?: string;
  description_en?: string;
  status?: string;
}

export default function AdminVideosPage() {
  const { lang } = useI18n();
  const { token } = useAuth();
  const [videos, setVideos] = useState<AdminVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<AdminVideoItem | null>(null);
  const [previewVideo, setPreviewVideo] = useState<AdminVideoItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form states
  const [formYoutubeId, setFormYoutubeId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formTitleHi, setFormTitleHi] = useState("");
  const [formCategory, setFormCategory] = useState("कृषि यंत्रीकरण");
  const [formCategoryEn, setFormCategoryEn] = useState("Farm Machinery");
  const [formDuration, setFormDuration] = useState("12:00");
  const [formChannel, setFormChannel] = useState("NDUAT Media Cell");
  const [formSource, setFormSource] = useState("MANAGE / TNAU / ICAR");
  const [formDesc, setFormDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const effectiveToken =
    token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("admin_token") || localStorage.getItem("uks_token") || ""
      : "");

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/videos", {
        headers: effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setVideos(data.items || []);
      } else {
        // Fallback to public endpoint
        const pubRes = await fetch("/api/v1/videos?limit=100");
        if (pubRes.ok) {
          const pubData = await pubRes.json();
          setVideos(pubData);
        }
      }
    } catch {
      // Fallback local storage
      const local = localStorage.getItem("admin_videos");
      if (local) {
        try {
          setVideos(JSON.parse(local));
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const openAddModal = () => {
    setEditingVideo(null);
    setFormYoutubeId("");
    setFormTitle("");
    setFormTitleHi("");
    setFormCategory("कृषि यंत्रीकरण");
    setFormCategoryEn("Farm Machinery");
    setFormDuration("12:00");
    setFormChannel("NDUAT Media Cell");
    setFormSource("MANAGE / TNAU / ICAR");
    setFormDesc("");
    setModalOpen(true);
  };

  const openEditModal = (v: AdminVideoItem) => {
    setEditingVideo(v);
    setFormYoutubeId(v.youtube_id);
    setFormTitle(v.title);
    setFormTitleHi(v.title_hi || v.title);
    setFormCategory(v.category);
    setFormCategoryEn(v.category_en || v.category);
    setFormDuration(v.duration || "10:00");
    setFormChannel(v.channel || "NDUAT Media Cell");
    setFormSource(v.source || "MANAGE / TNAU / ICAR");
    setFormDesc(v.description || "");
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formYoutubeId || !formTitle) return;
    setSubmitting(true);

    let cleanId = formYoutubeId.trim();
    if (cleanId.includes("v=")) cleanId = cleanId.split("v=")[1].split("&")[0];
    else if (cleanId.includes("youtu.be/")) cleanId = cleanId.split("youtu.be/")[1].split("?")[0];

    const payload = {
      youtube_id: cleanId,
      title: formTitle.trim(),
      title_hi: formTitleHi.trim() || formTitle.trim(),
      category: formCategory,
      category_en: formCategoryEn,
      duration: formDuration,
      channel: formChannel,
      source: formSource,
      description: formDesc.trim(),
      status: "published",
    };

    try {
      const url = editingVideo
        ? `/api/v1/admin/videos/${editingVideo.id}`
        : "/api/v1/admin/videos";
      const method = editingVideo ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setToastMsg(
          editingVideo
            ? (lang === "hi" ? "वीडियो सफलतापूर्वक अपडेट हुआ।" : "Video updated successfully.")
            : (lang === "hi" ? "नया वीडियो सफलतापूर्वक जोड़ा गया।" : "New video added successfully.")
        );
        setModalOpen(false);
        fetchVideos();
      } else {
        // Optimistic local update
        if (editingVideo) {
          setVideos((prev) =>
            prev.map((item) => (item.id === editingVideo.id ? { ...item, ...payload } : item))
          );
        } else {
          const newDoc: AdminVideoItem = { id: `vid-${Date.now()}`, ...payload };
          setVideos((prev) => [newDoc, ...prev]);
        }
        setModalOpen(false);
        setToastMsg(lang === "hi" ? "वीडियो स्थानीय रूप से सहेजा गया।" : "Video saved locally.");
      }
    } catch {
      setToastMsg(lang === "hi" ? "नेटवर्क त्रुटि — स्थानीय सहेजा गया।" : "Saved locally.");
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm(lang === "hi" ? "क्या आप इस वीडियो को हटाना चाहते हैं?" : "Are you sure you want to delete this video?")) {
      return;
    }

    try {
      await fetch(`/api/v1/admin/videos/${videoId}`, {
        method: "DELETE",
        headers: effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {},
      });
    } catch {}

    setVideos((prev) => prev.filter((v) => v.id !== videoId));
    setToastMsg(lang === "hi" ? "वीडियो हटा दिया गया।" : "Video deleted successfully.");
  };

  const categories = [
    { id: "all", label_hi: "सभी वीडियो", label_en: "All Categories" },
    { id: "कृषि यंत्रीकरण", label_hi: "कृषि यंत्रीकरण", label_en: "Farm Machinery" },
    { id: "फसल उत्पादन", label_hi: "फसल उत्पादन", label_en: "Crop Production" },
    { id: "कीट व रोग नियंत्रण", label_hi: "कीट व रोग नियंत्रण", label_en: "Pest Management" },
    { id: "मृदा स्वास्थ्य व व्याख्यान", label_hi: "मृदा स्वास्थ्य व व्याख्यान", label_en: "Soil Health & Lectures" },
  ];

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      const matchCat =
        categoryFilter === "all" ||
        v.category === categoryFilter ||
        (v.category_en && v.category_en.toLowerCase().includes(categoryFilter.toLowerCase()));
      const matchSearch =
        search === "" ||
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        (v.title_hi && v.title_hi.toLowerCase().includes(search.toLowerCase())) ||
        v.channel?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [videos, categoryFilter, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: lang === "hi" ? "एडमिन" : "Admin", href: "/admin" },
          { label: lang === "hi" ? "वीडियो प्रबंधन" : "Videos Management" },
        ]}
      />

      {/* Admin Sub Navigation */}
      <AdminNavBar />

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#14532d]">
            {lang === "hi" ? "कृषि प्रशिक्षण वीडियो प्रबंधन (40 आधिकारिक वीडियो)" : "Agriculture Video Library Management"}
          </h1>
          <p className="text-xs text-[#6b7280]">
            {lang === "hi"
              ? "MANAGE, TNAU, ICAR-ATARI एवं भारत स्किल्स के 40 आधिकारिक वीडियो का प्रबंधन, संपादन एवं नया जोड़ना"
              : "Complete control to add, edit, preview, and organize official training video lectures"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchVideos} disabled={loading}>
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{lang === "hi" ? "रिफ्रेश" : "Refresh"}</span>
          </Button>

          <Button variant="primary" size="sm" onClick={openAddModal}>
            <PlusCircle className="size-4" />
            <span>{lang === "hi" ? "नया वीडियो जोड़ें" : "Add New Video"}</span>
          </Button>
        </div>
      </div>

      {/* Toast Notice */}
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle className="size-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="size-4 text-[#9ca3af] absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "hi" ? "शीर्षक या चैनल खोजें..." : "Search title or channel..."}
            className="w-full pl-9 pr-3 py-2 border border-[#d1d5db] rounded-lg text-xs outline-none focus:border-[#15803d]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === c.id
                  ? "bg-[#14532d] text-white font-bold"
                  : "bg-gray-100 text-[#4b5563] hover:bg-gray-200"
              }`}
            >
              {lang === "hi" ? c.label_hi : c.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Videos */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#14532d] text-white">
                <th className="p-3.5">{lang === "hi" ? "थंबनेल व शीर्षक" : "Thumbnail & Title"}</th>
                <th className="p-3.5">{lang === "hi" ? "श्रेणी" : "Category"}</th>
                <th className="p-3.5">{lang === "hi" ? "अवधि" : "Duration"}</th>
                <th className="p-3.5">{lang === "hi" ? "स्रोत / चैनल" : "Source / Channel"}</th>
                <th className="p-3.5 text-right">{lang === "hi" ? "कार्रवाई" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-[#f8faf5]">
                  <td className="p-3.5 max-w-xs">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => setPreviewVideo(v)}
                        className="relative size-16 sm:size-20 bg-black rounded-lg overflow-hidden shrink-0 cursor-pointer group"
                      >
                        <img
                          src={`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`}
                          alt={v.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="size-5 text-white fill-current" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#14532d] line-clamp-1">{v.title}</h4>
                        {v.title_hi && <p className="text-xs text-[#4b5563] line-clamp-1">{v.title_hi}</p>}
                        <span className="text-[10px] text-[#6b7280] font-mono">ID: {v.youtube_id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="success" size="sm">
                      {lang === "hi" ? v.category : v.category_en || v.category}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-mono font-semibold text-xs text-[#374151]">
                    {v.duration || "10:00"}
                  </td>
                  <td className="p-3.5 text-xs text-[#6b7280]">
                    <span className="font-semibold text-[#14532d] block">{v.channel}</span>
                    <span className="text-[11px] text-[#15803d]">{v.source}</span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewVideo(v)}
                        title="Preview"
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(v)}
                        title="Edit"
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        title="Delete"
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Video Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e5e7eb] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] mb-4">
              <h3 className="font-black text-lg text-[#14532d]">
                {editingVideo
                  ? (lang === "hi" ? "वीडियो विवरण संपादित करें" : "Edit Training Video")
                  : (lang === "hi" ? "नया प्रशिक्षण वीडियो जोड़ें" : "Add Training Video")}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#14532d] mb-1">
                  YouTube Video ID या URL *
                </label>
                <input
                  type="text"
                  required
                  value={formYoutubeId}
                  onChange={(e) => setFormYoutubeId(e.target.value)}
                  placeholder="उदा. 4EHjHcyB9yY अथवा https://www.youtube.com/watch?v=4EHjHcyB9yY"
                  className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg outline-none focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#14532d] mb-1">
                  वीडियो शीर्षक (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Classification of Tractors"
                  className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg outline-none focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#14532d] mb-1">
                  वीडियो शीर्षक (हिंदी)
                </label>
                <input
                  type="text"
                  value={formTitleHi}
                  onChange={(e) => setFormTitleHi(e.target.value)}
                  placeholder="उदा. ट्रैक्टरों का वर्गीकरण एवं कृषि उपयोगिता"
                  className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg outline-none focus:border-[#15803d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#14532d] mb-1">श्रेणी (Category)</label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      setFormCategory(e.target.value);
                      if (e.target.value === "कृषि यंत्रीकरण") setFormCategoryEn("Farm Machinery");
                      else if (e.target.value === "फसल उत्पादन") setFormCategoryEn("Crop Production");
                      else if (e.target.value === "कीट व रोग नियंत्रण") setFormCategoryEn("Pest Management");
                      else setFormCategoryEn("Soil Health & Lectures");
                    }}
                    className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg bg-white"
                  >
                    <option value="कृषि यंत्रीकरण">कृषि यंत्रीकरण</option>
                    <option value="फसल उत्पादन">फसल उत्पादन</option>
                    <option value="कीट व रोग नियंत्रण">कीट व रोग नियंत्रण</option>
                    <option value="मृदा स्वास्थ्य व व्याख्यान">मृदा स्वास्थ्य व व्याख्यान</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#14532d] mb-1">अवधि (Duration)</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="उदा. 14:20"
                    className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#14532d] mb-1">चैनल / प्रस्तोता</label>
                  <input
                    type="text"
                    value={formChannel}
                    onChange={(e) => setFormChannel(e.target.value)}
                    placeholder="उदा. Bharat Skills / TNAU"
                    className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#14532d] mb-1">अधिकृत स्रोत</label>
                  <input
                    type="text"
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    placeholder="उदा. MANAGE / ICAR-ATARI"
                    className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#14532d] mb-1">संक्षिप्त विवरण (Description)</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="वीडियो की मुख्य विषय सामग्री..."
                  className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#e5e7eb]">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                  रद्द करें
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                  {submitting ? "सहेजा जा रहा है..." : editingVideo ? "अपडेट करें" : "वीडियो जोड़ें"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
            <div className="p-3 bg-[#14532d] text-white flex items-center justify-between">
              <span className="font-bold text-sm truncate">{previewVideo.title}</span>
              <button onClick={() => setPreviewVideo(null)} className="text-white hover:text-gray-300">
                <X className="size-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${previewVideo.youtube_id}?autoplay=1`}
                title={previewVideo.title}
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
