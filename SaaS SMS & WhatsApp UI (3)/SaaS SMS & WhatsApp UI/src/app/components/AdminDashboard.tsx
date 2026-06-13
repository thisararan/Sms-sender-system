import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, MessageSquare, DollarSign, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const usageData = [
  { month: 'Jan', sms: 45000, whatsapp: 32000, cost: 4200 },
  { month: 'Feb', sms: 52000, whatsapp: 38000, cost: 4800 },
  { month: 'Mar', sms: 48000, whatsapp: 41000, cost: 4600 },
  { month: 'Apr', sms: 61000, whatsapp: 45000, cost: 5400 },
  { month: 'May', sms: 58000, whatsapp: 52000, cost: 5800 },
  { month: 'Jun', sms: 67000, whatsapp: 59000, cost: 6500 },
];

const userActivityData = [
  { name: 'Active', value: 342 },
  { name: 'Inactive', value: 58 },
];

const COLORS = ['#3b82f6', '#e5e7eb'];

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '400',
      change: '+24 this month',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Messages This Month',
      value: '126,000',
      change: '+12.5% from last month',
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Monthly Revenue',
      value: '$6,500',
      change: '+8.2% from last month',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: 'Last 30 days',
      icon: Activity,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor system performance and usage metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trends */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-blue-600" />
              Usage & Cost Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="cost" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCost)" name="Cost ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Message Distribution */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Monthly Message Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="sms" fill="#3b82f6" name="SMS" radius={[8, 8, 0, 0]} />
                <Bar dataKey="whatsapp" fill="#10b981" name="WhatsApp" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Activity */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={userActivityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userActivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-3 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Active Users</span>
                </div>
                <span className="text-sm font-semibold">342</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-3 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-700">Inactive Users</span>
                </div>
                <span className="text-sm font-semibold">58</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-0 shadow-md lg:col-span-2">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { service: 'SMS Gateway', status: 'Operational', color: 'bg-green-500' },
                { service: 'WhatsApp API', status: 'Operational', color: 'bg-green-500' },
                { service: 'Database', status: 'Operational', color: 'bg-green-500' },
                { service: 'Web Server', status: 'Operational', color: 'bg-green-500' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`size-3 ${item.color} rounded-full animate-pulse`}></div>
                    <span className="font-medium text-gray-900">{item.service}</span>
                  </div>
                  <span className="text-sm text-green-600">{item.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-5 text-amber-600" />
            Recent System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { message: 'High API usage detected for user #1234', time: '5 mins ago', severity: 'warning' },
              { message: 'Scheduled maintenance on Sunday, 2 AM - 4 AM', time: '1 hour ago', severity: 'info' },
              { message: 'SMS delivery rate dropped to 94% temporarily', time: '2 hours ago', severity: 'warning' },
            ].map((alert, index) => (
              <div key={index} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  alert.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
