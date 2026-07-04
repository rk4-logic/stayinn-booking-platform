import { CalendarDays, Star } from "lucide-react";

interface DashboardStatsProps {
  totalBookings: number;
  totalReviews: number;
}

export default function DashboardStats({
  totalBookings,
  totalReviews,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: CalendarDays,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Reviews Written",
      value: totalReviews,
      icon: Star,
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl border p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}