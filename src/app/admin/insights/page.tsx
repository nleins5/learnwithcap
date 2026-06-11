"use client";
import { CmsEditor } from "../components";

export default function InsightsAdmin() {
  return (
    <CmsEditor
      title="Insights (Bạn muốn & Khó khăn)"
      description="Quản lý các mục 'Bạn muốn gì?' và 'Khó khăn của bạn' trên trang chủ"
      table="ld_homepage_insights"
      orderBy="display_order"
      fields={[
        {
          key: "section",
          label: "Phân loại",
          type: "select",
          options: [
            { label: "Bạn muốn (wants)", value: "wants" },
            { label: "Khó khăn (difficulties)", value: "difficulties" },
          ],
          required: true,
        },
        {
          key: "text",
          label: "Nội dung",
          type: "text",
          placeholder: "Ví dụ: Giao tiếp tiếng Anh tự tin",
          required: true,
        },
        {
          key: "icon_name",
          label: "Icon name (Lucide)",
          type: "text",
          placeholder: "Ví dụ: Globe, BookOpen, Users",
          helpText: "Tên icon từ thư viện Lucide React",
        },
        {
          key: "bg_color",
          label: "Màu nền (hex)",
          type: "text",
          placeholder: "#EFF6FF",
        },
        {
          key: "is_highlighted",
          label: "Nổi bật",
          type: "toggle",
        },
        {
          key: "display_order",
          label: "Thứ tự hiển thị",
          type: "number",
          placeholder: "1",
        },
      ]}
    />
  );
}
