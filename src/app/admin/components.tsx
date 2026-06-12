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
  ArrowUp,
  ArrowDown,
  FileJson,
  LayoutTemplate,
} from "lucide-react";


/* ─── Helper components for CMS ─── */

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
  primaryKey?: string;
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
  primaryKey = "id",
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
    const pkValue = row[primaryKey];
    const isNew = row._isNew;

    const updateData = { ...row };
    delete updateData._isNew;
    delete updateData.created_at;
    if (primaryKey === "id") {
      delete updateData.id;
    }

    try {
      if (!isNew && pkValue) {
        const { error } = await supabase
          .from(table)
          .update({ ...updateData, updated_at: new Date().toISOString() })
          .eq(primaryKey, pkValue);
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
            updated[index] = { ...data, _isNew: false };
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
      const updatedRows = [...rows];
      for (let i = 0; i < updatedRows.length; i++) {
        const row = updatedRows[i];
        const pkValue = row[primaryKey];
        const isNew = row._isNew;

        const updateData = { ...row };
        delete updateData._isNew;
        delete updateData.created_at;
        if (primaryKey === "id") {
          delete updateData.id;
        }

        if (!isNew && pkValue) {
          const { error } = await supabase
            .from(table)
            .update({ ...updateData, updated_at: new Date().toISOString() })
            .eq(primaryKey, pkValue);
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
            updatedRows[i] = { ...data, _isNew: false };
          }
        }
      }
      setRows(updatedRows);
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
    newRow._isNew = true;
    setRows((prev) => [...prev, newRow]);
  };

  const deleteRow = async (index: number) => {
    const row = rows[index];
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    const pkValue = row[primaryKey];
    if (!row._isNew && pkValue) {
      const { error } = await supabase.from(table).delete().eq(primaryKey, pkValue);
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
          key={row[primaryKey] || `new-${index}`}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          {/* Row Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-300" />
              <span className="text-sm font-medium text-gray-500">
                #{index + 1}
                {row[primaryKey] && (
                  <span className="text-gray-300 ml-2 font-mono text-xs">
                    {primaryKey.toUpperCase()}: {row[primaryKey]}
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
                    title={field.label}
                    aria-label={field.label}
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
                    title={field.label}
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

/* ─── Generic Input Components for SectionEditor ─── */
const InputField = ({ label, value, onChange, isTextArea = false }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {isTextArea ? (
      <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y" title={label} placeholder={label} />
    ) : (
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" title={label} placeholder={label} />
    )}
  </div>
);

export const ImageField = ({ label, value, onChange }: any) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const bucketName = 'media';

      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      onChange(publicUrl);
    } catch (err: any) {
      console.error('Lỗi tải ảnh:', err);
      setError(
        err?.message || "Lỗi không xác định. Vui lòng tạo public bucket tên là 'media' trên Supabase."
      );
      alert(
        "Lỗi tải lên: Vui lòng đảm bảo bạn đã tạo một Public Storage Bucket tên là 'media' trên Supabase Dashboard và phân quyền truy cập (RUA policies) cho Anon role."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="URL hình ảnh hoặc chọn tải lên bên cạnh..."
        />
        <label className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer transition-all select-none shrink-0">
          <Plus className="w-3.5 h-3.5" />
          {uploading ? "Đang tải..." : "Tải ảnh lên"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 mb-2">
          {error}
        </p>
      )}
      <MediaPreview url={value} />
    </div>
  );
};

export function SectionEditor({
  title,
  description,
  sectionKey,
}: SectionEditorProps) {
  const [data, setData] = useState<any>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [rawJson, setRawJson] = useState("");
  const [activeTab, setActiveTab] = useState<"form" | "json">("form");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const getInitialData = (key: string) => {
    switch (key) {
      case "navbar": return { logo_url: "", login_label: "", cta_label: "", links: [] };
      case "hero": return { title: "", images: [], video_url: "", media_type: "video" };
      case "services": return { header: { title: "", subtitle: "", description: "" }, items: [] };
      case "wants_header":
      case "difficulties_header": return { title: "", badge: "" };
      case "solutions_header": return { title: "", subtitle: "", description: "", image: "" };
      case "solutions": return [];
      case "courses": return [];
      case "clients": return { header: { title: "", badge: "" }, items: [] };
      case "testimonials": return { header: { title: "", stats: [] }, items: [] };
      case "cta_section": return { title: "", videoUrl: "", buttonLink: "", buttonText: "" };
      case "resources_hero": return { title: "", description: "", image: "" };
      case "contact_hero": return { badge: "", title: "", description: "" };
      case "privacy_policy": return { title: "", introduction: "", sections: [] };
      default: return {};
    }
  };

  const fetchSection = useCallback(async () => {
    setLoading(true);
    const { data: row } = await supabase
      .from("ld_page_sections")
      .select("*")
      .eq("section_key", sectionKey)
      .maybeSingle();

    if (row) {
      setData(row);
      const rowData = row.data || getInitialData(sectionKey);
      setParsedData(rowData);
      setRawJson(JSON.stringify(rowData, null, 2));
    } else {
      setData(null);
      const initData = getInitialData(sectionKey);
      setParsedData(initData);
      setRawJson(JSON.stringify(initData, null, 2));
    }
    setLoading(false);
  }, [sectionKey]);

  useEffect(() => {
    fetchSection();
  }, [fetchSection]);

  const updateData = (newData: any) => {
    setParsedData(newData);
    setRawJson(JSON.stringify(newData, null, 2));
  };

  const handleTabChange = (tab: "form" | "json") => {
    if (tab === "form") {
      try {
        const parsed = JSON.parse(rawJson);
        setParsedData(parsed);
      } catch {
        alert("JSON không hợp lệ. Vui lòng sửa lỗi trước khi chuyển sang tab Biểu mẫu.");
        return;
      }
    }
    setActiveTab(tab);
  };

  async function saveSection() {
    setSaving(true);
    setStatus(null);
    try {
      let parsed;
      if (activeTab === "json") {
        parsed = JSON.parse(rawJson);
        setParsedData(parsed);
      } else {
        parsed = parsedData;
      }

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
        message: error?.message || "Lỗi lưu dữ liệu",
      });
    } finally {
      setSaving(false);
    }
  }

  // Generic List item actions
  const moveItem = (list: any[], index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= list.length) return list;
    const newList = [...list];
    const temp = newList[index];
    newList[index] = newList[index + direction];
    newList[index + direction] = temp;
    return newList;
  };
  const removeItem = (list: any[], index: number) => list.filter((_, i) => i !== index);



  const renderForm = () => {
    if (!parsedData) return null;

    if (sectionKey === "wants_header" || sectionKey === "difficulties_header") {
      return (
        <div className="space-y-2">
          <InputField label="Tiêu đề" value={parsedData.title} onChange={(v: string) => updateData({ ...parsedData, title: v })} />
          <InputField label="Badge" value={parsedData.badge} onChange={(v: string) => updateData({ ...parsedData, badge: v })} />
        </div>
      );
    }

    if (sectionKey === "solutions_header") {
      return (
        <div className="space-y-2">
          <InputField label="Tiêu đề" value={parsedData.title} onChange={(v: string) => updateData({ ...parsedData, title: v })} />
          <InputField label="Tiêu đề phụ (Subtitle)" value={parsedData.subtitle} onChange={(v: string) => updateData({ ...parsedData, subtitle: v })} />
          <InputField label="Mô tả" value={parsedData.description} onChange={(v: string) => updateData({ ...parsedData, description: v })} isTextArea />
          <ImageField label="Hình ảnh" value={parsedData.image} onChange={(v: string) => updateData({ ...parsedData, image: v })} />
        </div>
      );
    }

    if (sectionKey === "cta_section") {
      return (
        <div className="space-y-2">
          <InputField label="Tiêu đề" value={parsedData.title} onChange={(v: string) => updateData({ ...parsedData, title: v })} isTextArea />
          <InputField label="Video URL" value={parsedData.videoUrl} onChange={(v: string) => updateData({ ...parsedData, videoUrl: v })} />
          <InputField label="Nội dung nút (Button Text)" value={parsedData.buttonText} onChange={(v: string) => updateData({ ...parsedData, buttonText: v })} />
          <InputField label="Liên kết nút (Button Link)" value={parsedData.buttonLink} onChange={(v: string) => updateData({ ...parsedData, buttonLink: v })} />
        </div>
      );
    }

    if (sectionKey === "hero") {
      return (
        <div className="space-y-6">
          <InputField label="Tiêu đề" value={parsedData.title} onChange={(v: string) => updateData({ ...parsedData, title: v })} isTextArea />
          <InputField label="Video URL" value={parsedData.video_url} onChange={(v: string) => updateData({ ...parsedData, video_url: v })} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại Media</label>
            <select value={parsedData.media_type || "video"} onChange={(e) => updateData({ ...parsedData, media_type: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" title="Loại Media">
              <option value="video">Video</option>
              <option value="slider">Slider Hình Ảnh</option>
            </select>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Danh sách hình ảnh Slider</label>
              <button onClick={() => updateData({ ...parsedData, images: [...(parsedData.images || []), ""] })} className="text-xs flex items-center text-blue-600 hover:text-blue-700">
                <Plus className="w-3 h-3 mr-1" /> Thêm ảnh
              </button>
            </div>
            <div className="space-y-3">
              {(parsedData.images || []).map((img: string, idx: number) => (
                <div key={idx} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border">
                  <div className="flex-1">
                    <ImageField label={`Ảnh ${idx + 1}`} value={img} onChange={(v: string) => { const newImgs = [...parsedData.images]; newImgs[idx] = v; updateData({ ...parsedData, images: newImgs }); }} />
                  </div>
                  <div className="flex flex-col gap-1 pt-6">
                    <button onClick={() => updateData({ ...parsedData, images: moveItem(parsedData.images, idx, -1) })} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border rounded" title="Di chuyển lên" aria-label="Di chuyển lên"><ArrowUp className="w-3 h-3" /></button>
                    <button onClick={() => updateData({ ...parsedData, images: moveItem(parsedData.images, idx, 1) })} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border rounded" title="Di chuyển xuống" aria-label="Di chuyển xuống"><ArrowDown className="w-3 h-3" /></button>
                    <button onClick={() => updateData({ ...parsedData, images: removeItem(parsedData.images, idx) })} className="p-1.5 text-gray-400 hover:text-red-600 bg-white border rounded" title="Xóa" aria-label="Xóa"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (sectionKey === "navbar") {
      return (
        <div className="space-y-6">
          <ImageField label="Logo URL" value={parsedData.logo_url} onChange={(v: string) => updateData({ ...parsedData, logo_url: v })} />
          <InputField label="Nội dung nút Đăng nhập" value={parsedData.login_label} onChange={(v: string) => updateData({ ...parsedData, login_label: v })} />
          <InputField label="Nội dung nút Hành động (CTA)" value={parsedData.cta_label} onChange={(v: string) => updateData({ ...parsedData, cta_label: v })} />
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Liên kết Navbar</label>
              <button onClick={() => updateData({ ...parsedData, links: [...(parsedData.links || []), { label: "", href: "" }] })} className="text-xs flex items-center text-blue-600 hover:text-blue-700">
                <Plus className="w-3 h-3 mr-1" /> Thêm liên kết
              </button>
            </div>
            <div className="space-y-3">
              {(parsedData.links || []).map((link: any, idx: number) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <InputField label="Label" value={link.label} onChange={(v: string) => { const nl = [...parsedData.links]; nl[idx].label = v; updateData({ ...parsedData, links: nl }); }} />
                      <InputField label="Href" value={link.href} onChange={(v: string) => { const nl = [...parsedData.links]; nl[idx].href = v; updateData({ ...parsedData, links: nl }); }} />
                    </div>
                    <div className="flex flex-col gap-1 pt-6">
                      <button onClick={() => updateData({ ...parsedData, links: moveItem(parsedData.links, idx, -1) })} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border rounded" title="Di chuyển lên" aria-label="Di chuyển lên"><ArrowUp className="w-3 h-3" /></button>
                      <button onClick={() => updateData({ ...parsedData, links: moveItem(parsedData.links, idx, 1) })} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border rounded" title="Di chuyển xuống" aria-label="Di chuyển xuống"><ArrowDown className="w-3 h-3" /></button>
                      <button onClick={() => updateData({ ...parsedData, links: removeItem(parsedData.links, idx) })} className="p-1.5 text-gray-400 hover:text-red-600 bg-white border rounded" title="Xóa" aria-label="Xóa"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                  {/* Dropdown support */}
                  <div className="mt-3 pl-4 border-l-2 border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-medium text-gray-600">Menu thả xuống (Dropdown)</label>
                      <button onClick={() => { const nl = [...parsedData.links]; nl[idx].dropdown = [...(nl[idx].dropdown || []), { label: "", href: "" }]; updateData({ ...parsedData, links: nl }); }} className="text-[11px] flex items-center text-blue-600 hover:text-blue-700">
                        <Plus className="w-3 h-3 mr-1" /> Thêm item
                      </button>
                    </div>
                    {(link.dropdown || []).map((dd: any, didx: number) => (
                      <div key={didx} className="flex gap-2 items-start mt-2">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input type="text" value={dd.label || ""} onChange={(e) => { const nl = [...parsedData.links]; nl[idx].dropdown[didx].label = e.target.value; updateData({ ...parsedData, links: nl }); }} className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs" placeholder="Label" />
                          <input type="text" value={dd.href || ""} onChange={(e) => { const nl = [...parsedData.links]; nl[idx].dropdown[didx].href = e.target.value; updateData({ ...parsedData, links: nl }); }} className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs" placeholder="Href" />
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { const nl = [...parsedData.links]; nl[idx].dropdown = removeItem(nl[idx].dropdown, didx); updateData({ ...parsedData, links: nl }); }} className="p-1 text-gray-400 hover:text-red-600 bg-white border rounded" title="Xóa" aria-label="Xóa"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (sectionKey === "solutions") {
      const arr = Array.isArray(parsedData) ? parsedData : [];
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Các Giải Pháp</label>
            <button onClick={() => updateData([...arr, { icon: "Check", text: "" }])} className="text-xs flex items-center text-blue-600 hover:text-blue-700">
              <Plus className="w-3 h-3 mr-1" /> Thêm giải pháp
            </button>
          </div>
          <div className="space-y-3">
            {arr.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-3 bg-gray-50 p-4 rounded-lg border">
                <div className="flex-1 space-y-3">
                  <InputField label="Icon Name (Lucide)" value={item.icon} onChange={(v: string) => { const na = [...arr]; na[idx].icon = v; updateData(na); }} />
                  <InputField label="Nội dung" value={item.text} onChange={(v: string) => { const na = [...arr]; na[idx].text = v; updateData(na); }} isTextArea />
                </div>
                <div className="flex flex-col gap-1 pt-6">
                  <button onClick={() => updateData(moveItem(arr, idx, -1))} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border rounded" title="Di chuyển lên" aria-label="Di chuyển lên"><ArrowUp className="w-3 h-3" /></button>
                  <button onClick={() => updateData(moveItem(arr, idx, 1))} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border rounded" title="Di chuyển xuống" aria-label="Di chuyển xuống"><ArrowDown className="w-3 h-3" /></button>
                  <button onClick={() => updateData(removeItem(arr, idx))} className="p-1.5 text-gray-400 hover:text-red-600 bg-white border rounded" title="Xóa" aria-label="Xóa"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sectionKey === "courses") {
      const arr = Array.isArray(parsedData) ? parsedData : [];
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Khóa học</label>
            <button onClick={() => updateData([...arr, { type: "", desc1: "", desc2: "", stats: { left: "", right: "", leftLabel: "", rightLabel: "" }, modules: [], cta1_label: "Tư Vấn Ngay", cta2_label: "Xem Chi Tiết", cta2_link: "/courses/enterprise" }])} className="text-xs flex items-center text-blue-600 hover:text-blue-700">
              <Plus className="w-3 h-3 mr-1" /> Thêm khóa học
            </button>
          </div>
          <div className="space-y-6">
            {arr.map((item: any, idx: number) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between mb-4 pb-2 border-b">
                  <h4 className="font-semibold text-gray-800">Khóa học #{idx + 1}</h4>
                  <div className="flex gap-1">
                    <button onClick={() => updateData(moveItem(arr, idx, -1))} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border rounded" title="Di chuyển lên" aria-label="Di chuyển lên"><ArrowUp className="w-3 h-3" /></button>
                    <button onClick={() => updateData(moveItem(arr, idx, 1))} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border rounded" title="Di chuyển xuống" aria-label="Di chuyển xuống"><ArrowDown className="w-3 h-3" /></button>
                    <button onClick={() => updateData(removeItem(arr, idx))} className="p-1.5 text-gray-400 hover:text-red-600 bg-white border rounded" title="Xóa" aria-label="Xóa"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
                <div className="space-y-4">
                  <InputField label="Tên loại / Hình thức (Type)" value={item.type} onChange={(v: string) => { const na = [...arr]; na[idx].type = v; updateData(na); }} />
                  <InputField label="Mô tả 1" value={item.desc1} onChange={(v: string) => { const na = [...arr]; na[idx].desc1 = v; updateData(na); }} isTextArea />
                  <InputField label="Mô tả 2" value={item.desc2} onChange={(v: string) => { const na = [...arr]; na[idx].desc2 = v; updateData(na); }} isTextArea />
                  
                  <div className="grid grid-cols-3 gap-4">
                    <InputField label="Label nút 1 (Ví dụ: Tư Vấn Ngay)" value={item.cta1_label || ""} onChange={(v: string) => { const na = [...arr]; na[idx].cta1_label = v; updateData(na); }} />
                    <InputField label="Label nút 2 (Ví dụ: Xem Chi Tiết)" value={item.cta2_label || ""} onChange={(v: string) => { const na = [...arr]; na[idx].cta2_label = v; updateData(na); }} />
                    <InputField label="Link nút 2 (Ví dụ: /courses/enterprise)" value={item.cta2_link || ""} onChange={(v: string) => { const na = [...arr]; na[idx].cta2_link = v; updateData(na); }} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-white p-3 rounded-lg border">
                    <div>
                      <InputField label="Chỉ số trái (Ví dụ: 3)" value={item.stats?.left} onChange={(v: string) => { const na = [...arr]; na[idx].stats = { ...na[idx].stats, left: v }; updateData(na); }} />
                      <InputField label="Label trái (Ví dụ: Modules)" value={item.stats?.leftLabel} onChange={(v: string) => { const na = [...arr]; na[idx].stats = { ...na[idx].stats, leftLabel: v }; updateData(na); }} />
                    </div>
                    <div>
                      <InputField label="Chỉ số phải (Ví dụ: 36)" value={item.stats?.right} onChange={(v: string) => { const na = [...arr]; na[idx].stats = { ...na[idx].stats, right: v }; updateData(na); }} />
                      <InputField label="Label phải (Ví dụ: Bài học)" value={item.stats?.rightLabel} onChange={(v: string) => { const na = [...arr]; na[idx].stats = { ...na[idx].stats, rightLabel: v }; updateData(na); }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Modules hình ảnh</label>
                      <button onClick={() => { const na = [...arr]; na[idx].modules = [...(na[idx].modules || []), { title: "", img: "" }]; updateData(na); }} className="text-xs flex items-center text-blue-600 hover:text-blue-700">
                        <Plus className="w-3 h-3 mr-1" /> Thêm Module
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(item.modules || []).map((mod: any, midx: number) => (
                        <div key={midx} className="flex gap-2 items-start bg-white p-3 rounded-lg border">
                          <div className="flex-1">
                            <InputField label="Tên Module" value={mod.title} onChange={(v: string) => { const na = [...arr]; na[idx].modules[midx].title = v; updateData(na); }} />
                            <ImageField label="Hình ảnh Module" value={mod.img} onChange={(v: string) => { const na = [...arr]; na[idx].modules[midx].img = v; updateData(na); }} />
                          </div>
                          <div className="flex flex-col gap-1 pt-6">
                            <button onClick={() => { const na = [...arr]; na[idx].modules = moveItem(na[idx].modules, midx, -1); updateData(na); }} className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 border rounded" title="Di chuyển lên" aria-label="Di chuyển lên"><ArrowUp className="w-3 h-3" /></button>
                            <button onClick={() => { const na = [...arr]; na[idx].modules = moveItem(na[idx].modules, midx, 1); updateData(na); }} className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 border rounded" title="Di chuyển xuống" aria-label="Di chuyển xuống"><ArrowDown className="w-3 h-3" /></button>
                            <button onClick={() => { const na = [...arr]; na[idx].modules = removeItem(na[idx].modules, midx); updateData(na); }} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 border rounded" title="Xóa" aria-label="Xóa"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sectionKey === "services" || sectionKey === "clients" || sectionKey === "testimonials") {
      // They all have { header: {}, items: [] } pattern
      return (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl border">
            <h4 className="font-semibold text-gray-800 mb-3">Phần Header</h4>
            <InputField label="Tiêu đề (Title)" value={parsedData.header?.title} onChange={(v: string) => updateData({ ...parsedData, header: { ...parsedData.header, title: v } })} />
            {sectionKey === "services" && (
              <>
                <InputField label="Tiêu đề phụ (Subtitle)" value={parsedData.header?.subtitle} onChange={(v: string) => updateData({ ...parsedData, header: { ...parsedData.header, subtitle: v } })} />
                <InputField label="Mô tả" value={parsedData.header?.description} onChange={(v: string) => updateData({ ...parsedData, header: { ...parsedData.header, description: v } })} isTextArea />
              </>
            )}
            {sectionKey === "clients" && (
              <InputField label="Badge" value={parsedData.header?.badge} onChange={(v: string) => updateData({ ...parsedData, header: { ...parsedData.header, badge: v } })} />
            )}
            {sectionKey === "testimonials" && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Chỉ số (Stats)</label>
                  <button onClick={() => updateData({ ...parsedData, header: { ...parsedData.header, stats: [...(parsedData.header?.stats || []), { value: "", label: "" }] } })} className="text-xs flex items-center text-blue-600 hover:text-blue-700">
                    <Plus className="w-3 h-3 mr-1" /> Thêm chỉ số
                  </button>
                </div>
                {(parsedData.header?.stats || []).map((st: any, sidx: number) => (
                  <div key={sidx} className="flex gap-2 items-start mb-2">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input type="text" value={st.value || ""} onChange={(e) => { const nd = { ...parsedData }; nd.header.stats[sidx].value = e.target.value; updateData(nd); }} className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded text-sm" placeholder="Value (e.g. 50+)" />
                      <input type="text" value={st.label || ""} onChange={(e) => { const nd = { ...parsedData }; nd.header.stats[sidx].label = e.target.value; updateData(nd); }} className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded text-sm" placeholder="Label (e.g. Học viên)" />
                    </div>
                    <button onClick={() => { const nd = { ...parsedData }; nd.header.stats = removeItem(nd.header.stats, sidx); updateData(nd); }} className="p-1.5 text-gray-400 hover:text-red-600 bg-white border rounded" title="Xóa" aria-label="Xóa"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">Danh sách Items</label>
              <button onClick={() => updateData({ ...parsedData, items: [...(parsedData.items || []), {}] })} className="text-xs flex items-center text-blue-600 hover:text-blue-700">
                <Plus className="w-3 h-3 mr-1" /> Thêm item
              </button>
            </div>
            <div className="space-y-4">
              {(parsedData.items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex gap-3 bg-gray-50 p-4 rounded-lg border">
                  <div className="flex-1">
                    {sectionKey === "services" && (
                      <>
                        <InputField label="Tiêu đề" value={item.title} onChange={(v: string) => { const nd = { ...parsedData }; nd.items[idx].title = v; updateData(nd); }} />
                        <InputField label="Đường dẫn (Href)" value={item.href} onChange={(v: string) => { const nd = { ...parsedData }; nd.items[idx].href = v; updateData(nd); }} />
                        <ImageField label="Hình ảnh" value={item.image} onChange={(v: string) => { const nd = { ...parsedData }; nd.items[idx].image = v; updateData(nd); }} />
                      </>
                    )}
                    {sectionKey === "clients" && (
                      <>
                        <InputField label="Tên đối tác" value={item.name} onChange={(v: string) => { const nd = { ...parsedData }; nd.items[idx].name = v; updateData(nd); }} />
                        <InputField label="Mô tả ngắn (Sub)" value={item.sub} onChange={(v: string) => { const nd = { ...parsedData }; nd.items[idx].sub = v; updateData(nd); }} />
                        <InputField label="Chi tiết" value={item.desc} onChange={(v: string) => { const nd = { ...parsedData }; nd.items[idx].desc = v; updateData(nd); }} isTextArea />
                        <ImageField label="Logo (Chữ / Ảnh URL)" value={item.logo} onChange={(v: string) => { const nd = { ...parsedData }; nd.items[idx].logo = v; updateData(nd); }} />
                        <ImageField label="Hình đại diện" value={item.img} onChange={(v: string) => { const nd = { ...parsedData }; nd.items[idx].img = v; updateData(nd); }} />
                      </>
                    )}
                    {sectionKey === "testimonials" && (
                      <>
                        <InputField label="Tên người đánh giá (Handle)" value={item.handle} onChange={(v: string) => { const nd = { ...parsedData }; nd.items[idx].handle = v; updateData(nd); }} />
                        <InputField label="Vai trò (Role)" value={item.role} onChange={(v: string) => { const nd = { ...parsedData }; nd.items[idx].role = v; updateData(nd); }} />
                        <InputField label="Nội dung đánh giá" value={item.text} onChange={(v: string) => { const nd = { ...parsedData }; nd.items[idx].text = v; updateData(nd); }} isTextArea />
                        <ImageField label="Hình đại diện" value={item.img} onChange={(v: string) => { const nd = { ...parsedData }; nd.items[idx].img = v; updateData(nd); }} />
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 pt-6">
                    <button onClick={() => updateData({ ...parsedData, items: moveItem(parsedData.items, idx, -1) })} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border rounded" title="Di chuyển lên" aria-label="Di chuyển lên"><ArrowUp className="w-3 h-3" /></button>
                    <button onClick={() => updateData({ ...parsedData, items: moveItem(parsedData.items, idx, 1) })} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border rounded" title="Di chuyển xuống" aria-label="Di chuyển xuống"><ArrowDown className="w-3 h-3" /></button>
                    <button onClick={() => updateData({ ...parsedData, items: removeItem(parsedData.items, idx) })} className="p-1.5 text-gray-400 hover:text-red-600 bg-white border rounded" title="Xóa" aria-label="Xóa"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (sectionKey === "resources_hero") {
      return (
        <div className="space-y-4">
          <InputField label="Tiêu đề" value={parsedData.title || ""} onChange={(v: string) => updateData({ ...parsedData, title: v })} />
          <InputField label="Mô tả" value={parsedData.description || ""} onChange={(v: string) => updateData({ ...parsedData, description: v })} isTextArea />
          <ImageField label="Hình ảnh" value={parsedData.image || ""} onChange={(v: string) => updateData({ ...parsedData, image: v })} />
        </div>
      );
    }

    if (sectionKey === "contact_hero") {
      return (
        <div className="space-y-4">
          <InputField label="Badge" value={parsedData.badge || ""} onChange={(v: string) => updateData({ ...parsedData, badge: v })} />
          <InputField label="Tiêu đề" value={parsedData.title || ""} onChange={(v: string) => updateData({ ...parsedData, title: v })} />
          <InputField label="Mô tả" value={parsedData.description || ""} onChange={(v: string) => updateData({ ...parsedData, description: v })} isTextArea />
        </div>
      );
    }

    if (sectionKey === "privacy_policy") {
      const arr = Array.isArray(parsedData.sections) ? parsedData.sections : [];
      return (
        <div className="space-y-6">
          <InputField label="Tiêu đề trang" value={parsedData.title || ""} onChange={(v: string) => updateData({ ...parsedData, title: v })} />
          <InputField label="Giới thiệu" value={parsedData.introduction || ""} onChange={(v: string) => updateData({ ...parsedData, introduction: v })} isTextArea />
          
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">Các điều khoản / Mục chính sách</label>
              <button onClick={() => updateData({ ...parsedData, sections: [...arr, { title: "", content: "" }] })} className="text-xs flex items-center text-blue-600 hover:text-blue-700">
                <Plus className="w-3 h-3 mr-1" /> Thêm mục
              </button>
            </div>
            <div className="space-y-4">
              {arr.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-3 bg-gray-50 p-4 rounded-lg border">
                  <div className="flex-1 space-y-3">
                    <InputField label={`Mục ${idx + 1}: Tiêu đề`} value={item.title || ""} onChange={(v: string) => { const newSections = [...arr]; newSections[idx] = { ...newSections[idx], title: v }; updateData({ ...parsedData, sections: newSections }); }} />
                    <InputField label={`Mục ${idx + 1}: Nội dung`} value={item.content || ""} onChange={(v: string) => { const newSections = [...arr]; newSections[idx] = { ...newSections[idx], content: v }; updateData({ ...parsedData, sections: newSections }); }} isTextArea />
                  </div>
                  <div className="flex flex-col gap-1 pt-6">
                    <button onClick={() => updateData({ ...parsedData, sections: moveItem(arr, idx, -1) })} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border rounded" title="Di chuyển lên" aria-label="Di chuyển lên"><ArrowUp className="w-3 h-3" /></button>
                    <button onClick={() => updateData({ ...parsedData, sections: moveItem(arr, idx, 1) })} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border rounded" title="Di chuyển xuống" aria-label="Di chuyển xuống"><ArrowDown className="w-3 h-3" /></button>
                    <button onClick={() => updateData({ ...parsedData, sections: removeItem(arr, idx) })} className="p-1.5 text-gray-400 hover:text-red-600 bg-white border rounded" title="Xóa" aria-label="Xóa"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-sm text-gray-500 py-10 text-center bg-gray-50 rounded-lg border border-dashed">
        Chưa hỗ trợ Form Editor cho section <strong>{sectionKey}</strong>. Vui lòng chuyển sang tab JSON.
      </div>
    );
  };

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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center border-b border-gray-200 bg-gray-50/50">
          <button
            onClick={() => handleTabChange("form")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all border-b-2 ${
              activeTab === "form"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            Biểu mẫu (Form)
          </button>
          <button
            onClick={() => handleTabChange("json")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all border-b-2 ${
              activeTab === "json"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FileJson className="w-4 h-4" />
            Mã JSON
          </button>
        </div>
        
        <div className="p-5">
          {activeTab === "form" ? (
            <div className="max-w-4xl">{renderForm()}</div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Chỉnh sửa trực tiếp mã JSON
                </label>
                <code className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  {sectionKey}
                </code>
              </div>
              <textarea
                value={rawJson}
                onChange={(e) => setRawJson(e.target.value)}
                rows={25}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[13px] font-mono resize-y"
                spellCheck={false}
                title="Mã JSON"
                placeholder="Nhập mã JSON tại đây..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
