"use client";
import { CmsEditor } from "../components";

export default function VisionMissionAdmin() {
  return (
    <CmsEditor
      title="Vision & Mission"
      description="Quản lý tầm nhìn và sứ mệnh của CAP"
      table="ld_vision_mission"
      singleRow
      readonlyList
      fields={[
        {
          key: "vision_title",
          label: "Tiêu đề Tầm nhìn",
          type: "text",
          placeholder: "Tầm nhìn",
          required: true,
        },
        {
          key: "vision_content",
          label: "Nội dung Tầm nhìn",
          type: "textarea",
          placeholder: "Mô tả tầm nhìn...",
        },
        {
          key: "mission_title",
          label: "Tiêu đề Sứ mệnh",
          type: "text",
          placeholder: "Sứ mệnh",
          required: true,
        },
        {
          key: "mission_content",
          label: "Nội dung Sứ mệnh",
          type: "textarea",
          placeholder: "Mô tả sứ mệnh...",
        },
        {
          key: "is_active",
          label: "Hiển thị",
          type: "toggle",
        },
      ]}
    />
  );
}
