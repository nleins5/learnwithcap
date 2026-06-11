"use client";
import { CmsEditor } from "../components";

export default function ResourcesAdmin() {
  return (
    <CmsEditor
      title="Resources (Tài nguyên)"
      description="Quản lý bài viết, blog và tài liệu học tập"
      table="ld_resources"
      orderBy="display_order"
      fields={[
        {
          key: "type",
          label: "Loại",
          type: "select",
          options: [
            { label: "Blog", value: "blog" },
            { label: "Guide", value: "guide" },
            { label: "Video", value: "video" },
            { label: "Ebook", value: "ebook" },
          ],
          required: true,
        },
        {
          key: "title",
          label: "Tiêu đề",
          type: "text",
          placeholder: "10 cách cải thiện kỹ năng giao tiếp...",
          required: true,
        },
        {
          key: "description",
          label: "Mô tả",
          type: "textarea",
          placeholder: "Mô tả ngắn...",
        },
        {
          key: "image",
          label: "Ảnh thumbnail (URL)",
          type: "url",
          placeholder: "https://...",
        },
        {
          key: "link",
          label: "Link bài viết",
          type: "url",
          placeholder: "https://...",
        },
        {
          key: "read_time",
          label: "Thời gian đọc",
          type: "text",
          placeholder: "5 min read",
        },
        {
          key: "display_order",
          label: "Thứ tự hiển thị",
          type: "number",
          placeholder: "1",
        },
        {
          key: "is_active",
          label: "Hiển thị",
          type: "toggle",
        },
      ]}
      defaultValues={{ is_active: true, display_order: 1, type: "blog" }}
    />
  );
}
