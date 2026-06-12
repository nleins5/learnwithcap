"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/constants";
import {
  Users,
  UserPlus,
  Activity,
  Clock,
  BarChart3,
  LineChart,
  ArrowUpRight,
} from "lucide-react";

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("month");
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    newStudents: 0,
    activeStudents: 0,
    totalHours: 0,
  });
  const [tableStats, setTableStats] = useState<
    { name: string; label: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      const tables = [
        { table: TABLES.PAGE_SECTIONS, label: "Page Sections" },
        { table: TABLES.HOMEPAGE_INSIGHTS, label: "Insights" },
        { table: TABLES.TEAM, label: "Team Members" },
        { table: TABLES.RESOURCES, label: "Resources" },
        { table: TABLES.COURSE_PAGES, label: "Course Pages" },
        { table: TABLES.VISION_MISSION, label: "Vision & Mission" },
      ];

      const results = await Promise.all(
        tables.map(async (t) => {
          const { count } = await supabase
            .from(t.table)
            .select("*", { count: "exact", head: true });
          return { name: t.table, label: t.label, count: count || 0 };
        })
      );

      setTableStats(results);
      setStats({
        totalRegistrations: results.reduce((sum, r) => sum + r.count, 0),
        newStudents: 0,
        activeStudents: 0,
        totalHours: 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      label: "Tổng đăng ký",
      value: stats.totalRegistrations,
      change: "+12.5%",
      changeLabel: "so với kỳ trước",
      icon: Users,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
      borderColor: "border-blue-200",
      highlighted: true,
    },
    {
      label: "Học viên mới",
      value: stats.newStudents,
      change: "+4.3%",
      changeLabel: "so với kỳ trước",
      icon: UserPlus,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
      borderColor: "border-gray-200",
      highlighted: false,
    },
    {
      label: "Học viên Active",
      value: stats.activeStudents,
      change: "+8.1%",
      changeLabel: "đang hoạt động",
      icon: Activity,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50",
      borderColor: "border-gray-200",
      highlighted: false,
    },
    {
      label: "Tổng giờ học",
      value: stats.totalHours,
      change: "+15%",
      changeLabel: "tăng trưởng",
      icon: Clock,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50",
      borderColor: "border-gray-200",
      highlighted: false,
    },
  ];

  const timeRanges = [
    { key: "day" as const, label: "Ngày" },
    { key: "week" as const, label: "Tuần" },
    { key: "month" as const, label: "Tháng" },
    { key: "year" as const, label: "Năm" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Section Header ── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Học viên</h1>
            <p className="text-sm text-gray-500">
              Thống kê hoạt động và tăng trưởng
            </p>
          </div>
        </div>

        {/* Time Range Picker */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
          {timeRanges.map((range) => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                timeRange === range.key
                  ? "bg-gray-900 text-white font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
              >
                <div className="h-4 w-24 bg-gray-100 rounded mb-3"></div>
                <div className="h-8 w-10 bg-gray-100 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-100 rounded"></div>
              </div>
            ))
          : statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className={`bg-white rounded-xl border p-5 transition-all ${
                    card.highlighted
                      ? "border-blue-300 shadow-sm shadow-blue-100"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm text-gray-500">{card.label}</span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconBg}`}
                    >
                      <Icon className={`w-4 h-4 ${card.iconColor}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {card.value}
                  </p>
                  <p className="text-sm">
                    <span className="text-green-600 font-medium">
                      {card.change}
                    </span>{" "}
                    <span className="text-gray-400">{card.changeLabel}</span>
                  </p>
                </div>
              );
            })}
      </div>

      {/* ── Chart Section ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">
            Biểu đồ: Tổng đăng ký (Tháng này)
          </h3>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <LineChart className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <BarChart3 className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Simple Chart Placeholder */}
        <div className="h-48 flex items-end justify-between gap-2 px-2">
          {Array.from({ length: 12 }).map((_, i) => {
            const heights = [20, 35, 45, 30, 55, 40, 60, 50, 70, 45, 65, 55];
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-100 rounded-t-md transition-all hover:bg-blue-200"
                  style={{ height: `${heights[i]}%` }}
                />
                <span className="text-[10px] text-gray-400">
                  {["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"][i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CMS Content Overview ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Nội dung CMS</h3>
        <div className="divide-y divide-gray-100">
          {tableStats.map((stat) => (
            <div
              key={stat.name}
              className="flex items-center justify-between py-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {stat.label}
                </p>
                <p className="text-xs text-gray-400 font-mono">{stat.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">
                  {stat.count}
                </span>
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
