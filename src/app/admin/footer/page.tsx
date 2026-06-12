"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/constants";
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

/* ─── Media Preview Helper ─── */
function MediaPreview({ url }: { url: string }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [url]);

  if (!url || typeof url !== "string" || hasError) return null;
  if (!url.startsWith("http") && !url.startsWith("/") && !url.startsWith("data:")) return null;

  return (
    <div className="mt-2 inline-flex items-center justify-center p-1 bg-gray-50 border border-gray-200 rounded-xl max-w-[200px]">
      <img
        src={url}
        alt="Preview"
        className="max-h-16 max-w-full rounded-lg object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function FooterAdmin() {
  const [footer, setFooter] = useState<any>(null);
  const [rawJson, setRawJson] = useState("");
  const [activeTab, setActiveTab] = useState<"form" | "json">("form");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchFooter();
  }, []);

  async function fetchFooter() {
    setLoading(true);
    const { data } = await supabase
      .from(TABLES.HOMEPAGE_FOOTER)
      .select("*")
      .single();
    if (data) {
      // Ensure links is an array
      const preparedData = {
        ...data,
        links: Array.isArray(data.links) ? data.links : [],
      };
      setFooter(preparedData);
      setRawJson(JSON.stringify(preparedData, null, 2));
    }
    setLoading(false);
  }

  // Update a single top-level field
  const updateField = (key: string, value: any) => {
    const updated = { ...footer, [key]: value };
    setFooter(updated);
    setRawJson(JSON.stringify(updated, null, 2));
  };

  const handleTabChange = (tab: "form" | "json") => {
    if (tab === "form") {
      try {
        const parsed = JSON.parse(rawJson);
        setFooter({
          ...parsed,
          links: Array.isArray(parsed.links) ? parsed.links : [],
        });
      } catch {
        alert("Dữ liệu JSON hiện tại không hợp lệ. Vui lòng sửa lỗi trước khi chuyển sang tab Biểu mẫu.");
        return;
      }
    }
    setActiveTab(tab);
  };

  async function saveFooter() {
    setSaving(true);
    setStatus(null);
    try {
      let updateData;
      if (activeTab === "json") {
        const parsed = JSON.parse(rawJson);
        const prepared = {
          ...parsed,
          links: Array.isArray(parsed.links) ? parsed.links : [],
        };
        setFooter(prepared);
        const preparedCopy = { ...prepared };
        delete (preparedCopy as any).id;
        delete (preparedCopy as any).created_at;
        delete (preparedCopy as any).updated_at;
        updateData = preparedCopy;
      } else {
        const footerCopy = { ...footer };
        delete (footerCopy as any).id;
        delete (footerCopy as any).created_at;
        delete (footerCopy as any).updated_at;
        updateData = footerCopy;
      }

      if (footer?.id) {
        const { error } = await supabase
          .from(TABLES.HOMEPAGE_FOOTER)
          .update({ ...updateData, updated_at: new Date().toISOString() })
          .eq("id", footer.id);
        if (error) throw error;
      }
      setStatus({ type: "success", message: "Footer đã được cập nhật thành công!" });
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

  /* ─── Column / Link Builder Helpers ─── */
  const addColumn = () => {
    const newColumns = [
      ...(footer?.links || []),
      { section_id: "CỘT MỚI", items: [] },
    ];
    updateField("links", newColumns);
  };

  const removeColumn = (colIdx: number) => {
    const newColumns = footer.links.filter((_: any, i: number) => i !== colIdx);
    updateField("links", newColumns);
  };

  const moveColumn = (colIdx: number, direction: -1 | 1) => {
    if (colIdx + direction < 0 || colIdx + direction >= footer.links.length) return;
    const newColumns = [...footer.links];
    const temp = newColumns[colIdx];
    newColumns[colIdx] = newColumns[colIdx + direction];
    newColumns[colIdx + direction] = temp;
    updateField("links", newColumns);
  };

  const updateColumnName = (colIdx: number, newName: string) => {
    const newColumns = [...footer.links];
    newColumns[colIdx] = { ...newColumns[colIdx], section_id: newName };
    updateField("links", newColumns);
  };

  const addLinkItem = (colIdx: number) => {
    const newColumns = [...footer.links];
    const column = newColumns[colIdx];
    const items = [...(column.items || []), { title: "Liên kết mới", link_url: "" }];
    newColumns[colIdx] = { ...column, items };
    updateField("links", newColumns);
  };

  const removeLinkItem = (colIdx: number, itemIdx: number) => {
    const newColumns = [...footer.links];
    const column = newColumns[colIdx];
    const items = column.items.filter((_: any, i: number) => i !== itemIdx);
    newColumns[colIdx] = { ...column, items };
    updateField("links", newColumns);
  };

  const moveLinkItem = (colIdx: number, itemIdx: number, direction: -1 | 1) => {
    const column = footer.links[colIdx];
    if (itemIdx + direction < 0 || itemIdx + direction >= column.items.length) return;
    const newColumns = [...footer.links];
    const items = [...column.items];
    const temp = items[itemIdx];
    items[itemIdx] = items[itemIdx + direction];
    items[itemIdx + direction] = temp;
    newColumns[colIdx] = { ...column, items };
    updateField("links", newColumns);
  };

  const updateLinkItemField = (colIdx: number, itemIdx: number, key: string, val: string) => {
    const newColumns = [...footer.links];
    const column = newColumns[colIdx];
    const items = [...column.items];
    items[itemIdx] = { ...items[itemIdx], [key]: val };
    newColumns[colIdx] = { ...column, items };
    updateField("links", newColumns);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Cấu hình Footer</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Quản lý logo, thông tin liên hệ, mạng xã hội, bản tin và các cột liên kết ở chân trang.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchFooter}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tải lại
          </button>
          <button
            onClick={saveFooter}
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

      {footer ? (
        activeTab === "form" ? (
          <div className="space-y-6">
            {/* 1. Thông tin chung & Logo */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                Thông tin chung & Logo thương hiệu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    value={footer.logo_url || ""}
                    onChange={(e) => updateField("logo_url", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="https://..."
                  />
                  <MediaPreview url={footer.logo_url} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả ngắn ở chân trang (Footer Description)
                  </label>
                  <textarea
                    value={footer.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y"
                    placeholder="Giới thiệu ngắn về thương hiệu..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dòng chữ Bản quyền (Copyright Text)
                  </label>
                  <input
                    type="text"
                    value={footer.copyright_text || ""}
                    onChange={(e) => updateField("copyright_text", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="CAP English Training. All rights reserved."
                  />
                </div>
              </div>
            </div>

            {/* 2. Thông tin Liên hệ & Mạng xã hội */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                Thông tin Liên hệ & Liên kết Mạng xã hội
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={footer.contact_email || ""}
                    onChange={(e) => updateField("contact_email", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Điện thoại liên hệ
                  </label>
                  <input
                    type="text"
                    value={footer.contact_phone || ""}
                    onChange={(e) => updateField("contact_phone", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ liên hệ
                  </label>
                  <input
                    type="text"
                    value={footer.contact_address || ""}
                    onChange={(e) => updateField("contact_address", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    value={footer.facebook_url || ""}
                    onChange={(e) => updateField("facebook_url", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    value={footer.youtube_url || ""}
                    onChange={(e) => updateField("youtube_url", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={footer.instagram_url || ""}
                    onChange={(e) => updateField("instagram_url", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter (X) URL
                  </label>
                  <input
                    type="text"
                    value={footer.twitter_url || ""}
                    onChange={(e) => updateField("twitter_url", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>
            </div>

            {/* 3. Bản tin (Newsletter) */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                Cấu hình Cột Bản tin & Đăng ký Tư vấn (Newsletter)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề Bản tin
                  </label>
                  <input
                    type="text"
                    value={footer.newsletter_title || ""}
                    onChange={(e) => updateField("newsletter_title", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả Bản tin
                  </label>
                  <input
                    type="text"
                    value={footer.newsletter_description || ""}
                    onChange={(e) => updateField("newsletter_description", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chữ gợi ý trong ô nhập (Placeholder)
                  </label>
                  <input
                    type="text"
                    value={footer.newsletter_placeholder || ""}
                    onChange={(e) => updateField("newsletter_placeholder", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 4. Column & Links Builder */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Cấu trúc các Cột liên kết chân trang
                  </h3>
                  <p className="text-xs text-gray-500">
                    Thêm, xóa, sắp xếp các cột liên kết (ví dụ: HỮU ÍCH, LIÊN KẾT) và các link chi tiết bên trong mỗi cột.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addColumn}
                  className="text-xs flex items-center gap-1 px-3 py-2 text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 cursor-pointer font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm cột mới
                </button>
              </div>

              {(!footer.links || footer.links.length === 0) ? (
                <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-sm text-gray-400">Không có cột liên kết nào. Hãy thêm cột đầu tiên.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {footer.links.map((column: any, colIdx: number) => (
                    <div
                      key={colIdx}
                      className="bg-gray-50 rounded-xl border border-gray-250 p-4 space-y-4 shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        {/* Header of Column card */}
                        <div className="flex gap-2 items-center justify-between border-b border-gray-200 pb-2">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={column.section_id || ""}
                              onChange={(e) => updateColumnName(colIdx, e.target.value)}
                              className="px-2.5 py-1 text-sm font-bold text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-full"
                              placeholder="Tên Cột (VD: HỮU ÍCH)"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveColumn(colIdx, -1)}
                              disabled={colIdx === 0}
                              className="p-1 text-gray-500 hover:text-blue-600 bg-white border border-gray-200 rounded shadow-sm disabled:opacity-40 cursor-pointer"
                              title="Sang trái"
                            >
                              <ArrowUp className="w-3.5 h-3.5 rotate-270" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveColumn(colIdx, 1)}
                              disabled={colIdx === footer.links.length - 1}
                              className="p-1 text-gray-500 hover:text-blue-600 bg-white border border-gray-200 rounded shadow-sm disabled:opacity-40 cursor-pointer"
                              title="Sang phải"
                            >
                              <ArrowDown className="w-3.5 h-3.5 rotate-270" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeColumn(colIdx)}
                              className="p-1 text-gray-500 hover:text-red-650 bg-white border border-gray-200 rounded shadow-sm cursor-pointer"
                              title="Xóa cột"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* List of items inside this column */}
                        <div className="space-y-2">
                          {(!column.items || column.items.length === 0) ? (
                            <p className="text-xs text-gray-400 text-center py-4 bg-white rounded-lg border border-dashed border-gray-200">
                              Chưa có liên kết nào trong cột này
                            </p>
                          ) : (
                            column.items.map((item: any, itemIdx: number) => (
                              <div
                                key={itemIdx}
                                className="flex gap-2 items-center bg-white p-2.5 rounded-lg border border-gray-200"
                              >
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={item.title || ""}
                                    onChange={(e) => updateLinkItemField(colIdx, itemIdx, "title", e.target.value)}
                                    className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="Tiêu đề hiển thị"
                                  />
                                  <input
                                    type="text"
                                    value={item.link_url || ""}
                                    onChange={(e) => updateLinkItemField(colIdx, itemIdx, "link_url", e.target.value)}
                                    className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="Đường dẫn (/about, ...)"
                                  />
                                </div>
                                <div className="flex gap-0.5">
                                  <button
                                    type="button"
                                    onClick={() => moveLinkItem(colIdx, itemIdx, -1)}
                                    disabled={itemIdx === 0}
                                    className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-40 cursor-pointer"
                                    title="Di chuyển lên"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveLinkItem(colIdx, itemIdx, 1)}
                                    disabled={itemIdx === column.items.length - 1}
                                    className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-40 cursor-pointer"
                                    title="Di chuyển xuống"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeLinkItem(colIdx, itemIdx)}
                                    className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                                    title="Xóa liên kết"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Add button inside Column card */}
                      <div className="pt-3 border-t border-gray-200 mt-2">
                        <button
                          type="button"
                          onClick={() => addLinkItem(colIdx)}
                          className="w-full text-[11px] flex items-center justify-center gap-1 py-1.5 text-blue-600 border border-dashed border-blue-200 hover:bg-blue-50 rounded-lg cursor-pointer font-semibold"
                        >
                          <Plus className="w-3 h-3" /> Thêm liên kết vào cột này
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                Chỉnh sửa trực tiếp dữ liệu Footer dạng JSON.
              </span>
            </div>
            <textarea
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
              rows={22}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 text-xs font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              spellCheck={false}
            />
          </div>
        )
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-gray-400">Chưa tải được cấu hình Footer.</p>
        </div>
      )}
    </div>
  );
}
