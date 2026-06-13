"use client";

import { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Percent,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";

export default function RevenueAdmin() {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

  const revenueStats = [
    {
      label: "Tổng doanh thu",
      value: "148,250,000 đ",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      iconColor: "text-[#2271b1]",
      iconBg: "bg-[#f0f6fa]",
    },
    {
      label: "Số lượng đơn hàng",
      value: "84",
      change: "+8.3%",
      isPositive: true,
      icon: ShoppingCart,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      label: "Tỷ lệ chuyển đổi",
      value: "3.2%",
      change: "-1.5%",
      isPositive: false,
      icon: Percent,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
    },
    {
      label: "Doanh thu trung bình / đơn",
      value: "1,765,000 đ",
      change: "+4.2%",
      isPositive: true,
      icon: TrendingUp,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
    },
  ];

  const recentOrders = [
    { id: "#12544", name: "Nguyễn Văn Hùng", course: "IELTS Masterclass", amount: "2,490,000 đ", date: "13/06/2026", status: "Thành công" },
    { id: "#12543", name: "Trần Thị Tuyết", course: "Giao tiếp toàn diện", amount: "1,290,000 đ", date: "13/06/2026", status: "Thành công" },
    { id: "#12542", name: "Lê Minh Tuấn", course: "Writing & Speaking Intensive", amount: "3,200,000 đ", date: "12/06/2026", status: "Thành công" },
    { id: "#12541", name: "Phạm Minh Trang", course: "IELTS Foundation", amount: "1,890,000 đ", date: "11/06/2026", status: "Chờ xử lý" },
    { id: "#12540", name: "Vũ Hoàng Nam", course: "Giao tiếp toàn diện", amount: "1,290,000 đ", date: "10/06/2026", status: "Thành công" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f0f6fa] rounded-xl flex items-center justify-center border border-[#d9ebf5]">
            <TrendingUp className="w-5 h-5 text-[#2271b1]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Báo cáo Doanh thu</h1>
            <p className="text-sm text-gray-500">
              Thống kê thu nhập, đơn hàng và tỷ lệ chuyển đổi
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 500);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-[#c3c4c7] rounded bg-white hover:bg-gray-50 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Tải lại
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-[#2271b1] border border-[#135e96] rounded hover:bg-[#135e96] cursor-pointer transition-all font-medium">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-1 bg-white border border-[#c3c4c7] rounded p-0.5 w-fit">
        <button
          onClick={() => setTimeRange("week")}
          className={`px-3 py-1.5 text-xs rounded transition-all cursor-pointer ${
            timeRange === "week" ? "bg-[#2271b1] text-white font-medium" : "text-gray-650 hover:bg-gray-100"
          }`}
        >
          Tuần này
        </button>
        <button
          onClick={() => setTimeRange("month")}
          className={`px-3 py-1.5 text-xs rounded transition-all cursor-pointer ${
            timeRange === "month" ? "bg-[#2271b1] text-white font-medium" : "text-gray-650 hover:bg-gray-100"
          }`}
        >
          Tháng này
        </button>
        <button
          onClick={() => setTimeRange("year")}
          className={`px-3 py-1.5 text-xs rounded transition-all cursor-pointer ${
            timeRange === "year" ? "bg-[#2271b1] text-white font-medium" : "text-gray-650 hover:bg-gray-100"
          }`}
        >
          Năm nay
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-[#c3c4c7] rounded p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</span>
                <div className={`w-8 h-8 rounded flex items-center justify-center ${stat.iconBg}`}>
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <div className="flex items-center gap-1 text-xs">
                {stat.isPositive ? (
                  <span className="text-green-600 font-semibold flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5 inline mr-0.5" />
                    {stat.change}
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold flex items-center">
                    <ArrowDownRight className="w-3.5 h-3.5 inline mr-0.5" />
                    {stat.change}
                  </span>
                )}
                <span className="text-gray-400">so với kỳ trước</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Chart & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column */}
        <div className="bg-white border border-[#c3c4c7] rounded p-5 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Biểu đồ doanh số theo tuần</h3>
            <span className="text-xs text-gray-400">Đơn vị: Triệu VNĐ</span>
          </div>
          {/* Simple Chart Placeholder */}
          <div className="h-64 flex items-end justify-between gap-4 px-2 pt-6">
            {[24, 38, 18, 45, 32, 58, 41].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full flex justify-center">
                  {/* Tooltip */}
                  <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                    {val}M đ
                  </span>
                  <div
                    className="w-full bg-[#2271b1] hover:bg-[#135e96] transition-all rounded-t-sm"
                    style={{ height: `${(val / 60) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-medium">
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Column */}
        <div className="bg-white border border-[#c3c4c7] rounded p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Giao dịch gần đây</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[260px] overflow-y-auto pr-1">
            {recentOrders.map((order, idx) => (
              <div key={idx} className="py-3 flex justify-between items-start text-xs">
                <div>
                  <p className="font-bold text-gray-950">{order.name}</p>
                  <p className="text-gray-500 mt-0.5">{order.course}</p>
                  <p className="text-gray-400 mt-0.5">{order.date} • {order.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#2271b1]">{order.amount}</p>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium mt-1 ${
                    order.status === "Thành công" ? "bg-green-50 text-green-700 border border-green-250" : "bg-orange-50 text-orange-700 border border-orange-250"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
