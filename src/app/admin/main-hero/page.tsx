"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  LayoutTemplate,
  FileJson,
} from "lucide-react";
import { ImageField } from "../components";

/* ─── Media Preview Helper ─── */
function MediaPreview({ url }: { url: string }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [url]);

  if (!url || typeof url !== "string" || hasError) return null;
  if (!url.startsWith("http") && !url.startsWith("/") && !url.startsWith("data:")) return null;

  return (
    <div className="mt-2 inline-flex items-center justify-center p-1 bg-gray-50 border border-gray-200 rounded-xl max-w-[240px]">
      <img
        src={url}
        alt="Preview"
        className="max-h-24 max-w-full rounded-lg object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function MainHeroAdmin() {
  const [hero, setHero] = useState<any>(null);
  const [rawJson, setRawJson] = useState("");
  const [activeTab, setActiveTab] = useState<"form" | "json">("form");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchHero();
  }, []);

  async function fetchHero() {
    setLoading(true);
    const { data } = await supabase
      .from("main_hp_hero")
      .select("*")
      .eq("site_key", "main")
      .maybeSingle();

    if (data) {
      setHero(data);
      setRawJson(JSON.stringify(data, null, 2));
    }
    setLoading(false);
  }

  // Update both the structured object and raw JSON string
  const updateHeroField = (key: string, value: any) => {
    const updated = { ...hero, [key]: value };
    setHero(updated);
    setRawJson(JSON.stringify(updated, null, 2));
  };

  const handleTabChange = (tab: "form" | "json") => {
    if (tab === "form") {
      try {
        const parsed = JSON.parse(rawJson);
        setHero(parsed);
      } catch {
        alert("Dữ liệu JSON hiện tại không hợp lệ. Vui lòng sửa lỗi trước khi chuyển sang tab Biểu mẫu.");
        return;
      }
    }
    setActiveTab(tab);
  };

  async function saveHero() {
    setSaving(true);
    setStatus(null);
    try {
      let updateData;
      if (activeTab === "json") {
        const parsed = JSON.parse(rawJson);
        setHero(parsed);
        const parsedCopy = { ...parsed };
        delete (parsedCopy as any).id;
        delete (parsedCopy as any).created_at;
        updateData = parsedCopy;
      } else {
        const heroCopy = { ...hero };
        delete (heroCopy as any).id;
        delete (heroCopy as any).created_at;
        updateData = heroCopy;
      }

      if (hero?.id) {
        const { error } = await supabase
          .from("main_hp_hero")
          .update(updateData)
          .eq("id", hero.id);
        if (error) throw error;
      }
      setStatus({ type: "success", message: "Đã lưu thành công!" });
      setTimeout(() => setStatus(null), 3000);
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi lưu hoặc định dạng JSON",
      });
    } finally {
      setSaving(false);
    }
  }

  // Slider Image management helper functions
  const moveItem = (list: string[], index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= list.length) return;
    const newList = [...list];
    const temp = newList[index];
    newList[index] = newList[index + direction];
    newList[index + direction] = temp;
    updateHeroField("images", newList);
  };

  const removeItem = (list: string[], index: number) => {
    const newList = list.filter((_, i) => i !== index);
    updateHeroField("images", newList);
  };

  const addImage = () => {
    const newList = [...(hero?.images || []), ""];
    updateHeroField("images", newList);
  };

  const updateImageAt = (index: number, val: string) => {
    const newList = [...(hero?.images || [])];
    newList[index] = val;
    updateHeroField("images", newList);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            Cấu hình Main Hero (main_hp_hero)
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Quản lý tiêu đề, video nền, và hình ảnh slider ở phần đầu Trang chủ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchHero}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tải lại
          </button>
          <button
            onClick={saveHero}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 cursor-pointer font-medium"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      {status && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm ${
            status.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          {status.message}
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => handleTabChange("form")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all cursor-pointer ${
            activeTab === "form"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          Biểu mẫu trực quan
        </button>
        <button
          onClick={() => handleTabChange("json")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all cursor-pointer ${
            activeTab === "json"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <FileJson className="w-4 h-4" />
          Dữ liệu JSON
        </button>
      </div>

      {hero ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {activeTab === "form" ? (
            <div className="space-y-6">
              {/* Row: Title */}
              <div>
                <label htmlFor="hero_title" className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề Hero (Hỗ trợ xuống dòng)
                </label>
                <textarea
                  id="hero_title"
                  value={hero.title || ""}
                  onChange={(e) => updateHeroField("title", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y text-gray-900"
                  placeholder="Nhập tiêu đề..."
                />
              </div>

              {/* Row: Media type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="media_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Loại Media nền (Media Type)
                  </label>
                  <select
                    id="media_type"
                    title="Loại Media nền"
                    value={hero.media_type || "video"}
                    onChange={(e) => updateHeroField("media_type", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="video">Video nền (Khuyên dùng)</option>
                    <option value="slider">Slider Hình ảnh</option>
                  </select>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái hoạt động
                  </span>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => updateHeroField("is_active", !hero.is_active)}
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer outline-none ${
                        hero.is_active ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      title={hero.is_active ? "Kích hoạt" : "Hủy kích hoạt"}
                      aria-label={hero.is_active ? "Kích hoạt" : "Hủy kích hoạt"}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          hero.is_active ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL (Dùng khi loại media là Video)
                </label>
                <input
                  id="video_url"
                  type="text"
                  value={hero.video_url || ""}
                  onChange={(e) => updateHeroField("video_url", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://..."
                />
              </div>

              {/* Background Image / Thumbnail */}
              <ImageField
                label="Ảnh nền mặc định / Thumbnail Video (background_image)"
                value={hero.background_image}
                onChange={(v: string) => updateHeroField("background_image", v)}
              />

              {/* Images list for Slider */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Danh sách hình ảnh Slider
                    </h3>
                    <p className="text-xs text-gray-500">
                      Được sử dụng khi chọn Loại Media nền là "Slider Hình ảnh"
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addImage}
                    className="text-xs flex items-center gap-1 px-2.5 py-1.5 text-blue-600 border border-blue-250 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 cursor-pointer font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm hình ảnh
                  </button>
                </div>

                {(!hero.images || hero.images.length === 0) ? (
                  <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-sm text-gray-400">Chưa có hình ảnh nào trong danh sách slider</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {hero.images.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-200"
                      >
                        <div className="flex-1">
                          <ImageField
                            label={`Hình ảnh ${idx + 1}`}
                            value={img}
                            onChange={(v: string) => updateImageAt(idx, v)}
                          />
                        </div>
                        <div className="flex flex-col gap-1 pt-6">
                          <button
                            type="button"
                            onClick={() => moveItem(hero.images, idx, -1)}
                            disabled={idx === 0}
                            className="p-1.5 text-gray-500 hover:text-blue-600 bg-white border border-gray-200 rounded-lg shadow-sm disabled:opacity-40 disabled:hover:text-gray-500 cursor-pointer"
                            title="Di chuyển lên"
                            aria-label="Di chuyển lên"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(hero.images, idx, 1)}
                            disabled={idx === hero.images.length - 1}
                            className="p-1.5 text-gray-500 hover:text-blue-600 bg-white border border-gray-200 rounded-lg shadow-sm disabled:opacity-40 disabled:hover:text-gray-500 cursor-pointer"
                            title="Di chuyển xuống"
                            aria-label="Di chuyển xuống"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(hero.images, idx)}
                            className="p-1.5 text-gray-500 hover:text-red-650 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer mt-1"
                            title="Xóa ảnh"
                            aria-label="Xóa ảnh"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Chỉnh sửa trực tiếp dữ liệu dạng JSON. Các thay đổi sẽ được đồng bộ sang tab Biểu mẫu khi chuyển tab.
                </span>
              </div>
              <textarea
                value={rawJson}
                onChange={(e) => setRawJson(e.target.value)}
                rows={22}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 text-xs font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                spellCheck={false}
                title="Dữ liệu JSON"
                aria-label="Dữ liệu JSON"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-gray-400">
            Chưa có data trong bảng main_hp_hero (site_key: main)
          </p>
        </div>
      )}
    </div>
  );
}
