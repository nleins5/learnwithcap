"use client";
import { useState, useEffect } from "react";
import { CoursePageEditor } from "../components";
import { supabase } from "@/lib/supabase";

export default function CoursePagesAdmin() {
  const [courses, setCourses] = useState<{ slug: string; title: string }[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("e-learning");

  useEffect(() => {
    async function fetchCourses() {
      const { data } = await supabase.from("ld_course_pages").select("slug, title").order("slug");
      if (data) setCourses(data);
    }
    fetchCourses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chọn trang khóa học để chỉnh sửa:</label>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title} ({c.slug})
              </option>
            ))}
            {!courses.find(c => c.slug === "e-learning") && <option value="e-learning">e-learning (Chưa tạo)</option>}
            {!courses.find(c => c.slug === "online-1-1") && <option value="online-1-1">online-1-1 (Chưa tạo)</option>}
            {!courses.find(c => c.slug === "enterprise") && <option value="enterprise">enterprise (Chưa tạo)</option>}
          </select>
        </div>
      </div>

      <CoursePageEditor slug={selectedSlug} />
    </div>
  );
}
