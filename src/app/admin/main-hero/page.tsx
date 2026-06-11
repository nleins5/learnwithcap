"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function MainHeroAdmin() {
  const [hero, setHero] = useState<any>(null);
  const [rawJson, setRawJson] = useState("");
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

  async function saveHero() {
    setSaving(true);
    setStatus(null);
    try {
      const parsed = JSON.parse(rawJson);
      const { id, created_at, ...updateData } = parsed;
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
          <h1 className="text-lg font-bold text-gray-900">
            Main Hero (main_hp_hero)
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Quản lý hero data từ bảng main_hp_hero (site_key: main)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchHero}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tải lại
          </button>
          <button
            onClick={saveHero}
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

      {hero ? (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hero Data (JSON)
          </label>
          <p className="text-xs text-gray-400 mb-3">
            Table: <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">main_hp_hero</code>
            {" · "}site_key: <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">main</code>
          </p>
          <textarea
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            rows={20}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 text-xs font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellCheck={false}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400">
            Chưa có data trong bảng main_hp_hero (site_key: main)
          </p>
        </div>
      )}
    </div>
  );
}
