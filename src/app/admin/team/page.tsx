"use client";
import { CmsEditor } from "../components";

export default function TeamAdmin() {
  return (
    <CmsEditor
      title="Team Members"
      description="Quản lý danh sách thành viên đội ngũ giảng viên"
      table="ld_team"
      orderBy="display_order"
      fields={[
        {
          key: "name",
          label: "Tên tiếng Việt",
          type: "text",
          placeholder: "Nguyễn Văn A",
          required: true,
        },
        {
          key: "english_name",
          label: "Tên tiếng Anh",
          type: "text",
          placeholder: "Nguyen Van A",
        },
        {
          key: "img",
          label: "Ảnh đại diện (URL)",
          type: "url",
          placeholder: "https://...",
        },
        {
          key: "points",
          label: "Điểm nổi bật (JSON array)",
          type: "json",
          placeholder: '["10 năm kinh nghiệm", "IELTS 8.0"]',
          helpText: "Mảng các chuỗi mô tả điểm nổi bật",
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
      defaultValues={{ is_active: true, display_order: 1, points: [] }}
    />
  );
}
