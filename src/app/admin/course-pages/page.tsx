"use client";
import { CmsEditor } from "../components";

export default function CoursePagesAdmin() {
  return (
    <CmsEditor
      title="Course Pages (Chi tiết khóa học)"
      description="Quản lý nội dung chi tiết từng trang khóa học (e-learning, online 1-1, enterprise)"
      table="ld_course_pages"
      orderBy="slug"
      fields={[
        {
          key: "slug",
          label: "Slug (URL)",
          type: "text",
          placeholder: "e-learning",
          required: true,
          helpText: "Dùng trong URL: /courses/{slug}",
        },
        {
          key: "title",
          label: "Tên khóa học",
          type: "text",
          placeholder: "Khóa E-Learning",
          required: true,
        },
        {
          key: "badge",
          label: "Badge",
          type: "text",
          placeholder: "Phổ biến nhất",
        },
        {
          key: "description",
          label: "Mô tả",
          type: "textarea",
          placeholder: "Mô tả ngắn về khóa học...",
        },
        {
          key: "hero_image",
          label: "Ảnh Hero",
          type: "url",
          placeholder: "https://...",
        },
        {
          key: "stats",
          label: "Thống kê (JSON)",
          type: "json",
          placeholder: '{"left": "98%", "leftLabel": "Hài lòng", "right": "500+", "rightLabel": "Học viên"}',
        },
        {
          key: "features",
          label: "Tính năng (JSON)",
          type: "json",
          placeholder: '{"image": "...", "quote": "...", "items": [...]}',
        },
        {
          key: "structure",
          label: "Cấu trúc khóa học (JSON)",
          type: "json",
          placeholder: '{"title": "...", "items": [...]}',
        },
        {
          key: "evaluation",
          label: "Đánh giá (JSON)",
          type: "json",
          placeholder: '{"title": "...", "desc": "...", "methods": [...]}',
        },
        {
          key: "cta_banner",
          label: "CTA Banner (JSON)",
          type: "json",
          placeholder: '{"title": "...", "desc": "...", "buttonText": "..."}',
        },
      ]}
    />
  );
}
