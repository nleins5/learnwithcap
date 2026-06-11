"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/constants";
import { Save, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

export default function FooterAdmin() {
  const [footer, setFooter] = useState<any>(null);
  const [rawJson, setRawJson] = useState("");
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
      setFooter(data);
      setRawJson(JSON.stringify(data, null, 2));
    }
    setLoading(false);
  }

  async function saveFooter() {
    setSaving(true);
    setStatus(null);
    try {
      const parsed = JSON.parse(rawJson);
      const { id, created_at, ...updateData } = parsed;
      if (footer?.id) {
        const { error } = await supabase
          .from(TABLES.HOMEPAGE_FOOTER)
          .update(updateData)
          .eq("id", footer.id);
        if (error) throw error;
      }
      setStatus({ type: "success", message: "Footer đã được cập nhật!" });
      setTimeout(() => setStatus(null), 3000);
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error?.message || "JSON không hợp lệ",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Footer Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Quản lý thông tin footer — social links, copyright, liên hệ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchFooter}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tải lại
          </button>
          <button
            onClick={saveFooter}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Đang lưu..." : "Lưu"}
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
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {status.message}
        </div>
      )}

      {/* Quick edit fields */}
      {footer && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Thông tin nhanh
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { key: "description", label: "Mô tả", type: "textarea" },
              { key: "copyright_text", label: "Copyright", type: "text" },
              { key: "contact_email", label: "Email", type: "text" },
              { key: "contact_phone", label: "Điện thoại", type: "text" },
              { key: "contact_address", label: "Địa chỉ", type: "text" },
              { key: "facebook_url", label: "Facebook URL", type: "url" },
              { key: "youtube_url", label: "YouTube URL", type: "url" },
              { key: "instagram_url", label: "Instagram URL", type: "url" },
            ].map((field) => (
              <div
                key={field.key}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={footer[field.key] || ""}
                    onChange={(e) => {
                      const updated = {
                        ...footer,
                        [field.key]: e.target.value,
                      };
                      setFooter(updated);
                      setRawJson(JSON.stringify(updated, null, 2));
                    }}
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    value={footer[field.key] || ""}
                    onChange={(e) => {
                      const updated = {
                        ...footer,
                        [field.key]: e.target.value,
                      };
                      setFooter(updated);
                      setRawJson(JSON.stringify(updated, null, 2));
                    }}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw JSON */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Data (JSON)
        </label>
        <textarea
          value={rawJson}
          onChange={(e) => {
            setRawJson(e.target.value);
            try {
              setFooter(JSON.parse(e.target.value));
            } catch {}
          }}
          rows={16}
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-xs font-mono resize-y"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
