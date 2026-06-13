import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Users,
  Clock,
} from "lucide-react";

export default function UserDashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [charts, setCharts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    Promise.all([
      api.dashboard.stats().then((r) => r.json()),
      api.dashboard.charts().then((r) => r.json()),
    ])
      .then(([statsData, chartsData]) => {
        setStats(statsData.data || []);
        setCharts(chartsData.data || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
        // Set default data
        setStats([
          {
            title: "Total Messages",
            value: "0",
            change: "+0%",
            icon: MessageSquare,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
          },
          {
            title: "Scheduled",
            value: "0",
            change: "+0%",
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
          },
          {
            title: "Delivered",
            value: "0",
            change: "+0%",
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-100",
          },
          {
            title: "Growth",
            value: "0%",
            change: "+0%",
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
          },
        ]);
      });
  }, []);

  const messageData = [
    { name: "Mon", sms: 240, whatsapp: 221 },
    { name: "Tue", sms: 139, whatsapp: 229 },
    { name: "Wed", sms: 200, whatsapp: 200 },
    { name: "Thu", sms: 278, whatsapp: 208 },
    { name: "Fri", sms: 189, whatsapp: 248 },
    { name: "Sat", sms: 239, whatsapp: 200 },
    { name: "Sun", sms: 349, whatsapp: 210 },
  ];

  const successRateData = [
    { name: "Mon", rate: 98.2 },
    { name: "Tue", rate: 97.8 },
    { name: "Wed", rate: 99.1 },
    { name: "Thu", rate: 98.5 },
    { name: "Fri", rate: 99.3 },
    { name: "Sat", rate: 98.9 },
    { name: "Sun", rate: 99.5 },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your messages today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.isArray(stats) && stats.length > 0 ? (
          stats.map((stat) => (
            <Card
              key={stat.title}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <div
                    className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}
                  >
                    <stat.icon className="size-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-4 text-center py-12">
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages Over Time */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-blue-600" />
              Messages Sent This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={messageData}>
                <defs>
                  <linearGradient id="colorSms" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200"
                />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sms"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorSms)"
                  name="SMS"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="size-5 text-green-600" />
              Delivery Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={successRateData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200"
                />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis domain={[90, 100]} className="text-sm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 5 }}
                  name="Success Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="size-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">Total Contacts</span>
              </div>
              <span className="text-lg font-bold text-gray-900">4,892</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="size-5 text-green-600" />
                </div>
                <span className="text-sm text-gray-700">Active Campaigns</span>
              </div>
              <span className="text-lg font-bold text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <MessageSquare className="size-5 text-purple-600" />
                </div>
                <span className="text-sm text-gray-700">Templates</span>
              </div>
              <span className="text-lg font-bold text-gray-900">28</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="border-0 shadow-md lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  recipient: "+1 234 567 8901",
                  type: "SMS",
                  status: "Delivered",
                  time: "5 mins ago",
                  statusColor: "text-green-600",
                  bgColor: "bg-green-100",
                },
                {
                  recipient: "+1 234 567 8903",
                  type: "SMS",
                  status: "Failed",
                  time: "12 mins ago",
                  statusColor: "text-red-600",
                  bgColor: "bg-red-100",
                },
              ].map((message, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${message.bgColor} p-2 rounded-lg`}>
                      <MessageSquare
                        className={`size-4 ${message.statusColor}`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {message.recipient}
                      </p>
                      <p className="text-sm text-gray-500">{message.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-medium ${message.statusColor}`}
                    >
                      {message.status}
                    </span>
                    <p className="text-xs text-gray-500">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
