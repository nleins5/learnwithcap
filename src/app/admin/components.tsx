"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Plus,
  GripVertical,
} from "lucide-react";

/* ─── Generic CMS helpers ─── */

interface FieldConfig {
  key: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "url"
    | "number"
    | "toggle"
    | "json"
    | "select"
    | "color";
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
  helpText?: string;
}

interface CmsEditorProps {
  title: string;
  description: string;
  table: string;
  fields: FieldConfig[];
  singleRow?: boolean;
  orderBy?: string;
  filter?: { column: string; value: string };
  defaultValues?: Record<string, any>;
  readonlyList?: boolean;
}

export function CmsEditor({
  title,
  description,
  table,
  fields,
  singleRow = false,
  orderBy = "display_order",
  filter,
  defaultValues = {},
  readonlyList = false,
}: CmsEditorProps) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    let query = supabase.from(table).select("*");
    if (filter) {
      query = query.eq(filter.column, filter.value);
    }
    query = query.order(orderBy, { ascending: true });
    const { data, error } = await query;
    if (error) {
      const { data: retryData } = await supabase.from(table).select("*");
      setRows(retryData || []);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  }, [table, filter, orderBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateField = (index: number, key: string, value: any) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const saveRow = async (index: number) => {
    setSaving(true);
    setStatus(null);
    const row = rows[index];
    const { id, created_at, ...updateData } = row;
    try {
      if (id) {
        const { error } = await supabase
          .from(table)
          .update({ ...updateData, updated_at: new Date().toISOString() })
          .eq("id", id);
        if (error) throw error;
      } else {
        const insertData = { ...defaultValues, ...updateData };
        if (filter) insertData[filter.column] = filter.value;
        const { data, error } = await supabase
          .from(table)
          .insert(insertData)
          .select()
          .single();
        if (error) throw error;
        if (data) {
          setRows((prev) => {
            const updated = [...prev];
            updated[index] = data;
            return updated;
          });
        }
      }
      setStatus({ type: "success", message: "Đã lưu thành công!" });
      setTimeout(() => setStatus(null), 3000);
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveAll = async () => {
    setSaving(true);
    setStatus(null);
    try {
      for (const row of rows) {
        const { id, created_at, ...updateData } = row;
        if (id) {
          const { error } = await supabase
            .from(table)
            .update({ ...updateData, updated_at: new Date().toISOString() })
            .eq("id", id);
          if (error) throw error;
        }
      }
      setStatus({ type: "success", message: "Đã lưu tất cả thành công!" });
      setTimeout(() => setStatus(null), 3000);
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
      });
    } finally {
      setSaving(false);
    }
  };

  const addRow = () => {
    const newRow: Record<string, any> = { ...defaultValues };
    fields.forEach((f) => {
      if (!(f.key in newRow)) {
        newRow[f.key] =
          f.type === "number" ? 0 : f.type === "toggle" ? true : "";
      }
    });
    if (filter) newRow[filter.column] = filter.value;
    newRow.display_order = rows.length + 1;
    setRows((prev) => [...prev, newRow]);
  };

  const deleteRow = async (index: number) => {
    const row = rows[index];
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    if (row.id) {
      const { error } = await supabase.from(table).delete().eq("id", row.id);
      if (error) {
        setStatus({ type: "error", message: error.message });
        return;
      }
    }
    setRows((prev) => prev.filter((_, i) => i !== index));
    setStatus({ type: "success", message: "Đã xóa!" });
    setTimeout(() => setStatus(null), 3000);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
          >
            <div className="h-4 w-40 bg-gray-100 rounded mb-4"></div>
            <div className="h-10 bg-gray-100 rounded mb-3"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tải lại
          </button>
          {!readonlyList && !singleRow && (
            <button
              onClick={addRow}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm mới
            </button>
          )}
          {rows.length > 0 && (
            <button
              onClick={saveAll}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Đang lưu..." : "Lưu tất cả"}
            </button>
          )}
        </div>
      </div>

      {/* Status */}
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

      {/* Empty */}
      {rows.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 mb-4">Chưa có dữ liệu nào</p>
          {!readonlyList && (
            <button
              onClick={addRow}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Thêm mục đầu tiên
            </button>
          )}
        </div>
      )}

      {/* Rows */}
      {rows.map((row, index) => (
        <div
          key={row.id || `new-${index}`}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          {/* Row Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-300" />
              <span className="text-sm font-medium text-gray-500">
                #{index + 1}
                {row.id && (
                  <span className="text-gray-300 ml-2 font-mono text-xs">
                    ID: {row.id}
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => saveRow(index)}
                disabled={saving}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-all font-medium"
              >
                <Save className="w-3 h-3" />
                Lưu
              </button>
              {!readonlyList && (
                <button
                  onClick={() => deleteRow(index)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-500 rounded-md hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                  Xóa
                </button>
              )}
            </div>
          </div>

          {/* Fields */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div
                key={field.key}
                className={
                  field.type === "textarea" || field.type === "json"
                    ? "md:col-span-2"
                    : ""
                }
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && (
                    <span className="text-red-400 ml-0.5">*</span>
                  )}
                </label>
                {field.helpText && (
                  <p className="text-xs text-gray-400 mb-1">
                    {field.helpText}
                  </p>
                )}

                {field.type === "textarea" ? (
                  <textarea
                    value={row[field.key] || ""}
                    onChange={(e) =>
                      updateField(index, field.key, e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-y"
                    placeholder={field.placeholder}
                  />
                ) : field.type === "json" ? (
                  <textarea
                    value={
                      typeof row[field.key] === "object"
                        ? JSON.stringify(row[field.key], null, 2)
                        : row[field.key] || ""
                    }
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        updateField(index, field.key, parsed);
                      } catch {
                        updateField(index, field.key, e.target.value);
                      }
                    }}
                    rows={8}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs font-mono resize-y"
                    placeholder={field.placeholder || "{}"}
                  />
                ) : field.type === "toggle" ? (
                  <button
                    onClick={() =>
                      updateField(index, field.key, !row[field.key])
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      row[field.key] ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        row[field.key] ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                ) : field.type === "select" ? (
                  <select
                    value={row[field.key] || ""}
                    onChange={(e) =>
                      updateField(index, field.key, e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  >
                    <option value="">Chọn...</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    value={row[field.key] || ""}
                    onChange={(e) =>
                      updateField(
                        index,
                        field.key,
                        field.type === "number"
                          ? parseInt(e.target.value) || 0
                          : e.target.value
                      )
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Section Editor for page_sections table (JSON data column) ─── */

interface SectionEditorProps {
  title: string;
  description: string;
  sectionKey: string;
}

export function SectionEditor({
  title,
  description,
  sectionKey,
}: SectionEditorProps) {
  const [data, setData] = useState<any>(null);
  const [rawJson, setRawJson] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchSection();
  }, [sectionKey]);

  async function fetchSection() {
    setLoading(true);
    const { data: row } = await supabase
      .from("ld_page_sections")
      .select("*")
      .eq("section_key", sectionKey)
      .maybeSingle();

    if (row) {
      setData(row);
      setRawJson(JSON.stringify(row.data, null, 2));
    } else {
      setData(null);
      setRawJson("{}");
    }
    setLoading(false);
  }

  async function saveSection() {
    setSaving(true);
    setStatus(null);
    try {
      const parsed = JSON.parse(rawJson);
      if (data?.section_key) {
        const { error } = await supabase
          .from("ld_page_sections")
          .update({ data: parsed, updated_at: new Date().toISOString() })
          .eq("section_key", sectionKey);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("ld_page_sections")
          .insert({ section_key: sectionKey, data: parsed });
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
        <div className="h-4 w-40 bg-gray-100 rounded mb-4"></div>
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSection}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tải lại
          </button>
          <button
            onClick={saveSection}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
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
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {status.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Section Data (JSON)
        </label>
        <p className="text-xs text-gray-400 mb-3">
          section_key:{" "}
          <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            {sectionKey}
          </code>
        </p>
        <textarea
          value={rawJson}
          onChange={(e) => setRawJson(e.target.value)}
          rows={20}
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs font-mono resize-y"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
