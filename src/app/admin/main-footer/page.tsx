"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/constants";
import {
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function MainFooterAdmin() {
  const [footer, setFooter] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [footerRes, itemsRes] = await Promise.all([
      supabase.from(TABLES.MAIN_HP_FOOTER).select("*").maybeSingle(),
      supabase
        .from(TABLES.MAIN_HP_FOOTER_ITEMS)
        .select("*")
        .order("display_order", { ascending: true }),
    ]);

    if (footerRes.data) setFooter(footerRes.data);
    if (itemsRes.data) setItems(itemsRes.data);
    setLoading(false);
  }

  async function saveAll() {
    setSaving(true);
    setStatus(null);
    try {
      // Save footer
      if (footer?.id) {
        const updateData = { ...footer };
        delete updateData.id;
        delete updateData.created_at;
        const { error } = await supabase
          .from(TABLES.MAIN_HP_FOOTER)
          .update(updateData)
          .eq("id", footer.id);
        if (error) throw error;
      }

      // Save items
      for (const item of items) {
        if (item.id) {
          const updateData = { ...item };
          delete updateData.id;
          delete updateData.created_at;
          const { error } = await supabase
            .from(TABLES.MAIN_HP_FOOTER_ITEMS)
            .update(updateData)
            .eq("id", item.id);
          if (error) throw error;
        }
      }

      setStatus({ type: "success", message: "Đã lưu thành công!" });
      setTimeout(() => setStatus(null), 3000);
    } catch (error: any) {
      setStatus({ type: "error", message: error?.message || "Có lỗi xảy ra" });
    } finally {
      setSaving(false);
    }
  }



  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
          <div className="h-40 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Main Footer</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Quản lý footer chính và các mục footer items
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tải lại
          </button>
          <button
            onClick={saveAll}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Đang lưu..." : "Lưu tất cả"}
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

      {/* Footer Settings */}
      {footer && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Footer Settings
          </h3>
          <div className="space-y-3">
            <textarea
              value={JSON.stringify(footer, null, 2)}
              onChange={(e) => {
                try {
                  setFooter(JSON.parse(e.target.value));
                } catch {}
              }}
              rows={10}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 text-xs font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* Footer Items */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Footer Items ({items.length})
        </h3>
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm">Chưa có footer items</p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="border border-gray-100 rounded-lg p-3"
              >
                <textarea
                  value={JSON.stringify(item, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setItems((prev) => {
                        const updated = [...prev];
                        updated[index] = parsed;
                        return updated;
                      });
                    } catch {}
                  }}
                  rows={5}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-xs font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                  spellCheck={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
